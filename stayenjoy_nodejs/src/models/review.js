const fastify = require("../fastify_config");
const Review = require("../models/review");
const Homestay = require("../models/homestay");

// 🔥 Helper function to update homestay average rating
const updateHomestayRating = async (homestayId) => {
    const allReviews = await Review.find({ homestayId });
    if (allReviews.length === 0) {
        await Homestay.findByIdAndUpdate(homestayId, { totalRating: 0 });
    } else {
        const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = total / allReviews.length;
        await Homestay.findByIdAndUpdate(homestayId, { totalRating: avg });
    }
};

// ✅ Get review by ID
fastify.get("/review/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const review = await Review.findById(id);
        if (!review) {
            return reply.code(404).send({ message: "Review not found" });
        }
        reply.send(review);
    } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Get all reviews for a homestay
fastify.get("/review/homestay/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const reviews = await Review.find({ homestayId: id }).sort({ createdAt: -1 });
        reply.send(reviews);
    } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Get all reviews by a user
fastify.get("/review/user/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const reviews = await Review.find({ userId: id }).sort({ createdAt: -1 });
        reply.send(reviews);
    } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Create a review
fastify.post("/review", async (request, reply) => {
    try {
        const { userId, homestayId, rating, comment } = request.body;

        if (!userId || !homestayId || !rating || !comment) {
            return reply.code(400).send({ message: "All fields are required" });
        }

        if (rating < 1 || rating > 5) {
            return reply.code(400).send({ message: "Rating must be between 1 and 5" });
        }

        const review = await Review.create({ userId, homestayId, rating, comment });

        await updateHomestayRating(homestayId);

        reply.send(review);
    } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Update a review
fastify.put("/review/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const { rating, comment } = request.body;

        const review = await Review.findById(id);
        if (!review) {
            return reply.code(404).send({ message: "Review not found" });
        }

        if (rating && (rating < 1 || rating > 5)) {
            return reply.code(400).send({ message: "Rating must be between 1 and 5" });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { rating, comment },
            { new: true }
        );

        await updateHomestayRating(review.homestayId);

        reply.send(updatedReview);
    } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Delete a review
fastify.delete("/review/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            return reply.code(404).send({ message: "Review not found" });
        }

        await updateHomestayRating(review.homestayId);

        reply.send({ message: "Review deleted", review });
    } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ message: "Internal Server Error" });
    }
});
