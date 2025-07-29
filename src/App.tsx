import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// TypeScript workaround for JSX imports
// @ts-ignore
import Login from './pages/auth/Login.jsx';
// @ts-ignore
import Register from './pages/auth/Register.jsx';
// @ts-ignore
import Dashboard from './pages/dashboard/Dashboard.jsx';
// @ts-ignore
import { AuthProvider } from './contexts/AuthContext.jsx';
import './index.css';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;