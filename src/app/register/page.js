'use client';

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
    
        if (error) {
            setError(error.message);
        } else {
            alert('Check your email to confirm registration!');
            router.push('/login');
        }
    
        setLoading(false);
    };
    return (
        // barebones registration form, change as needed
        // need to change popup
        <main>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                /><br />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </main>
    );
}