'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { useState } from 'react'

export default function LoginPage(){
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleGuestLogin = async () => {
        setLoading(true)

        const id = uuidv4();
        const email = `guest_${id}@taskpilot.com`
        const password = id;

        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });

        if(error && !error.message.includes(`User already registered`)){
            console.error('Sign up error:', error.message);
            return;
        }

        const {error: loginError} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if(loginError){
            console.error('login error:', loginError.message)
            return;
        }

        router.push('/dashboard');
    };

    return(
        <main className='min-h-screen flex items-center justify-center bg-gradient from-blue-100 to-indigo-100'>
            <div className='bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center animate-fade-in'>
                <h1 className='text-3xl font-bold text-gray-800 mb-4'>Welcome to TaskPilot 🔥
                    <p className='mb-6 text-gray-600 text-sm'>Your simple tast manager
                        <button 
                            onClick={handleGuestLogin} 
                            disabled={loading}
                            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded transition'>
                            {loading ? 'Logging in ...' : 'Continue as Guest 🚀'}
                        </button>
                    </p>
                </h1>
            </div>
        </main>
    )
}