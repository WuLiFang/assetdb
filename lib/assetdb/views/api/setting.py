"""Assetdb RESTful API about asset.  """


from flask_restful import Resource, reqparse

from ... import setting
from ..app import API

from ...filename import filter_filename


class Root(Resource):
    """Root path setting.  """

    @staticmethod
    def get():
        """Get root path.  """
        parser = reqparse.RequestParser()
        parser.add_argument('platform')
        args = parser.parse_args()

        return filter_filename(setting.ROOT, None if not args.platform else args.platform.lower())


API.add_resource(Root, '/root')
