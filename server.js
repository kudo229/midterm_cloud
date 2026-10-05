const express = require('express');
const { engine } = require('express-handlebars');
const sessionMiddleware = require('./sessionConfig');
const { BookRead, BookWrite } = require('./models/Book');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionMiddleware);

// Cấu hình View Engine Handlebars
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

// CÁC THÔNG SỐ CÁ NHÂN HÓA THEO MSSV 23IT184
const PREFIX = '184'; // 3 số cuối MSSV
const LAST_DIGIT = 4; // Số cuối MSSV
const VAT_RATE = LAST_DIGIT + 5; // (4 + 5)% = 9%

// 1. TÍNH NĂNG XEM DANH SÁCH: Điều hướng tới tài khoản ĐỌC (BookRead)
app.get('/', async (req, res) => {
  try {
    const books = await BookRead.find().lean();

    // Đọc thông báo từ Stateless Session
    const error = req.session.error;
    const success = req.session.success;
    req.session.error = null;
    req.session.success = null;

    res.render('index', {
      books,
      vatPercent: VAT_RATE,
      error,
      success,
    });
  } catch (err) {
    res.status(500).send('Lỗi đọc dữ liệu qua kết nối Reader: ' + err.message);
  }
});

// 2. TÍNH NĂNG THÊM MỚI: Điều hướng tới tài khoản GHI (BookWrite)
app.post('/books', async (req, res) => {
  const { bookCode, title, basePrice } = req.body;

  // Thuật toán 1: Bộ lọc mã sản phẩm (bắt buộc tiền tố 184)
  if (!bookCode || !bookCode.startsWith(PREFIX)) {
    req.session.error = `Mã sách không hợp lệ! Bắt buộc phải bắt đầu bằng '${PREFIX}'.`;
    return res.redirect('/');
  }

  // Thuật toán 2: Tính thuế VAT động và làm tròn
  const price = parseFloat(basePrice);
  const finalPrice = Math.round(price * (1 + VAT_RATE / 100));

  try {
    const newBook = new BookWrite({
      bookCode,
      title,
      basePrice: price,
      vatRate: VAT_RATE,
      finalPrice: finalPrice,
    });

    // Ghi trực tiếp xuống Atlas qua luồng Writer
    await newBook.save();

    req.session.success = `Thêm sách '${title}' thành công với mức VAT ${VAT_RATE}%!`;
    res.redirect('/');
  } catch (err) {
    req.session.error = 'Lỗi ghi dữ liệu qua kết nối Writer: ' + err.message;
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`Server khởi chạy tại http://localhost:${PORT}`);
});
