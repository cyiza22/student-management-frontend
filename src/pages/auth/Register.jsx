import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'student',
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
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-primary">
            <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-blackish">Register</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input name="fullName" onChange={handleChange} placeholder="Full Name" required className="p-2 border rounded" />
                    <input name="email" onChange={handleChange} placeholder="Email" required className="p-2 border rounded" />
                    <input name="phone" onChange={handleChange} placeholder="Phone" required className="p-2 border rounded" />
                    <input name="password" type="password" onChange={handleChange} placeholder="Password" required className="p-2 border rounded" />
                    <select name="role" onChange={handleChange} className="p-2 border rounded">
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="bg-primary text-blackish p-2 rounded">Register</button>
                </form>
            </div>
        </div>
    );
}
