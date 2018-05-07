"""Assetdb RESTful API about asset.  """


from flask_restful import Resource

from ... import setting
from ..app import API


class Root(Resource):
    """Root path setting.  """

    @staticmethod
    def get():
        """Get root path.  """
        return setting.ROOT


API.add_resource(Root, '/root')
