'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient'; // adjust path if needed

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

  const goToLeaderboard = () => {
    router.push('/leaderboard');
  };

  return (
    <div style={{ height: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#153d66',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            background: 'white',
            borderRadius: '50%',
            marginRight: '1rem'
          }}></div>
         
        </div>
      </header>
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
