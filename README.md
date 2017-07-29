# zerto
### Technical task:
Create system that can execute code from provided JS files via the web service call and return the execution result.
The system should consist of the following parts:
* The script repository where user can put their scripts .
* The execution engine that can find and execute the requested script
* The service public endpoint that provides the interface for the external caller.
* The client that attempts to call the scripts stored in the repo.
### Usage:
You can run service using docker

```bashp
docker build .
docker run -p 3000:3000 -p 5672:5672 IMAGE_ID
```

or manually (nodejs 8 or later needed)

```bashp
npm install
npm start
```

To run unit tests
```bashp
npm test
```
### Web API
Single web endpoint can be found here:
GET http://127.0.0.1:3000/exec/:scriptName

You can test it with curl or browser.

### Message queue client
Also service is reachable using RabbitMQ, 
to test it you need specify RabbitMQ server url and set "rabbit.enabled" flag in config to true.
After that you can use RabbitMQ admin dashboard to send messages to zerto_rpc queue.

### Logs
Logs can be found in /logs dir.
