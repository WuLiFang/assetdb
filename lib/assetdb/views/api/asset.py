"""Assetdb RESTful API about asset.  """

import logging
import os
from pathlib import PurePath

from flask import redirect, request, url_for
from flask_restful import Resource, reqparse
from werkzeug.utils import secure_filename

from ... import database, filetools
from ..app import API
from .core import database_session

LOGGER = logging.getLogger(__name__)


def _get_item(id_, session) -> database.Asset:
    return session.query(database.Asset).get(id_)


class Asset(Resource):
    """API for asset.  """

    @staticmethod
    def get(id_):
        """Get asset info from id.   """

        with database_session() as sess:
            item = _get_item(id_, sess)
            return item.serialize()

    @staticmethod
    def put(id_):
        """Edit asset info.  """

        parser = reqparse.RequestParser()
        parser.add_argument('category_id', type=int)
        parser.add_argument('name')
        parser.add_argument('files', type=list)
        parser.add_argument('description')
        args = parser.parse_args()

        with database_session() as sess:
            item = _get_item(id_, sess)

            item.name = args.name or item.name
            item.category_id = args.category_id or item.category_id
            item.description = args.description or item.description
            if args.files:
                files = sess.query(database.File).filter(
                    database.File.id.in_(args.files)).all()
                item.files = files

        return 'ok'

    @staticmethod
    def post(id_):
        """Post file under category folder.  """

        try:
            file_ = request.files['file']
        except KeyError:
            return 'No file part', 400
        if not file_.filename:
            return 'No selected file', 400
        name = request.form.get('name') or file_.filename
        filename = PurePath(name).with_suffix(PurePath(file_.filename).suffix)
        filename = secure_filename(str(filename))

        # Get dir.
        with database_session() as sess:
            item = _get_item(id_, sess)

            dir_ = item.path
            path = f'{dir_}/{filename}'

            # Save file.
            save_path = filetools.path(path)
            if os.path.exists(save_path):
                return 'Filename already inuse', 400
            LOGGER.debug('New file, save to: %s', save_path)
            file_.save(str(save_path))

            # Add asset item.
            asset_item = database.Asset(
                category_id=id_,
                name=name,
                path=path,
                mimetype=file_.mimetype,
                description=request.form.get('description')
            )
            sess.add(asset_item)

        return redirect(url_for('get_storage', filename=path))

    @staticmethod
    def delete(id_):
        """Delete a asset.  """

        with database_session() as sess:
            item = _get_item(id_, sess)
            sess.delete(item)

        return 'Deleted'


API.add_resource(Asset, '/asset/<id_>')


class AssetFiles(Resource):
    @staticmethod
    def get(id_):
        with database_session() as sess:
            item = _get_item(id_, sess)
            return [i.serialize() for i in item.files]


API.add_resource(AssetFiles, '/asset/<id_>/files')
