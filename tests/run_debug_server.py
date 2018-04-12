
import logging
import sys

from assetdb.database.util import setup
from assetdb.views import APP
from assetdb.wsgi import serve
from util import set_debug_settings


def main():
    logging.basicConfig(
        level=logging.DEBUG,
        format=('%(levelname)-6s[%(asctime)s]:'
                '%(filename)s:%(lineno)d:%(funcName)s: %(message)s'))
    set_debug_settings()
    setup()

    APP.run('localhost', 6001, True)

    # APP.debug = True
    # serve(('localhost', 6001), log=sys.stdout)


if __name__ == '__main__':
    main()
