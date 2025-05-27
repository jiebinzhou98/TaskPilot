'use client'
import { useRouter } from "next/navigation";
import localFont from "next/font/local"


const wdXLLubrifont = localFont({
  src: "../fonts/wdxl-regular.otf",
})

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center animate-fade-in">
          <h1 className={`text-4xl ${wdXLLubrifont.className} text-gray-800 mb-3`}>TaskPilot</h1>
          <p className="text-gray-600 text-sm mb-6">Make plans. Get things done.</p>
          <button onClick={() => router.push('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition">
            🚀Start Now
          </button>
        </div>
      </main>
    </div>
  );
}
