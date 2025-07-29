import { useState } from 'react';
export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const handleReset = () => alert(`Reset link sent to ${email}`);
    return (
        <div className="min-h-screen flex items-center justify-center bg-primary">
            <div className="bg-white shadow rounded p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-blackish">Reset Password</h2>
                <input
                    className="p-2 border rounded w-full mb-3"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleReset} className="bg-primary text-blackish p-2 rounded w-full">Send Reset Link</button>
            </div>
        </div>
    );
}