"""Aseetdb utility.   """

from pathlib import PurePath

from . import setting


def path(*other: (str, PurePath)) -> PurePath:
    """Get path relative to `setting.ROOT`.

    Returns:
        PurePath -- Absolute path under root.
    """

    ret = PurePath(setting.ROOT)
    for i in other:
        ret /= i
    return ret
