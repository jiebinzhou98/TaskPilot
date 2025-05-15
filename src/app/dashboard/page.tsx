'use client';

import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  title: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');

  const fetchTasks = async (uid: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Failed to load tasks:', error.message);
    } else {
      setTasks(data || []);
    }
  };

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.push('/login');
        return;
      }

      const uid = userData.user.id;
      setUserId(uid);
      await fetchTasks(uid);
    };

    fetchUserAndTasks();
  }, [router]);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim() || !userId) return;

    const { error } = await supabase.from('tasks').insert({
      title: taskInput.trim(),
      user_id: userId,
    });

    if (error) {
      console.error('❌ Failed to add task:', error.message);
    } else {
      setTaskInput('');
      await fetchTasks(userId); 
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const {error} = await supabase.from('tasks').delete().eq('id',taskId);
    if(error){
        console.error('Failed to delete task:',error.message);
    }else if(userId){
        await fetchTasks(userId)
    }
  };

  return (
    <main className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6'>
        <h1 className='text-3xl font-bold mb-4'>🔥 TaskPilot Dashboard</h1>

        <form onSubmit={handleAddTask} className='flex gap-2 mb-6'>
          <input
            type='text'
            placeholder='Enter a new task...'
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className='flex-1 border px-3 py-2 rounded'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            Add Task
          </button>
        </form>

        {tasks.length === 0 ? (
          <p className='text-gray-500 italic'>No tasks yet. Start by adding one!</p>
        ) : (
          <ul className='space-y-2'>
            {tasks.map((task) => (
              <li
                key={task.id}
                className='p-3 bg-gray-50 border rounded flex justify-between items-center'
              >
                <span>{task.title}</span>
                <button onClick={()=>handleDeleteTask(task.id)} 
                    className='text-red-500 hover:text-red-700 text-s'>
                        🗑 Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
