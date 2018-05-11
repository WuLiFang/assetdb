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
