const fastify = require('fastify')({
    logger: true
});
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    fastify.log.info('✅ MongoDB connected to homestay');
  } catch (err) {
    fastify.log.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
