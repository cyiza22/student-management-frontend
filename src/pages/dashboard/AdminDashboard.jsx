import ManageStudents from './ManageStudents';
export default function AdminDashboard() {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-blackish mb-2">Admin Dashboard</h2>
            <ManageStudents />
        </div>
    );
}