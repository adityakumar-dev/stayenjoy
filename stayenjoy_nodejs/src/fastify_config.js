const fastify = require('fastify')({
logger: true
});

fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET,
    
})



module.exports = fastify