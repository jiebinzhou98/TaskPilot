'use client'

import { useEffect, useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Task{
    id: number,
    title: string;
}

export default function DashboardPage(){
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null)
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskInput, setTaskInput] = useState('');

    useEffect(() => {
        const fetchUser = async () =>{
            const {data, error} = await supabase.auth.getUser();

            if(error || !data.user){
                router.push('/login');
            }else{
                setUserId(data.user.id);
                fetchTasks(data.user.id)
            }
        };
        fetchUser();
    },[router]);

    const fetchTasks = async (uid: string) => {
        const {data, error} = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id',uid)
        .order('created_at',{ascending:false});

        if(!error && data){
            setTasks(data);
        }
    };

    const handleAddTask = async (e: FormEvent) => {
        e.preventDefault();
        if(!taskInput.trim() || !userId) return;

        const {error} = await supabase.from('tasks').insert({
            title:taskInput.trim(),
            user_id: userId,
        });

        if(!error){
            setTaskInput(''),
            fetchTasks(userId);
        }
    };

    return(
        <main className='min-h-screen bg-gray-100 p-8'>
            <div className='max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6'>
                <h1 className='text-3xl font-bold mb-4'>🔥 TaskPilot Dashboard
                    <form onSubmit={handleAddTask} className='flex gap-2 mb-6'>
                        <input type='text' 
                                placeholder='Enter a new task...'
                                value={taskInput}
                                onChange={(e) => setTaskInput(e.target.value)} 
                                className='flex-1 border px-3 rounded'
                        />
                        <button type='submit'
                                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                                Add Task
                        </button>
                    </form>
                    <ul className='space-y-2'> 
                        {tasks.map((task)=>(
                            <li key={task.id} className='p-3 bg-gray-50 border rounded'>
                                {task.title}
                            </li>
                        ))}
                    </ul>
                </h1>
            </div>
        </main>
    )
}