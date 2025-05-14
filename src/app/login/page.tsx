'use client'
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { useRouter } from "next/navigation"
import { useEffect } from "react";


export default function LoginPage() {
    const router = useRouter();

    const handleGuestLogin = async () => {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Guest login failed:", error);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/dashboard');
            }
        })
        return () => unsubscribe();

    }, [router]);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-orange-500">Welcome to TaskPilot</h1>
            <button onClick={handleGuestLogin}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                Login as guest
            </button>
        </main>
    )
}