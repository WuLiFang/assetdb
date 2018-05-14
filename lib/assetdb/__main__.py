"""Run as program.  """
import argparse
import logging
from pathlib import PurePath

from . import setting, wsgi
from .__about__ import __version__
from .database import setup


def main():
    desc = '吾立方资产数据库 {}'.format(__version__)
    parser = argparse.ArgumentParser(description=desc)
    parser.add_argument('-p', '--port', metavar='端口', type=int, required=False,
                        help='服务器运行端口')
    parser.add_argument('-r', '--root', metavar='根目录', type=PurePath, required=False,
                        help='数据库根目录')

    logging.basicConfig()
    args = parser.parse_args()
    if args.root:
        setting.ROOT = args.root.as_posix()
    setup()
    wsgi.serve(address=('0.0.0.0', args.port or 80))


if __name__ == '__main__':
    main()
