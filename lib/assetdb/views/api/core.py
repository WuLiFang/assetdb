"""Core functionality for api.  """


from flask import g

from ...database import Session, session_scope


def database_session():
    """Get database session.  """

    if not hasattr(g, 'database_session'):
        g.database_session = Session()
    sess = g.database_session

    return session_scope(sess)
