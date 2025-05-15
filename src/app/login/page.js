'use client';

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    };
  
    checkLogin();
  }, [router]);
  if (loading) return null;
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Please fill out the required fields");
    } else {
      router.push('/dashboard'); 
    }

    setLoading(false);
  };

  return (
    // barebones login form, change as needed ** Centered username
    <div style={{ height: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
      <main 
      style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', 
        alignItems: 'center', backgroundColor: '#f3f4f6' }}
      >
    <div style={{ backgroundColor: '#D9D9D9' }} 
      className="rounded-lg w-[551px] h-[235px] rounded-lg p-6 flex flex-col justify-center"
    >
      <form className="text-black mt-25" onSubmit={handleLogin}>
        
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
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          </div>
        </div>

        <div className="flex justify-center mt-2 min-h-[1.5rem]">
          {error && <p style={{ color: 'black' }}>{error}</p>}
        </div> 
      </form>
      <p className="mt-4 text-center max-w-md mx-auto">
        <a 
          href="/register" 
          className="hover:underline text-3xl"
          style={{ color: '#004878' }}>
        Don't have an account? Sign up!
        </a>
      </p>
    </div>
  </main>
  </div>
  );
}