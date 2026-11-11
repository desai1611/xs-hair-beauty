require('dotenv').config({ quiet: true });
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Admin login cannot work without it.');
  process.exit(1);
}
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
  console.warn('JWT_SECRET is shorter than 32 characters. Use a long random value (see .env.example).');
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`XS Hair & Beauty API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
