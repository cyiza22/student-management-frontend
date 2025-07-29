import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/dashboard');
        } catch (err) {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <input name="email" onChange={handleChange} placeholder="Email" required className="p-2 border" />
                <input name="password" onChange={handleChange} placeholder="Password" type="password" required className="p-2 border" />
                <button type="submit" className="bg-green-600 text-white p-2 rounded">Login</button>
            </form>
        </div>
    );
}
