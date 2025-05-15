'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export default function LoginPage(){
    const router = useRouter();

    const handleGuestLogin = async () => {
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
        <main className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white pg-8 rounded shadow max-w-md w-full text-center'>
                <h1 className='text-2xl font-bold mb-4'>Welcome to TaskPilot 🔥
                    <p className='mb-6 text-gray-600'>Start instantly as a guest
                        <button onClick={handleGuestLogin} className='bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600'>
                            Continue as Guest
                        </button>
                    </p>
                </h1>
            </div>
        </main>
    )
}