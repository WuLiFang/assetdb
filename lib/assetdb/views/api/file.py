"""Assetdb RESTful API about asset.  """

import logging

from flask_restful import Resource

from ... import database
from ..app import API
from .core import database_session

LOGGER = logging.getLogger(__name__)


class File(Resource):
    """API for file.  """

    @staticmethod
    def _get_item(id_, session):
        return session.query(database.File).get(id_)

    @classmethod
    def get(cls, id_):
        """Get asset info from id.   """

        with database_session() as sess:
            return cls._get_item(id_, sess).serialize()

    @classmethod
    def delete(cls, id_):
        """Delete a asset.  """

        with database_session() as sess:
            item = cls._get_item(id_, sess)
            sess.delete(item)

        return 'Deleted'


API.add_resource(File, '/file/<id_>')
