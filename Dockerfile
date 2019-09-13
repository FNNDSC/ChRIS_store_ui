#
# Docker file for ChRIS store ui production server
#
# Build with
#
#   docker build -t <name> .
#
# For example if building a local version, you could do:
#
#   docker build -t local/chris_store_ui .
#
# In the case of a proxy (located at say 10.41.13.4:3128), do:
#
#    export PROXY="http://10.41.13.4:3128"
#    docker build --build-arg http_proxy=${PROXY} --build-arg UID=$UID -t local/chris_store_ui .
#
# To run an interactive shell inside this container, do:
#
#   docker run -ti local/chris_store_ui sh
#
# To pass an env var HOST_IP to container, do:
#
#   docker run -ti -e HOST_IP=$(ip route | grep -v docker | awk '{if(NF==11) print $9}') local/chris_store_ui sh
#

FROM node:12-alpine
MAINTAINER fnndsc "dev@babymri.org"

# Pass a UID on build command line (see above) to set internal UID
ARG UID=1001
ENV UID=$UID VERSION="0.1"

ENV APPROOT="/home/localuser/app"

RUN adduser -u $UID -D localuser

COPY --chown=localuser ["./build", "${APPROOT}"]

RUN cd "${APPROOT}"      \
  && su - localuser -c "yarn add serve --network-timeout 100000"

# Start as user localuser
USER localuser

WORKDIR $APPROOT
EXPOSE 3000

CMD /home/localuser/node_modules/serve/bin/serve.js --single -l 3000 .
