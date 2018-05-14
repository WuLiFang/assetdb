"""Assetdb administration API.  """

import logging

from flask import make_response
from flask_restful import Resource, reqparse

from ... import database, setting
from ..app import API


class Admin(Resource):
    """Administration API.  """

    @staticmethod
    def get():
        """Get status.  """

        ret = {
            'ENGINE_URI': setting.ENGINE_URI,
            'ROOT': setting.ROOT
        }
        return ret

    @staticmethod
    def post():
        """Execute action.  """
        parser = reqparse.RequestParser()
        parser.add_argument('action', required=True)
        args = parser.parse_args()

        if args.action == 'scan':
            database.util.setup()
            return make_response('扫描完成')

        return make_response('未知操作', 400)


API.add_resource(Admin, '/admin')
