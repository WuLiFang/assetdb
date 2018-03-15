"""Assetdb web view.  """


from flask import Flask, g, jsonify, render_template, request, abort

from .database.core import connection

import sqlite3

APP = Flask(__name__)


@APP.route('/')
def main():
    return render_template('index.html')


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


@APP.route('/api/category', methods=('GET',))
def query_database():
    with get_conn() as conn:
        c = conn.cursor()
        c.execute('SELECT id, parent_id, name, path FROM category')
        ret = c.fetchall()
    print(ret)
    return jsonify(ret)
