# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:18-alpine as base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts . .

RUN yarn build:prod && \
    rm -rf webpack/ webpack.config.js

EXPOSE 4550
