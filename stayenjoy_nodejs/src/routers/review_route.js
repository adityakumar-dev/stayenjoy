const fastify = require("../fastify_config");

fastify.get("/review/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const review = await Review.findById(id);
        reply.send(review);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});



fastify.get("/review/homestay/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const reviews = await Review.find({ homestayId: id });
        reply.send(reviews);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});


fastify.get("/review/user/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const reviews = await Review.find({ userId: id });
        reply.send(reviews);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});
    
fastify.post("/review", async (request, reply) => {
    try {
        const { userId, homestayId, rating, comment } = request.body;
        const review = await Review.create({ userId, homestayId, rating, comment });
        reply.send(review);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

fastify.put("/review/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const { rating, comment } = request.body;
        const review = await Review.findByIdAndUpdate(id, { rating, comment }, { new: true });
        reply.send(review);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});
    
fastify.delete("/review/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const review = await Review.findByIdAndDelete(id);
        reply.send(review);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});