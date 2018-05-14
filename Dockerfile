FROM python AS base

ENV PIP_INDEX_URL https://mirrors.aliyun.com/pypi/simple
RUN pip install pipenv && pipenv --version

FROM base AS build

COPY . /assetdb
WORKDIR /assetdb

RUN pipenv install --system --deploy
ENV PYTHONPATH=lib
ENV PYTHONIOENCODING=utf-8

FROM build AS test

RUN pip install pytest
RUN set -ex && python -m pytest ./tests

FROM build AS release

ENV LANG=en_US.utf-8
LABEL author="NateScarlet@Gmail.com"
ENV ASSETDB_ENGINE_URI="sqlite:////var/db/assetdb.db"
ENV ASSETDB_ROOT="/srv/assetdb"
CMD  ["python", "-m", "assetdb"]