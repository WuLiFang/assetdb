"""Assetdb RESTful API.  """

import logging
import sqlite3

from flask import Flask, abort, g, jsonify, render_template, request

from ..database import asset, category
from .app import APP
from .connection import get_conn

LOGGER = logging.getLogger(__name__)


class Category(object):
    """API for category.  """

    url = '/api/category'

    @staticmethod
    @APP.route(url, endpoint='Category', methods=('GET', 'POST', 'PUT', 'DELETE'))
    def dispatch():
        """Dispatch function call.  """

        cls = Category
        func = {
            'GET': cls.get,
            'POST': cls.post,
            'PUT': cls.put,
            'DELETE': cls.delete
        }[request.method]
        return func()

    @staticmethod
    def get():
        """Get all category from database.   """

        with get_conn() as conn:
            c = conn.cursor()
            c.execute('SELECT id, parent_id, name, path FROM category')
            ret = c.fetchall()
        LOGGER.debug(ret)
        return jsonify(ret)

    @staticmethod
    @APP.route(f'{url}/<id_>', methods=('GET',))
    def get_from_id(id_):
        """Get category from database with specific id.   """

        with get_conn() as conn:
            c = conn.cursor()
            c.execute(
                f'SELECT {", ".join(category.COLUMNS)} FROM {category.TABLE_NAME} WHERE id=?',
                (id_,))
            ret = c.fetchone()
        LOGGER.debug(ret)
        if not ret:
            abort(404, 'No such category.')
        return jsonify(ret)

    @staticmethod
    @APP.route(f'{url}/<id_>/assets', methods=('GET',))
    def get_assets(id_):
        """Get assets from database with specific category_id.   """

        with get_conn() as conn:
            c = conn.cursor()
            c.execute(
                f'SELECT {", ".join(asset.COLUMNS)} FROM {asset.TABLE_NAME} '
                f'WHERE category_id=?',
                (id_,))
            ret = c.fetchall()
        LOGGER.debug(ret)
        return jsonify(ret)

    @staticmethod
    def put():
        pass

    @staticmethod
    def post():
        pass

    @staticmethod
    def delete():
        pass


class Asset(object):
    """API for asset.  """

    url = '/api/asset'

    @staticmethod
    @APP.route(url, endpoint='Asset', methods=('GET', 'POST', 'PUT', 'DELETE'))
    def dispatch():
        """Dispatch function call.  """

        cls = Asset
        func = {
            'GET': cls.get,
            'POST': cls.post,
            'PUT': cls.put,
            'DELETE': cls.delete
        }[request.method]
        return func()

    @staticmethod
    def get():
        """Get all asset from database.   """

        with get_conn() as conn:
            c = conn.cursor()
            c.execute(
                f'SELECT {", ".join(asset.COLUMNS)} FROM {asset.TABLE_NAME}')
            ret = c.fetchall()
        LOGGER.debug(ret)
        return jsonify(ret)

    @staticmethod
    def put():
        pass

    @staticmethod
    def post():
        pass

    @staticmethod
    def delete():
        pass
