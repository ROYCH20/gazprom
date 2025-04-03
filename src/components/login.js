import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      alert(response.data.message);
      localStorage.setItem('token', response.data.token); // Сохранение токена
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Ошибка входа');
    }
  };

  return (
    <div className="login-container">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Пароль:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;
