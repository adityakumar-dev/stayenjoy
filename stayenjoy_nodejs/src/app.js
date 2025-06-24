require('dotenv').config();
const fastify = require('./fastify_config')
const connectDB = require('./config/db');
const { signup, signIn, checkEmail } = require('./routers/auth');
// connect to MongoDB
connectDB()

// routes
fastify.get('/', async (request, reply) => {
    reply.send('Hello World!');
});


fastify.post('/auth/signup', signup);
fastify.post('/auth/signin', signIn);
fastify.post('/auth/checkEmail', checkEmail);


fastify.listen({ port: process.env.PORT || 5000 }, (err, addr) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server running at ${addr}`);
});