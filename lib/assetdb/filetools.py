"""Tools for file operations.  """

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

    path = PurePath(filename)
    if path.is_absolute():
        try:
            return PurePath(path.relative_to(setting.ROOT))
        except ValueError:
            raise exceptions.PathError(path)
    return path


def path(*other: (str, PurePath)) -> PurePath:
    """Get path relative to `setting.ROOT`.

    Returns:
        PurePath -- Absolute path under root.
    """

    ret = PurePath(setting.ROOT)
    for i in other:
        ret /= i
    return ret