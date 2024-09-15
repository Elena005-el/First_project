const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3003;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432
});

app.use(bodyParser.json());
app.use(cors());

app.post('/api/order', async (req, res) => {
    const { order, name, phone } = req.body;

    console.log('Received order:', { order, name, phone });

    if (!order || !name || !phone) {
        return res.status(400).json({ status: 'error', message: 'Все поля обязательны для заполнения.' });
    }

    try {
        const client = await pool.connect();
        const insertQuery = 'INSERT INTO orders ("order", name, phone) VALUES ($1, $2, $3)';
        await client.query(insertQuery, [order, name, phone]);
        client.release();

        res.json({ status: 'success' });
    } catch (err) {
        console.error('Ошибка при выполнении запроса', err.stack);
        res.status(500).json({ status: 'error', message: 'Внутренняя ошибка сервера' });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
