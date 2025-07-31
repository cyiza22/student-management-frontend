import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileData {
    fullName: string;
    email: string;
    phone: string;
    course: string;
    enrollmentYear: number;
    status: 'Active' | 'Graduated' | 'Dropped';
}

const StudentProfile: React.FC = () => {
    const { user, setUser } = useAuth();
    const [profileData, setProfileData] = useState<ProfileData>({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        course: user?.course || '',
        enrollmentYear: user?.enrollmentYear || new Date().getFullYear(),
        status: user?.status || 'Active'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: name === 'enrollmentYear' ? parseInt(value) || new Date().getFullYear() : value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:5000/api/users/profile',
                profileData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setUser(response.data.user);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfileData({
            fullName: user?.fullName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            course: user?.course || '',
            enrollmentYear: user?.enrollmentYear || new Date().getFullYear(),
            status: user?.status || 'Active'
        });
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-green-600 text-white">
                    <h2 className="text-2xl font-bold">My Profile</h2>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profileData.fullName}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                        {profileData.fullName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                    {profileData.email}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                        {profileData.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course of Study
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="course"
                                        value={profileData.course}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g., Computer Science"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                        {profileData.course || 'Not specified'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enrollment Year
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="enrollmentYear"
                                        value={profileData.enrollmentYear}
                                        onChange={handleChange}
                                        min="2000"
                                        max="2030"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                        {profileData.enrollmentYear}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        profileData.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            profileData.status === 'Graduated' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                    }`}>
                                        {profileData.status}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Status can only be changed by admin</p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition duration-200"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;