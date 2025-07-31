import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManageStudents from './ManageStudents';

interface DashboardStats {
    totalStudents: number;
    activeStudents: number;
    graduatedStudents: number;
    droppedStudents: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalStudents: 0,
        activeStudents: 0,
        graduatedStudents: 0,
        droppedStudents: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Students', value: stats.totalStudents, color: 'bg-blue-500', icon: '👥' },
        { title: 'Active Students', value: stats.activeStudents, color: 'bg-green-500', icon: '✅' },
        { title: 'Graduated', value: stats.graduatedStudents, color: 'bg-purple-500', icon: '🎓' },
        { title: 'Dropped', value: stats.droppedStudents, color: 'bg-red-500', icon: '❌' }
    ];

    return (
        <div className="space-y-8">
            {/* Dashboard Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
                <p className="text-gray-600">Manage students and view system statistics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`${card.color} rounded-lg p-3 text-white text-2xl mr-4`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? '...' : card.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Student Management Section */}
            <div className="bg-white rounded-lg shadow">
                <ManageStudents onStatsUpdate={fetchStats} />
            </div>
        </div>
    );
};

export default AdminDashboard;