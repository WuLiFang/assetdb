"""Assetdb RESTful API about asset.  """

import logging

from flask_restful import Resource

from ... import database
from ..app import API
from .core import database_session

LOGGER = logging.getLogger(__name__)


class FileManage(Resource):
    """All files in database.  """

    @staticmethod
    def get():
        """Get all file info.   """
        with database_session() as sess:
            return [i.serialize() for i in sess.query(database.File).all()]


API.add_resource(FileManage, '/file')


class File(Resource):
    """API for file.  """

    @staticmethod
    def _get_item(id_, session):
        return session.query(database.File).get(id_)

    @classmethod
    def get(cls, id_):
        """Get file info from id.   """

        with database_session() as sess:
            return cls._get_item(id_, sess).serialize()

    @classmethod
    def delete(cls, id_):
        """Delete a file.  """

        with database_session() as sess:
            item = cls._get_item(id_, sess)
            sess.delete(item)

        return 'Deleted'


API.add_resource(File, '/file/<id_>')
