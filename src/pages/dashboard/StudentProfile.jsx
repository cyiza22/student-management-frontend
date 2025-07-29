import { useAuth } from '../../contexts/AuthContext';
export default function StudentProfile() {
    const { user } = useAuth();
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-blackish mb-2">My Profile</h2>
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Course:</strong> {user.course || 'N/A'}</p>
        </div>
    );
}