"""Assetdb WSGI server.  """

import logging

from gevent.wsgi import WSGIServer

from .views import APP

LOGGER = logging.getLogger('wlf.assetdb')


def serve(address=('0.0.0.0', 6000), log=None):
    """Start server.
        port (tuple, optional): Defaults to ('0.0.0.0', 6000). Host address.

    Returns:
        tuple: Rusult port.
    """

    server = WSGIServer(address, APP, log=log)

    url = f'https://{address[0]}:{address[1]}'
    print(url)
    LOGGER.info('服务器运行于: %s', url)
    APP.logger.debug('Server ready')

    server.serve_forever()

    return address
