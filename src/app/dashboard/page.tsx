'use client';

import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Task {
    id: number;
    title: string;
    completed: boolean;
    category: string;
    due_date: string | null;
}

export default function DashboardPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskInput, setTaskInput] = useState('');
    const [nickname, setNickname] = useState<string | null>(null);
    const [editTaskId, setEditTaskId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [categoryInput, setCategoryInput] = useState('General');
    const [dueDateInput, setDueDateInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all')

    type Filter = 'all' | 'completed' | 'incomplete';
    const [filter, setFilter] = useState<Filter>('all')

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
            const email = userData.user.email || '';
            const idPart = email.split('@')[0];
            const nicknameGen = idPart.replace('guest_', 'Visitor #');
            setNickname(nicknameGen)
        };

        fetchUserAndTasks();
    }, [router]);

    const handleAddTask = async (e: FormEvent) => {
        e.preventDefault();
        if (!taskInput.trim() || !userId) return;

        const { error } = await supabase.from('tasks').insert({
            title: taskInput.trim(),
            user_id: userId,
            category: categoryInput,
            due_date: dueDateInput || null,
        });

        if (error) {
            console.error('❌ Failed to add task:', error.message);
        } else {
            setTaskInput('');
            await fetchTasks(userId);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId);
        if (error) {
            console.error('Failed to delete task:', error.message);
        } else if (userId) {
            await fetchTasks(userId)
        }
    };

    const handleToggleComplete = async (task: Task) => {
        const { error } = await supabase
            .from('tasks')
            .update({ completed: !task.completed })
            .eq('id', task.id)

        if (error) {
            console.error('Failed to update task:', error.message);
        } else if (userId) {
            await fetchTasks(userId);
        }
    }

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout Failed:', error.message);
        } else {
            router.push('/login')
        }
    }

    const handleConfirmEdit = async (taskId: number) => {
        if (!editTitle.trim()) return;

        const { error } = await supabase
            .from('tasks')
            .update({ title: editTitle })
            .eq('id', taskId)

        if (error) {
            console.error('Failed to update title:', error.message);
        } else if (userId) {
            setEditTaskId(null);
            setEditTitle('');
            await fetchTasks(userId);
        }
    };

    const handleCancelEdit = () => {
        setEditTaskId(null);
        setEditTitle('');
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    })
        .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((task) => categoryFilter === 'all' ? true : task.category === categoryFilter)
        .sort((a, b) => {
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;

            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        })

    const getDueDateColor = (dueDate: string | null) => {
        if (!dueDate) return 'text-gray-500'

        const today = new Date();
        const due = new Date(dueDate)

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return 'text-red-500'
        if (diffDays <= 3) return 'text-yellow-500'

        return 'text-gray-500'
    }

    return (
        <main className='min-h-screen bg-gray-100 p-8'>
            <div className='max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6'>
                <h1 className='text-3xl font-bold mb-4'>🔥 TaskPilot Dashboard</h1>
                {nickname && (
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-600">
                            Welcome, <span className="font-medium text-gray-800">{nickname}</span>
                        </p>
                        <button
                            onClick={handleLogout}
                            className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded hover:bg-red-200 transition"
                        >
                            🔓 Logout
                        </button>
                    </div>
                )}

                <form onSubmit={handleAddTask} className='flex gap-2 mb-6'>
                    <input
                        type='text'
                        placeholder='Enter a new task...'
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        className='flex-1 border px-3 py-2 rounded'
                    />
                    <input
                        type='date'
                        value={dueDateInput}
                        onChange={(e) => setDueDateInput(e.target.value)}
                        className='border px-3 py-2 rounded'
                    />


                    <select
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        className='border px-3 py-2 rounded'
                    >
                        <option value="General">General</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Study">Study</option>
                    </select>

                    <button
                        type='submit'
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                    >
                        Add Task
                    </button>
                </form>

                <input
                    type='text'
                    placeholder='Search tasks...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full mb-4 border px-3 py-2 rounded'
                />

                <div className="mb-4 flex justify-between items-center gap-2 flex-wrap">
                    {/* Filter buttons on the left */}
                    <div className="flex gap-2">
                        {(['all', 'completed', 'incomplete'] as Filter[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded text-sm border ${filter === f
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Category dropdown on the right */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border px-3 py-2 rounded text-sm"
                    >
                        <option value="all">All Categories</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Study">Study</option>
                        <option value="General">General</option>
                    </select>
                </div>



                {tasks.length === 0 ? (
                    <p className='text-gray-500 italic'>No tasks yet. Start by adding one!</p>
                ) : (
                    <ul className='space-y-2'>
                        {filteredTasks.map((task) => (
                            <li
                                key={task.id}
                                className='p-3 bg-gray-50 border rounded flex justify-between items-center'
                            >
                                <div className='flex items-center gap-3 flex-1'>
                                    <input
                                        type='checkbox'
                                        checked={task.completed}
                                        onChange={() => handleToggleComplete(task)}
                                    />
                                    {editTaskId === task.id ? (
                                        <input
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleConfirmEdit(task.id);
                                                if (e.key === 'Escape') handleCancelEdit();
                                            }}
                                            autoFocus
                                            className='border rounded px-2 py-1 w-full text-sm'
                                        />
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className={`flex items-center gap-2 ${task.completed ? 'line-through text-green-600' : 'text-gray-800'}`}>
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded mr-2
                                                    ${task.category === 'Work' ? 'bg-blue-100 text-blue-800' :
                                                        task.category === 'Personal' ? 'bg-pink-200 text-pink-800' :
                                                        task.category === 'Study' ? 'bg-yellow-200 text-yellow-800' :
                                                        'bg-gray-200 text-gray-700'
                                                    }`}
                                                >
                                                    {task.category}
                                                </span>
                                                {task.completed && <span className='text-green-500'>✅</span>}
                                                {task.title}
                                            </span>
                                            {task.due_date && (
                                                <p className={`text-xs ${getDueDateColor(task.due_date)}`}>

                                                    📅 Due:{task.due_date}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className='flex items-center gap-2'>
                                    {editTaskId === task.id ? (
                                        <>
                                            <button
                                                onClick={() => handleConfirmEdit(task.id)}
                                                className='text-green-600 text-sm hover:underline'
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className='text-gray-500 text-sm hover:underline'
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditTaskId(task.id)
                                                setEditTitle(task.title)
                                            }}
                                            className='text-blue-500 text-sm hover:underline'
                                        >
                                            📝Edit
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteTask(task.id)}
                                        className='text-red-500 hover:text-red-700 text-s'>
                                        🗑 Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
