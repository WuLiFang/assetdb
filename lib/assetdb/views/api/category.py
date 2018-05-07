"""Assetdb RESTful API about category.  """

import logging
import os
import sqlite3
from pathlib import PurePath

from flask import abort, jsonify, redirect, request, url_for
from flask_restful import Resource
from werkzeug.utils import secure_filename

from ... import util
from ...database import asset, category
from ..app import API
from ..connection import get_conn

LOGGER = logging.getLogger(__name__)


class Category(Resource):
    """API for category.  """

    url = '/api/category'

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
    def post():
        """Create new category.  """

        data = request.get_json()
        data = (data['path'], data['name'], data['parent_id'])
        if not all(data):
            abort(400, 'Invalid data.')

        conn = get_conn()
        c = conn.cursor()
        try:
            c.execute(
                f'INSERT INTO {category.TABLE_NAME}(path, name, parent_id) VALUES (?,?,?)', data)
        except sqlite3.IntegrityError as ex:
            return str(ex), 400
        conn.commit()
        return 'ok'


API.add_resource(Category, '/category')


class CategoryFromId(Resource):
    """API for category from id.  """

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
        """Change category info.  """

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
    def post(id_):
        """Post file under category folder.  """

        try:
            file_ = request.files['file']
        except KeyError:
            return 'No file part', 400
        if not file_.filename:
            return 'No selected file', 400
        name = request.form.get('name') or file_.filename
        filename = PurePath(name).with_suffix(PurePath(file_.filename).suffix)
        filename = secure_filename(str(filename))

        # Get dir.
        conn = get_conn()
        c = conn.cursor()
        c.execute(
            f'SELECT path FROM {category.TABLE_NAME} WHERE id=?', (id_,)
        )
        dir_ = c.fetchone()[0]
        path = f'{dir_}/{filename}'

        # Save file.
        save_path = util.path(path)
        if os.path.exists(save_path):
            return 'Filename already inuse', 400
        LOGGER.debug('New file, save to: %s', save_path)
        file_.save(str(save_path))

        # Add table item.
        try:
            data = (id_, name, path, file_.mimetype,
                    request.form.get('description'))
            LOGGER.debug('New asset: %s', data)
            c.execute(
                'INSERT INTO '
                f'{asset.TABLE_NAME}(category_id, name, path, memetype, description) '
                'VALUES (?,?,?,?,?)', data
            )
            conn.commit()
        except sqlite3.IntegrityError as ex:
            return str(ex), 400

        return redirect(url_for('get_storage', filename=path))

    @staticmethod
    def delete(id_):
        """Delete category.  """

        conn = get_conn()
        c = conn.cursor()
        c.execute(
            f'SELECT COUNT(*) FROM {category.TABLE_NAME} WHERE parent_id=?', (id_,))
        if c.fetchone()[0]:
            return 'Not empty: child category found.', 400
        c.execute(
            f'SELECT COUNT(*) FROM {asset.TABLE_NAME} WHERE category_id=?', (id_,))
        if c.fetchone()[0]:
            return 'Not empty: child asset found.', 400

        c.execute(
            f'DELETE FROM {category.TABLE_NAME} WHERE id=?', (id_,)
        )
        conn.commit()

        return 'Deleted'


API.add_resource(CategoryFromId, '/category/<id_>')


class CategoryAssets(Resource):
    """Api for category assets.  """

    @staticmethod
    def get(id_):
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


API.add_resource(CategoryAssets, '/category/<id_>/assets')


class CategoryCount(Resource):
    """Api for category asset count.  """

    @staticmethod
    def get(id_):
        """Get assets from database with specific category_id.   """

        with get_conn() as conn:
            c = conn.cursor()
            c.execute(
                f'SELECT COUNT(*) FROM {asset.TABLE_NAME} '
                f'WHERE category_id=?',
                (id_,))
            ret = c.fetchone()[0]
        LOGGER.debug(ret)
        return jsonify(ret)


API.add_resource(CategoryCount, '/category/<id_>/count')
