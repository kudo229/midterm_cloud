const session = require('express-session');
const ConnectMongo = require('connect-mongo');
require('dotenv').config();

// Xử lý linh hoạt cho mọi phiên bản connect-mongo (CJS / ESM interop)
const MongoStore = ConnectMongo.create
  ? ConnectMongo
  : ConnectMongo.default || ConnectMongo;

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'secret_23IT184',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_WRITE_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 ngày
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
});

module.exports = sessionMiddleware;
