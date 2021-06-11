FROM node
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser app
COPY payments_monitor/ .
RUN npm install
RUN chown -R app:app /opt/app
USER app
CMD [ "npm", "run", "start" ]