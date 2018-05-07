"""Assetdb RESTful API about asset.  """

import logging

from flask_restful import Resource

from ... import database
from ..app import API
from .core import database_session

LOGGER = logging.getLogger(__name__)


class Asset(Resource):
    """API for asset.  """
    @staticmethod
    def get(id_):
        """Get asset info from id.   """

        with database_session() as sess:
            return sess.query(database.Asset).get(id_)

    @staticmethod
    def delete(id_):
        """Delete a asset.  """

        with database_session() as sess:
            asset = sess.query(database.Asset).get(id_)
            sess.delete(asset)

        return 'Deleted'


API.add_resource(Asset, '/asset/<id_>')
