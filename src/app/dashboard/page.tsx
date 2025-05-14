'use client';

import { useEffect, useState, FormEvent } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, Timestamp, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { title } from 'process';

export default function DashboardPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState<{ id: string, title: string}[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        await fetchTasks(user.uid);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchTasks = async (uid: string) => {
    const q = query(
        collection(db, 'tasks'),
        where('uid', '==', uid)
    );
    const querySnapshot = await getDocs(q);
    const fetchTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
    }));
    setTasks(fetchTasks);
  }

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if(!taskInput.trim() || !uid) return;

    await addDoc(collection(db, 'tasks'),{
        title: taskInput.trim(),
        createdAt: Timestamp.now(),
        uid: uid,
    });

    setTaskInput(''),
    await fetchTasks(uid);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
        <div className='max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6'>
            <h1 className='text-3xl font-bold mb-4'>🔥Welcome to TaskPilot🔥</h1>
            <p className='text-gray-700 mb-2'>Login As Anonymous</p>
            <p className='text-sm text-gray-500 break-all'>User: <span className='font-mono'>{uid}</span></p>
            
            <div className='mt-8 border-t pt-4 text-gray-400 italic'>
                You dont have any tasks yet, Click to begin!
            </div>

            <form onSubmit={handleAddTask} className='flex gap-2 my-4'>
                <input 
                type='text'
                value={taskInput}
                onChange={(e)=> setTaskInput(e.target.value)}
                placeholder='Enter a new task...'
                className='flex-1 border px-3 py-2 rounded'
                />
                <button type='submit'
                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                    Add Task
                </button>
            </form>

            <ul className='space-y-2'>
                {tasks.map((task) => (
                    <li key={task.id}
                    className='p-3 bg-gray-50 border rounded shadow-sm'>
                        {task.title}
                    </li>
                ))}
            </ul>
        </div>
    </main>
  );
}
