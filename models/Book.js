const mongoose = require('mongoose');
const { readConnection, writeConnection } = require('../db');

const bookSchema = new mongoose.Schema(
  {
    bookCode: { type: String, required: true },
    title: { type: String, required: true },
    basePrice: { type: Number, required: true },
    vatRate: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

// Điều hướng thẩm quyền: BookRead dùng luồng đọc, BookWrite dùng luồng ghi
const BookRead = readConnection.model('Book', bookSchema);
const BookWrite = writeConnection.model('Book', bookSchema);

module.exports = { BookRead, BookWrite };
