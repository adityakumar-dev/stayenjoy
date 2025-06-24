const fastify = require('../fastify_config')
const getJWTtokens = (payload)=>{
    return fastify.jwt.sign(payload)
}

const verifyJWTToken = (token)=>{
    return fastify.jwt.verify(token)
    
}

module.exports = {
    getJWTtokens,
    verifyJWTToken
}
    