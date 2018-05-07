"""Database utility.   """

import logging
import os

from . import asset, category, core, exceptions
from .. import setting

LOGGER = logging.getLogger(__name__)


def walk_root(dirpath_callback=(), filenames_callback=()):
    """Walk in root dir.  """

    for dirpath, _, filenames in os.walk(setting.ROOT):
        for i in dirpath_callback:
            i(dirpath)

        if os.path.normcase(dirpath) == os.path.normcase(setting.ROOT):
            # Top level files is for internal use.
            continue

        for i in filenames_callback:
            i(os.path.join(dirpath, i) for i in filenames)


def setup():
    core.setup()

    def _add_category(i):
        try:
            category.add_category(i)
        except exceptions.DuplicatePathError:
            pass

    walk_root(dirpath_callback=(_add_category,),
              filenames_callback=(asset.add_assets,))
