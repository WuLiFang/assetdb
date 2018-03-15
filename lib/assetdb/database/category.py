from pathlib import Path, PurePath
from .. import setting
from .core import cursor

TABLE_NAME = 'Category'
COLUMNS = ('id', 'parent_id', 'name', 'path')


def add_category(dirpath, name=None):
    with cursor() as c:
        dirpath = PurePath(dirpath)
        path = dirpath.relative_to(setting.ROOT).as_posix()
        parent_id = None
        try:
            parent_path = dirpath.parent.relative_to(
                setting.ROOT).as_posix()
            c.execute(
                f'SELECT id FROM {TABLE_NAME} WHERE path=?', (parent_path,))
            result = c.fetchone()
            if result:
                parent_id = result[0]
        except ValueError:
            pass

        name = dirpath.name
        data = (path, name, parent_id)
        c.execute(
            f'INSERT INTO {TABLE_NAME}(path, name, parent_id) VALUES (?,?,?)', data)


def setup():
    with cursor() as c:
        c.execute('CREATE TABLE IF NOT EXISTS '
                  f'{TABLE_NAME} ('
                  'id INTEGER PRIMARY KEY AUTOINCREMENT,'
                  f'parent_id INTEGER REFERENCES {TABLE_NAME}(id),'
                  'name TEXT,'
                  'path TEXT UNIQUE ON CONFLICT IGNORE'
                  ')',)
