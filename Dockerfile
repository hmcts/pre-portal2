# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:18-alpine as base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts . .

# ---- Build image ----
FROM base as build

RUN cd angular && yarn build

RUN yarn build:prod && \
    rm -rf express/webpack/ express/webpack.config.js

# ---- Runtime image ----
FROM base as runtime

COPY --from=build $WORKDIR/express/src/main ./src/main
# TODO: expose the right port for your application
EXPOSE 4550
