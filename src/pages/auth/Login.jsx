import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/dashboard');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-primary">
            <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-blackish">Login</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input name="email" onChange={handleChange} placeholder="Email" required className="p-2 border rounded" />
                    <input name="password" type="password" onChange={handleChange} placeholder="Password" required className="p-2 border rounded" />
                    <button type="submit" className="bg-primary text-blackish p-2 rounded">Login</button>
                </form>
            </div>
        </div>
    );
}
