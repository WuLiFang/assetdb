"""Tools for file operations.  """

import os
from pathlib import PurePath

from . import exceptions, setting


def relpath(filename):
    """Get relative path to root from filename.

    Args:
        filename (str): Filename

    Raises:
        exceptions.PathError: When path is not under root directory.

    Returns:
        PurePath: Relative path.
    """

    ret = PurePath(os.fsdecode(filename))
    if ret.is_absolute():
        try:
            return PurePath(ret.relative_to(setting.ROOT))
        except ValueError:
            raise exceptions.PathError(path)
    return ret


def path(*other: (str, PurePath)) -> PurePath:
    """Get path relative to `setting.ROOT`.

    Returns:
        PurePath -- Absolute path under root.
    """

    ret = PurePath(setting.ROOT)
    for i in other:
        ret /= os.fsdecode(i)
    return ret
