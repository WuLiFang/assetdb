# -*- coding=UTF-8 -*-
"""Use filter to convert filename between diffrent filesystem.  """

import locale
import os
import re
import string
import sys


def filter_filename(path, platform=None):
    """Filter path for unix/windows path convertion.

    Args:
        path (str): Path to replace.
        platform(str): Platform in `sys.platform` manner.
    Returns:
        str: Converted path.
    """

    try:
        filters = get_filename_filters(platform)
    except ValueError:
        return path

    for i in filters.split(','):
        if platform == 'win32':
            src, _, dst = i.partition(':')
        else:
            src, _, dst = i.rpartition(':')
        pattern = re.sub(r'[/\\]', r'[\\\\/]', src)
        pattern = '^{}'.format(pattern)
        path = re.sub(pattern, dst, path, 1, re.I)

    if platform == sys.platform:
        path = os.path.normpath(path)
    elif platform == 'win32':
        path = path.replace('/', '\\')
    else:
        path = path.replace('\\', '/')
    return path


def get_filename_filters(platform=None):
    """Get filename filter from environment.
        or use default if environment not set.
        platform (text_type, optional): Defaults to None.
            Target platform.

    Returns:
        text_type: Filters.
    """

    filters = os.getenv('FILENAME_FILTER', '')
    if not filters:
        if (platform or sys.platform) == 'win32':
            drive_letter_conv = [
                '/{}/:{}:/'.format(i.lower(), i) for i in string.ascii_uppercase]
        else:
            drive_letter_conv = [
                '{}:/:/{}/'.format(i, i.lower()) for i in string.ascii_uppercase]
        filters = ','.join(drive_letter_conv)
    filters += ','
    return filters


def get_unicode(input_bytes, codecs=('UTF-8', 'GBK')):
    """Return unicode string by try decode @input_bytes with @codecs.  """

    if isinstance(input_bytes, str):
        return input_bytes

    input_bytes = bytes(input_bytes)
    try:
        return input_bytes.decode()
    except UnicodeDecodeError:
        for i in tuple(codecs) + (sys.getfilesystemencoding(), locale.getdefaultlocale()[1]):
            try:
                return str(input_bytes, i)
            except UnicodeDecodeError:
                continue
    raise UnicodeDecodeError(input_bytes)
