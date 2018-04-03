"""Assetdb connection for views.  """


import sqlite3

from flask import Flask, abort, g, jsonify, render_template, request

from ..database.core import connection
from .app import APP


def get_conn() -> sqlite3.Connection:
    """Get database connection.   """

    if not hasattr(g, 'conn'):
        g.conn = connection()
    return g.conn


@APP.teardown_appcontext
def close_conn(error):
    """Close database connection.   """
    # pylint: disable=unused-argument

    if hasattr(g, 'conn'):
        g.conn.close()
