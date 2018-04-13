"""Database utility.   """

import os
import sqlite3

from . import asset, category
from .. import setting


def walk_root(dirpath_callback=(), filenames_callback=()):
    """Walk in root dir.  """

    for dirpath, _, filenames in os.walk(setting.ROOT):

        for i in dirpath_callback:
            try:
                i(dirpath)
            except sqlite3.IntegrityError:
                pass

        if os.path.normcase(dirpath) == os.path.normcase(setting.ROOT):
            # Top level files is for internal use.
            continue

        for i in filenames_callback:
            try:
                i(os.path.join(dirpath, i) for i in filenames)
            except sqlite3.IntegrityError:
                pass


def setup():
    category.setup()
    asset.setup()
    walk_root(dirpath_callback=(category.add_category,),
              filenames_callback=(asset.add_assets,))
