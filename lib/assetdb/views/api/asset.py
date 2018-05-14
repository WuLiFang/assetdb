"""Assetdb RESTful API about asset.  """

import logging

from flask import make_response
from flask_restful import Resource, reqparse

from ... import database
from ..app import API
from .core import database_session

LOGGER = logging.getLogger(__name__)


def _get_item(id_, session) -> database.Asset:
    return session.query(database.Asset).get(id_)


class AssetManage(Resource):
    @staticmethod
    def post():
        parser = reqparse.RequestParser()
        parser.add_argument('category_id', required=True)
        parser.add_argument('name', required=True)
        parser.add_argument('description')
        args = parser.parse_args()

        with database_session() as sess:
            item = database.Asset(
                name=args.name, category_id=args.category_id, description=args.description)
            sess.add(item)
            sess.commit()
            return item.serialize()


API.add_resource(AssetManage, '/asset')


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
        parser.add_argument('files', action='append')
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

        return make_response('资产编辑成功')

    @staticmethod
    def delete(id_):
        """Delete a asset.  """

        with database_session() as sess:
            item = _get_item(id_, sess)
            sess.delete(item)

        return make_response('资产已删除')


API.add_resource(Asset, '/asset/<id_>')


class AssetFiles(Resource):
    """Get asset related files.  """

    @staticmethod
    def get(id_):
        """Get files.  """

        with database_session() as sess:
            item = _get_item(id_, sess)
            return [i.serialize() for i in item.files]


API.add_resource(AssetFiles, '/asset/<id_>/files')
