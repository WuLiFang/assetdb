"""Assetdb RESTful API.  """

import logging

from flask import abort, jsonify, request

from ..database import asset, category
from .app import APP
from .connection import get_conn

LOGGER = logging.getLogger(__name__)


def dispatch(cls, *args, **kwargs):
    """Dispatch function call to class.  """

    return getattr(cls, request.method.lower())(*args, **kwargs)


class Category(object):
    """API for category.  """

    url = '/api/category'

    @staticmethod
    @APP.route(url, endpoint='Category', methods=('GET', 'POST', 'PUT', 'DELETE'))
    def _dispatch():
        return dispatch(Category)

    @staticmethod
    def get():
        """Get all category from database.   """

        with get_conn() as conn:
            c = conn.cursor()
            c.execute('SELECT id, parent_id, name, path FROM category')
            ret = c.fetchall()
        LOGGER.debug(ret)
        return jsonify(ret)


class CategoryFromId(object):
    """API for category from id.  """

    url = '/api/category/<id_>'

    @staticmethod
    @APP.route(url, endpoint='CategoryFromId', methods=('GET', 'POST', 'PUT', 'DELETE'))
    def _dispatch(id_):
        return dispatch(CategoryFromId, id_)

    @staticmethod
    def get(id_):
        """Get category from database with specific id.   """

        with get_conn() as conn:
            c = conn.cursor()
            c.execute(
                f'SELECT {", ".join(category.COLUMNS)} FROM {category.TABLE_NAME} WHERE id=?',
                (id_,))
            ret = c.fetchone()
        LOGGER.debug(ret)
        if not ret:
            LOGGER.warning('Get category failed : %s', id_)
            abort(404, 'No such category.')
        return jsonify(ret)

    @staticmethod
    def put(id_):
        data = request.get_json()
        name = data['name']

        conn = get_conn()
        c = conn.cursor()
        c.execute(
            f'UPDATE {category.TABLE_NAME} SET name=? WHERE id=?',
            (name, id_))
        conn.commit()

        LOGGER.debug(data)
        return 'ok'

    @staticmethod
    @APP.route(f'{url}/assets/', methods=('GET',))
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


class Asset(object):
    """API for asset.  """

    url = '/api/asset'

    @staticmethod
    @APP.route(url, endpoint='Asset', methods=('GET', 'POST', 'PUT', 'DELETE'))
    def dispatch():
        """Dispatch function call.  """

        return dispatch(Asset)

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
