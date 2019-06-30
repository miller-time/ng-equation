FROM node:5

RUN npm install -g bower grunt-cli

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN bower install --allow-root
RUN grunt build

CMD [ "grunt", "test" ]