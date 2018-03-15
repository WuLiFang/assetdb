"""Database core functionality.   """

import sqlite3
from contextlib import contextmanager
from .. import setting, util


def connection() -> sqlite3.Connection:
    """Database connection.

    Returns:
        sqlite3.Connection -- Connection object.
    """

    return sqlite3.connect(str(util.path(setting.DATABASE)))


@contextmanager
def cursor():
    """Connection cursor.   """

    with connection() as conn:
        yield conn.cursor()
