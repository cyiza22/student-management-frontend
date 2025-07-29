import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import StudentProfile from './StudentProfile';

export default function Dashboard() {
    const { user } = useAuth();
    if (!user) return <p>Loading...</p>;
    return user.role === 'admin' ? <AdminDashboard /> : <StudentProfile />;
}