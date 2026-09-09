const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Định tuyến API chính
app.use('/api', apiRoutes);

// Bắt lỗi 404 cho route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    code: 0,
    msg: `Endpoint API không tồn tại: ${req.method} ${req.originalUrl}`,
    data: null,
  });
});

// Middleware xử lý lỗi tập trung
app.use(errorHandler);

module.exports = app;
