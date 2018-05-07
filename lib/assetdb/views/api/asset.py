"""Assetdb RESTful API about asset.  """

import logging
from pathlib import Path

from flask import jsonify
from flask_restful import Resource

from ... import util
from ...database import asset
from ..app import API
from ..connection import get_conn

LOGGER = logging.getLogger(__name__)


class Asset(Resource):
    """API for asset.  """
    @staticmethod
    def get(id_):
        """Get asset info from id.   """

        conn = get_conn()
        c = conn.cursor()
        c = conn.cursor()
        c.execute(
            f'SELECT {", ".join(asset.COLUMNS)} FROM {asset.TABLE_NAME} WHERE id=?', (id_,))
        ret = c.fetchone()
        LOGGER.debug(ret)
        return jsonify(ret)

    @staticmethod
    def delete(id_):
        """Delete a asset.  """

        conn = get_conn()
        c = conn.cursor()
        c.execute(f'SELECT path FROM {asset.TABLE_NAME} WHERE id=?', (id_,))
        path = c.fetchone()[0]
        Path(util.path(path)).unlink()

        c.execute(f'DELETE FROM {asset.TABLE_NAME} WHERE id=?', (id_,))
        conn.commit()
        LOGGER.info('Delete asset: %s', id_)

        return 'Deleted'


API.add_resource(Asset, '/asset/<id_>')
