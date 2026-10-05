const mongoose = require('mongoose');
require('dotenv').config();

// Luồng 1: Kết nối tài khoản CHỈ ĐỌC
const readConnection = mongoose.createConnection(process.env.MONGODB_READ_URI);
readConnection.on('connected', () =>
  console.log('✓ Kết nối thành công luồng ĐỌC (Reader)'),
);
readConnection.on('error', (err) =>
  console.error('✗ Lỗi kết nối luồng ĐỌC:', err.message),
);

// Luồng 2: Kết nối tài khoản GHI
const writeConnection = mongoose.createConnection(
  process.env.MONGODB_WRITE_URI,
);
writeConnection.on('connected', () =>
  console.log('✓ Kết nối thành công luồng GHI (Writer)'),
);
writeConnection.on('error', (err) =>
  console.error('✗ Lỗi kết nối luồng GHI:', err.message),
);

module.exports = { readConnection, writeConnection };
