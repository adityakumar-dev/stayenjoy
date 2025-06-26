const fastify = require("../fastify_config");
const Homestay = require("../models/homestay");
const Booking = require("../models/booking");
const Review = require('../models/review');

// ✅ Get Homestay by ID (with reviews and bookings)
fastify.get("/homestay/:id", async (request, reply) => {
    try {
        const { id } = request.params;
        const homestay = await Homestay.findOne({ _id: id, isActive: true });
        if (!homestay) {
            return reply.code(404).send({ message: "Homestay not found" });
        }
        const reviews = await Review.find({ homestayId: id });
        const bookings = await Booking.find({ homestayId: id });
        reply.send({ homestay, reviews, bookings });
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Get Homestays by City
fastify.get("/homestay/city/:city", async (request, reply) => {
    try {
        const { city } = request.params;
        const { page = 1, limit = 10 } = request.query;
        const homestays = await Homestay.find({ city, isActive: true })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });
        reply.send(homestays);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Get Homestays by Owner
fastify.get("/homestay/owner/:ownerId", async (request, reply) => {
    try {
        const { ownerId } = request.params;
        const homestays = await Homestay.find({ ownerUserId: ownerId, isActive: true });
        reply.send(homestays);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Get All Active Homestays (Global)
fastify.get("/homestay", async (request, reply) => {
    try {
        const { page = 1, limit = 10 } = request.query;
        const homestays = await Homestay.find({ isActive: true })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });
        reply.send(homestays);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Create Homestay (Developer/Owner)
fastify.post('/homestay', async (request, reply) => {
    try {
        const { name, description, price, images, city, location, gmapLink, type, amenities, maxGuests, availableRooms, bookingDate, ownerUserId } = request.body;

        if (!name || !description || !price || !images || !city || !location || !type || !maxGuests || !availableRooms || !ownerUserId) {
            return reply.code(400).send({ message: "Missing required fields" });
        }

        const homestay = await Homestay.create({
            name, description, price, images, city, location, gmapLink, type, amenities, maxGuests, availableRooms, bookingDate, ownerUserId
        });

        reply.send(homestay);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Update Homestay
fastify.put('/homestay/:id', async (request, reply) => {
    try {
        const { id } = request.params;
        const { name, description, price, images, city, location, gmapLink, type, amenities, maxGuests, availableRooms, bookingDate, ownerUserId } = request.body;

        const homestay = await Homestay.findByIdAndUpdate(id, {
            name, description, price, images, city, location, gmapLink, type, amenities, maxGuests, availableRooms, bookingDate, ownerUserId
        }, { new: true });

        if (!homestay) {
            return reply.code(404).send({ message: "Homestay not found" });
        }

        reply.send(homestay);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Soft Delete Homestay (Set isActive to false)
fastify.delete('/homestay/:id', async (request, reply) => {
    try {
        const { id } = request.params;
        const homestay = await Homestay.findByIdAndUpdate(id, { isActive: false }, { new: true });

        if (!homestay) {
            return reply.code(404).send({ message: "Homestay not found" });
        }

        reply.send({ message: "Homestay deactivated", homestay });
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
});
