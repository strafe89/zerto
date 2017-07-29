FROM node:7.10.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# commented because we do npm install and build in CI
# COPY package.json /usr/src/app/
# RUN npm install
# RUN npm run build
# for yarn
# COPY yarn.lock /usr/src/app/
# RUN yarn --ignore-engines

# Bundle app source
COPY . /usr/src/app

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

# no default command
# each service has its own run cmd, that defined in ./deploy/aws-ecs.sh
# CMD [ "npm", "run", "docker-dash" ]
