const hapi = require('hapi')
const pkg = require('../package.json')

const server = new hapi.Server()

server.connection({
  port: process.env.HTTP_PORT,
  routes: {
    cors: {
      origin: ['*'],
      additionalHeaders: ['x-requested-with', 'accept-language'],
    },
  },
})

server
  .register([
    // static file and directory handlers
    { register: require('inert') },
    // template rendering support
    { register: require('vision') },
    // log available routes on server start
    { register: require('blipp') },
    // server logging
    {
      register: require('good'),
      options: {
        ops: {
          interval: 1000,
        },
        reporters: {
          console: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{ log: '*', response: '*', request: '*', error: '*' }],
            },
            { module: 'good-console' },
            'stdout',
          ],
        },
      },
    },
    // api documentation
    {
      register: require('hapi-swagger'),
      options: {
        info: {
          title: `${pkg.name} documentation`,
          version: pkg.version,
        },
      },
    },
  ])
  .then(() => {
    server.start()
  })
  .then(() => {
    server.log('info', `Server started at ${server.info.uri}`)
  })
