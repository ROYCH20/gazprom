const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Настройка базы данных
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_db', // Укажите вашу базу данных
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
    } else {
        console.log('Подключение к базе данных успешно!');
    }
});

// API для входа
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        // Генерация JWT токена
        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
        res.json({ message: 'Вход успешен', token });
    });
});

// Запуск сервера
app.listen(5000, () => {
    console.log('Сервер запущен на порту 5000');
});
