const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

// Cấu hình Session Stateless: Lưu trực tiếp vào Cloud Atlas qua kết nối Ghi
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'secret_23IT184',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_WRITE_URI,
    collectionName: 'sessions', // Tự động tạo collection 'sessions' trên Atlas
    ttl: 24 * 60 * 60, // 1 ngày
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
});

module.exports = sessionMiddleware;
