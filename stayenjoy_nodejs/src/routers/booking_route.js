const fastify = require('../fastify_config')
const { createBooking, getBookingById, getBookingByUserId, getBookings, getBookingByHomestayId } = require('../controllers/booking_controller')
fastify.get("/booking/:id", getBookingById)

fastify.get("/booking/homestay/:id", getBookingByHomestayId)

fastify.get("/booking/user/:id", getBookingByUserId)

fastify.get("/booking", getBookings)


// ✅ Create Booking
fastify.post("/booking", createBooking);
