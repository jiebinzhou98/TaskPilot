'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <main className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-green-600 mb-4">TaskPilot 🚀</h1>
        <p className="text-gray-600 mb-8">Manage your tasks with ease.</p>
        <button onClick={() => router.push('/login')} 
        className="bg-blue-500 text-white px-6 py-3 hover:bg-blue-600 transition">
          Start Now
        </button>
      </main>
    </div>
  );
}
