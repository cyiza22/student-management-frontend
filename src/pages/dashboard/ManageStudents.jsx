import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Student {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: 'student' | 'admin';
    course?: string;
    enrollmentYear?: number;
    status: 'Active' | 'Graduated' | 'Dropped';
}

interface ManageStudentsProps {
    onStatsUpdate: () => void;
}

const ManageStudents: React.FC<ManageStudentsProps> = ({ onStatsUpdate }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;

    // Form data for adding/editing students
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'student' as 'student' | 'admin',
        course: '',
        enrollmentYear: new Date().getFullYear(),
        status: 'Active' as 'Active' | 'Graduated' | 'Dropped'
    });

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data);
        } catch (error: any) {
            setError('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Filter and search students
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.course && student.course.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Pagination
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/users', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddForm(false);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                password: '',
                role: 'student',
                course: '',
                enrollmentYear: new Date().getFullYear(),
                status: 'Active'
            });
            fetchStudents();
            onStatsUpdate();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to add student');
        }
    };

    const handleEditStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/users/${editingStudent._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingStudent(null);
            fetchStudents();
            onStatsUpdate();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update student');
        }
    };

    const handleDeleteStudent = async (studentId: string) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/users/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchStudents();
            onStatsUpdate();
        } catch (error: any) {
            setError('Failed to delete student');
        }
    };

    const handleStatusChange = async (studentId: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/users/${studentId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchStudents();
            onStatsUpdate();
        } catch (error: any) {
            setError('Failed to update status');
        }
    };

    const handleRoleChange = async (studentId: string, newRole: string) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/users/${studentId}`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchStudents();
            onStatsUpdate();
        } catch (error: any) {
            setError('Failed to update role');
        }
    };

    const startEdit = (student: Student) => {
        setEditingStudent(student);
        setFormData({
            fullName: student.fullName,
            email: student.email,
            phone: student.phone,
            password: '',
            role: student.role,
            course: student.course || '',
            enrollmentYear: student.enrollmentYear || new Date().getFullYear(),
            status: student.status
        });
    };

    const cancelEdit = () => {
        setEditingStudent(null);
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            password: '',
            role: 'student',
            course: '',
            enrollmentYear: new Date().getFullYear(),
            status: 'Active'
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading students...</div>
        </div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Manage Students</h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                >
                    Add Student
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by name, email, or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                </div>
            </div>

            {/* Add Student Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
                        <h4 className="text-xl font-bold mb-4">Add New Student</h4>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleFormChange}
                                placeholder="Full Name"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                placeholder="Email"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormChange}
                                placeholder="Phone"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleFormChange}
                                placeholder="Password"
                                required
                                minLength={6}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleFormChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                            </select>
                            {formData.role === 'student' && (
                                <>
                                    <input
                                        name="course"
                                        value={formData.course}
                                        onChange={handleFormChange}
                                        placeholder="Course"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <input
                                        name="enrollmentYear"
                                        type="number"
                                        value={formData.enrollmentYear}
                                        onChange={handleFormChange}
                                        min="2000"
                                        max="2030"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </>
                            )}
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleFormChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Graduated">Graduated</option>
                                <option value="Dropped">Dropped</option>
                            </select>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium transition duration-200"
                                >
                                    Add Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg font-medium transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Form Modal */}
            {editingStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
                        <h4 className="text-xl font-bold mb-4">Edit Student</h4>
                        <form onSubmit={handleEditStudent} className="space-y-4">
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleFormChange}
                                placeholder="Full Name"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                placeholder="Email"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormChange}
                                placeholder="Phone"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleFormChange}
                                placeholder="New Password (leave blank to keep current)"
                                minLength={6}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleFormChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                            </select>
                            {formData.role === 'student' && (
                                <>
                                    <input
                                        name="course"
                                        value={formData.course}
                                        onChange={handleFormChange}
                                        placeholder="Course"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <input
                                        name="enrollmentYear"
                                        type="number"
                                        value={formData.enrollmentYear}
                                        onChange={handleFormChange}
                                        min="2000"
                                        max="2030"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </>
                            )}
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleFormChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Graduated">Graduated</option>
                                <option value="Dropped">Dropped</option>
                            </select>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium transition duration-200"
                                >
                                    Update Student
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg font-medium transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Students Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                                <div className="text-sm text-gray-500">{student.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.course || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {student.enrollmentYear || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    value={student.status}
                                    onChange={(e) => handleStatusChange(student._id, e.target.value)}
                                    className={`text-xs font-semibold rounded-full px-2 py-1 ${
                                        student.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            student.status === 'Graduated' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                    }`}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Graduated">Graduated</option>
                                    <option value="Dropped">Dropped</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    value={student.role}
                                    onChange={(e) => handleRoleChange(student._id, e.target.value)}
                                    className={`text-xs font-semibold rounded-full px-2 py-1 ${
                                        student.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    <option value="student">Student</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startEdit(student)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteStudent(student._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* No results message */}
            {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No students found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default ManageStudents;