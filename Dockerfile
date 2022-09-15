FROM node:latest AS builder

COPY . .

ARG GITHUB_SHA
ENV PUBLIC_URL /
ENV REACT_APP_NODE_URL "wss://rococo-basilisk-rpc.hydration.dev"
RUN yarn && yarn run build:rococo

FROM node:lts-slim

RUN npm -g install serve
WORKDIR /app

COPY --from=builder /build .

CMD serve -s

