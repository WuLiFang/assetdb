"""Assetdb RESTful API about asset.  """

import logging
import os
from pathlib import PurePath

from flask import redirect, request, url_for
from flask_restful import Resource
from werkzeug.utils import secure_filename

from ... import database, filetools
from ..app import API
from .core import database_session

LOGGER = logging.getLogger(__name__)


class Asset(Resource):
    """API for asset.  """

    @staticmethod
    def _get_item(id_, session):
        return session.query(database.Asset).get(id_)

    @classmethod
    def get(cls, id_):
        """Get asset info from id.   """

        with database_session() as sess:
            item = cls._get_item(id_, sess)
            return item.serialize()

    @classmethod
    def post(cls, id_):
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
            item = cls._get_item(id_, sess)

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

    @classmethod
    def delete(cls, id_):
        """Delete a asset.  """

        with database_session() as sess:
            item = cls._get_item(id_, sess)
            sess.delete(item)

        return 'Deleted'


API.add_resource(Asset, '/asset/<id_>')
