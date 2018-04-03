"""Assetdb RESTful API.  """

import sqlite3

from flask import Flask, abort, g, jsonify, render_template, request

from .app import APP
from .connection import get_conn
import logging
LOGGER = logging.getLogger(__name__)


class Category(object):
    """API for category.  """

    url = '/api/category'

    @staticmethod
    @APP.route(url, methods=('GET',))
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
                'SELECT id, parent_id, name, path FROM category WHERE id=?', (id_,))
            ret = c.fetchone()
        LOGGER.debug(ret)
        if not ret:
            abort(404, 'No such category.')
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
