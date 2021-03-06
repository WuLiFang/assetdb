"""Database core functionality.   """

import logging
from contextlib import contextmanager
from pathlib import PurePath

from sqlalchemy import TypeDecorator, Unicode, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm.session import sessionmaker

from .. import setting

Base = declarative_base()  # pylint: disable=invalid-name
Session = sessionmaker()  # pylint: disable=invalid-name
LOGGER = logging.getLogger(__name__)


@contextmanager
def session_scope(session=None):
    """Session scope context.  """

    sess = session or Session()

    try:
        yield sess
        sess.commit()
    except:
        sess.rollback()
        raise
    finally:
        sess.close()


class Path(TypeDecorator):
    """Path type."""
    # pylint: disable=abstract-method

    impl = Unicode

    def process_bind_param(self, value, dialect):
        if value is not None:
            value = str(value).replace('\\', '/')
            value = PurePath(value).as_posix()
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            value = PurePath(value)
        return value


class SerializableMixin(object):
    """Mixin for serialization.   """

    # pylint: disable=too-few-public-methods

    @classmethod
    def _encode(cls, obj):
        if isinstance(obj, PurePath):
            return obj.as_posix()
        return obj

    def serialize(self):
        """Serialize sqlalchemy object to dictionary.  """

        return {i.name: self._encode(getattr(self, i.name)) for i in self.__table__.columns}


def setup(engine_uri=None):
    engine_uri = engine_uri or setting.ENGINE_URI
    LOGGER.debug('Bind to engine: %s', engine_uri)
    engine = create_engine(engine_uri)
    Session.configure(bind=engine)
    Base.metadata.create_all(engine)
