FROM node:16

WORKDIR /usr/src/app
COPY package*.json .

RUN npm i

ENV domainId=0 \
    cookie='' \
    recitem='nas'\
    rectype='A' \
    dingAccessToken=''\
    dingSecret=''

COPY . .

CMD [ "node", "index.js" ]