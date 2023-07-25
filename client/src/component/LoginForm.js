import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Example login logic
    try {
      const response = await axios.post('/api/login', { username, password });
      
      if (response.status === 200) {
        // Extract JWT from the server's response
        const token = response.data.token; // Replace 'token' with the actual key in your server's response
  
        // Store the token in the localStorage
        localStorage.setItem('token', token);
  
        // Call the onLogin callback
        onLogin();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username" 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
      />
      <input type="submit" value="Login" />
    </form>
  );
}

export default LoginForm;