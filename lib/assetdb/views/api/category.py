"""Assetdb RESTful API about category.  """

import logging

from flask_restful import Resource, reqparse

from ... import database
from ..app import API
from .core import database_session

LOGGER = logging.getLogger(__name__)


class Category(Resource):
    """API for category.  """

    @staticmethod
    def get():
        """Get all category from database.   """

        with database_session() as sess:
            return [i.serialize() for i in sess.query(database.Category).all()]

    @staticmethod
    def post():
        """Create new category.  """

        parser = reqparse.RequestParser()
        parser.add_argument('path', required=True)
        parser.add_argument('name', required=True)
        parser.add_argument('parent_id', required=True)
        args = parser.parse_args()

        with database_session() as sess:
            item = database.Category(
                path=args.path, name=args.name, parent_id=args.parent_id)
            sess.add(item)

        return 'ok'


API.add_resource(Category, '/category')


class CategoryFromId(Resource):
    """API for category from id.  """

    @staticmethod
    def get_category(id_, session) -> database.Category:
        """Get category from id.

        Args:
            id_ (str): Category ID.
            session (sqlalchemy.orm.session.Session): Database session.

        Returns:
            database.Category: The category.
        """

        return session.query(database.Category).get(id_)

    @classmethod
    def get(cls, id_):
        """Get category from database with specific id.   """

        with database_session() as sess:
            return cls.get_category(id_, sess).serialize()

    @classmethod
    def put(cls, id_):
        """Change category info.  """

        parser = reqparse.RequestParser()
        parser.add_argument('name')
        parser.add_argument('parent_id')
        args = parser.parse_args()

        with database_session() as sess:
            item = cls.get_category(id_, sess)
            item.name = args.name or item.name
            item.parent_id = args.parent_id or item.parent_id

        return 'ok'

    @classmethod
    def delete(cls, id_):
        """Delete category.  """
        with database_session() as sess:
            item = cls.get_category(id_, sess)
            child_count = sess.query(database.Category).filter(
                database.Category.parent_id == item.id).count()
            if child_count:
                return f'Not empty: {child_count} child category found.', 400
            asset_count = sess.query(database.Asset).filter(
                database.Asset.category_id == item.id).count()
            if asset_count:
                return 'Not empty: child asset found.', 400
            sess.delete(item)

        return 'Deleted'


API.add_resource(CategoryFromId, '/category/<id_>')


class CategoryAssets(Resource):
    """Api for category assets.  """

    @staticmethod
    def get(id_):
        """Get assets from database with specific category_id.   """
        with database_session() as sess:
            result = sess.query(database.Asset).filter(
                database.Asset.category_id == id_).all()
            return [i.serialize() for i in result]


API.add_resource(CategoryAssets, '/category/<id_>/assets')


class CategoryCount(Resource):
    """Api for category asset count.  """

    @staticmethod
    def get(id_):
        """Get assets from database with specific category_id.   """

        with database_session() as sess:
            return sess.query(database.Asset).filter(database.Asset.category_id == id_).count()


API.add_resource(CategoryCount, '/category/<id_>/count')
