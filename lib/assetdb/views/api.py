"""Assetdb RESTful API.  """

import sqlite3

from flask import Flask, abort, g, jsonify, render_template, request

from .app import APP
from .connection import get_conn


class Category(object):
    url = '/api/category'
    # @staticmethod
    # def dispatch():
    #     func = {
    #         'GET': _get,
    #         'PUT': _put,
    #         'POST': _post,
    #         'DELETE': _delete
    #     }[request.method]
    #     return func()

    @staticmethod
    @APP.route(url, methods=('GET',))
    def get():
        with get_conn() as conn:
            c = conn.cursor()
            c.execute('SELECT id, parent_id, name, path FROM category')
            ret = c.fetchall()
        print(ret)
        return jsonify(ret)

    @staticmethod
    @APP.route(url, methods=('PUT',))
    def put():
        pass

    @staticmethod
    @APP.route(url, methods=('POST',))
    def post():
        pass

    @staticmethod
    @APP.route(url, methods=('DELETE',))
    def delete():
        pass
