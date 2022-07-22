FROM node:latest AS builder

COPY . .

ARG GITHUB_SHA
ENV PUBLIC_URL /
ENV REACT_APP_NODE_URL "wss://rpc-01.basilisk-rococo.hydradx.io"
RUN yarn && yarn run build

FROM node:lts-slim

RUN npm -g install serve
WORKDIR /app

COPY --from=builder /build .

CMD serve -s

