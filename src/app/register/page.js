'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient'; // adjust path if needed
import { useEffect } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // redirect if already logged in
  useEffect(() => {
    async function checkLogin() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }else {
        setLoading(false);
      }
    }
  
    checkLogin();
  }, [router]);
  if (loading) return null;
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Sign up with email and password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          username: username,
          current_streak: 0,
          longest_streak: 0,
          badge_level: 'bronze',
        },
      ]);
        
      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
      
      alert('Check your email to confirm registration!');
      router.push('/login');
    }

    setLoading(false);
  };

  const goToLeaderboard = () => {
    router.push('/leaderboard');
  };

  return (
    <div style={{ height: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
     
    <main style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', 
        alignItems: 'center', backgroundColor: '#f3f4f6' }}>
            <div style={{ backgroundColor: '#D9D9D9' }} 
            className="rounded-lg w-[551px] h-[235px] rounded-lg p-6 flex flex-col justify-center"
            >
        <form className="text-black mt-15" onSubmit={handleRegister}>

            <div className="flex items-center space-x-2 mb-4 max-w-md mx-auto">
                <label htmlFor="email" className="w-20 text-right text-black">
                Email:
                </label>
                <input
                    id="email"
                    type="email"
                    onChange={(e) => {{setEmail(e.target.value)}; setError('');}}
                    
                    className="bg-white border border-black rounded-lg p-2 w-80"
                />
            </div>

            <div className="flex items-center space-x-2 mb-4 max-w-md mx-auto">
                <label htmlFor="username" className="w-20 text-right text-black">
                Username:
                </label>
                <input
                    id="username"
                    type="text"
                    onChange={(e) => {setUsername(e.target.value); setError('');}}
                    className="bg-white border border-black rounded-lg p-2 w-80"
                />
            </div>

           <div className="flex items-center space-x-2 mb-4 max-w-md mx-auto">
            <label htmlFor="password" className="w-20 text-right text-black">
                Password:
            </label>
            <input
                id="password"
                type="password"
                onChange={(e) => {setPassword(e.target.value); setError('');}}
                className="bg-white border border-black rounded-lg p-2 w-80"
            />
            </div>

             {/*The login button*/}
            <div className="max-w-md mx-auto mb-4">
                <div className="ml-48">
                    <button
                        type="submit"
                        disabled={loading}
                        style= {{backgroundColor: '#004878'}}
                        className="text-white px-4 py-2 rounded-lg"
                    >
                {loading ? 'Registering...' : 'Register'}
            </button>

            </div>
            <div className="flex justify-center mt-2 min-h-[1.5rem]">
                {error && <p style={{ color: 'black' }}>{error}</p>}
            </div> 

          </div>
        </form>
      </div>
    </main>
    </div>
  );
}
