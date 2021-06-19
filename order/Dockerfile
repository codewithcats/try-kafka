FROM node:14-alpine

USER node
WORKDIR /src/
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --only-production
COPY index.js ./
ENTRYPOINT [ "node", "." ]
