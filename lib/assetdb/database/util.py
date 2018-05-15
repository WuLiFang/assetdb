"""Database utility.   """

import logging
import os

from . import core
from .. import exceptions, mimecheck, setting
from ..filetools import relpath
from .asset import Asset
from .category import Category
from .core import session_scope
from .file import File
from ..filename import get_unicode as u
LOGGER = logging.getLogger(__name__)


def add_asset(filenames, session, name, category_id):
    """Add new asset from path

    Args:
        files (tuple[str]): File path list.
        session (sqlalchemy.orm.session.Session): Database session.
        name (str): Asset name as a label.
        category_id (int): ID of the parent category.

    Raises:
        exceptions.PathError: When path is outside the root directory.
        exceptions.DuplicatePathError: When path already in database.
    """

    files = []
    for i in filenames:
        path = relpath(i)
        if session.query(File).filter(File.path == path).first():
            continue
        item = File.add(path, session)
        files.append(item)

    if not files:
        return

    try:
        thumb = next(i for i in files
                     if mimecheck.is_mimetype(i.path, 'image'))
    except StopIteration:
        thumb = None

    session.add_all(files)

    asset = Asset(
        category_id=category_id,
        name=name,
        files=files,
        thumbnail=thumb
    )
    session.add(asset)


def add_assets(filenames, session):
    """Add many assets.  """
    for i in filenames:
        path = relpath(i)

        category = session.query(Category).filter(
            Category.path == path.parent).one_or_none()
        if not category:
            continue

        try:
            add_asset((i,), session, path.name, category.id)
        except (exceptions.PathError, exceptions.DuplicatePathError):
            continue


def walk_root(dirpath_callback=(), filenames_callback=()):
    """Walk in root dir.  """

    with session_scope() as sess:
        for dirpath, _, filenames in os.walk(setting.ROOT.encode('utf-8')):
            dirpath = u(dirpath)
            for i in dirpath_callback:
                i(dirpath, session=sess)

            if os.path.normcase(dirpath) == os.path.normcase(setting.ROOT):
                # Top level files is for internal use.
                continue

            for i in filenames_callback:
                i([os.path.join(dirpath, u(j))
                   for j in filenames], session=sess)


def setup():
    core.setup()

    def _add_category(i, session):
        try:
            Category.add(i, session)
        except exceptions.DuplicatePathError:
            pass

    walk_root(dirpath_callback=(_add_category,),
              filenames_callback=(add_assets,))
