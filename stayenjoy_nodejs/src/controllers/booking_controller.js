
const Booking = require('../models/booking')
const Homestay = require('../models/homestay')
const createBooking = async(request,reply)=>{
    try {
        const { userId, homestayId, checkIn, checkOut, totalGuests, roomsBooked, pricePerNight, totalPrice } = request.body;

        if (!userId || !homestayId || !checkIn || !checkOut || !totalGuests || !roomsBooked || !pricePerNight || !totalPrice) {
            return reply.code(400).send({ message: "Missing required fields" });
        }

        const booking = await Booking.create({
            userId, 
            homestayId, 
            checkIn, 
            checkOut, 
            totalGuests, 
            roomsBooked, 
            pricePerNight, 
            totalPrice, 
            status: "confirmed"
        });

        // ✅ Update bookingDate in Homestay
        const stay = await Homestay.findById(homestayId);
        if (!stay) {
            return reply.code(404).send({ message: "Homestay not found" });
        }

        const bookingDates = stay.bookingDate;
        const existingDate = bookingDates.find((b) => b.date === checkIn);

        if (existingDate) {
            existingDate.count += roomsBooked;
        } else {
            bookingDates.push({ date: checkIn, count: roomsBooked });
        }

        stay.bookingDate = bookingDates;
        await stay.save();

        reply.send({ message: "Booking successful", booking });

    } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ message: "Internal Server Error" });
    }
}


const getBookingById = async (request, reply)=>{
    try {
        const { id } = request.params;
        const booking = await Booking.findById( { _id : id } );
        reply.send(booking);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
}

const getBookingByUserId = async (request, reply)=>{
    try {
        const { id } = request.params;
        const bookings = await Booking.find({ userId : id });
        reply.send(bookings);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
}
const getBookings = async (request, reply) => {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = 50;
      const skip = (page - 1) * limit;
  
      const bookings = await Booking.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // optional: latest first
  
      const total = await Booking.countDocuments();
      const totalPages = Math.ceil(total / limit);
  
      reply.send({
        page,
        totalPages,
        totalBookings: total,
        bookings,
      });
  
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ message: "Internal Server Error" });
    }
  };
  
const getBookingByHomestayId = async (request, reply)=>{
    try {
        const { id } = request.params;
        const bookings = await Booking.find({ homestayId : id });
        reply.send(bookings);
    } catch (error) {
        fastify.log.error(error)
        reply.code(500).send({ message: "Internal Server Error" });
    }
}
module.exports = {
    createBooking,
    getBookingById,
    getBookingByUserId,
    getBookings,
    getBookingByHomestayId
}