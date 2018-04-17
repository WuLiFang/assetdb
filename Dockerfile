FROM python AS base

ENV PIP_INDEX_URL https://mirrors.aliyun.com/pypi/simple
RUN pip install pipenv && pipenv --version

FROM base AS build

COPY . /assetdb
WORKDIR /assetdb

# Install dependencies
RUN pipenv install --system --deploy

# Set environment
ENV PYTHONPATH=lib
ENV LANG=en_US.utf-8

FROM build AS test

RUN pip install pytest
RUN set -ex && python -m pytest ./tests

FROM build AS release

LABEL author="NateScarlet@Gmail.com"
CMD  ["-p", "80", "-r", "/srv/assetdb"]
ENTRYPOINT ["python", "-m", "assetdb"]