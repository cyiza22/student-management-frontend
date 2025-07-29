import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'student', // default
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            navigate('/login');
        } catch (error) {
            alert('Registration failed!');
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold">Register</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <input name="fullName" onChange={handleChange} placeholder="Full Name" required className="p-2 border" />
                <input name="email" onChange={handleChange} placeholder="Email" required className="p-2 border" />
                <input name="phone" onChange={handleChange} placeholder="Phone" required className="p-2 border" />
                <input name="password" onChange={handleChange} placeholder="Password" type="password" required className="p-2 border" />
                <select name="role" onChange={handleChange} className="p-2 border">
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
}