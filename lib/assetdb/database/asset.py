"""Asset database.   """

from pathlib import PurePath

from .. import setting, util
from .core import cursor
from . import category
import mimetypes
from . import exceptions


TABLE_NAME = 'Asset'
COLUMNS = ('id', 'category_id', 'name', 'path', 'memetype', 'description')


def add_asset(path, name=None):
    path = PurePath(path)
    name = name or path.name
    memetype, _ = mimetypes.guess_type(path.as_posix())
    category_path = path.parent.relative_to(setting.ROOT).as_posix()

    try:
        path = path.relative_to(setting.ROOT)
    except ValueError:
        raise exceptions.AssetPathError(path)

    with cursor() as c:
        c.execute(
            f'SELECT id FROM {category.TABLE_NAME} WHERE path=?', (category_path,))
        result = c.fetchone()
        category_id = result[0]

        data = (category_id, name, path.as_posix(), memetype)
        c.execute(
            'INSERT INTO '
            f'{TABLE_NAME}(category_id, name, path, memetype) '
            'VALUES (?,?,?,?)', data)


def add_assets(filenames):
    for i in filenames:
        try:
            add_asset(i)
        except exceptions.AssetPathError:
            continue


def setup():
    with cursor() as c:
        c.execute('CREATE TABLE IF NOT EXISTS '
                  f'{TABLE_NAME} ('
                  'id INTEGER PRIMARY KEY AUTOINCREMENT,'
                  f'category_id INTEGER REFERENCES {category.TABLE_NAME}(id),'
                  'name TEXT,'
                  'path TEXT UNIQUE ON CONFLICT IGNORE,'
                  'memetype TEXT,'
                  'description TEXT'
                  ')',)
