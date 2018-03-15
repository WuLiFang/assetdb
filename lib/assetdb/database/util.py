"""Database utility.   """

import os
from .. import setting
from . import category, asset


def walk_root(dirpath_callback=(), filenames_callback=()):
    for dirpath, _, filenames in os.walk(setting.ROOT):

        for i in dirpath_callback:
            i(dirpath)

        if os.path.normcase(dirpath) == os.path.normcase(setting.ROOT):
            # Top level files is for internal use.
            continue

        for i in filenames_callback:
            i(os.path.join(dirpath, i) for i in filenames)


def setup():
    category.setup()
    asset.setup()
    walk_root(dirpath_callback=(category.add_category,),
              filenames_callback=(asset.add_assets,))
