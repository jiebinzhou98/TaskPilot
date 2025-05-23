'use client';

import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import StatsChart from './StatsChart';

interface Task {
    id: number,
    title: string,
    completed: boolean,
    category: string,
    due_date: string | null,
    priority: 'Low' | 'Medium' | 'High',
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
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityInput, setPriorityInput] = useState('Medium');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        const prefersDark = hour < 7 || hour > 19;

        setIsDarkMode(prefersDark);
        document.body.classList.toggle('dark', prefersDark);
    }, []);


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
            priority: priorityInput,
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

    const getPriorityValue = (priority: string) => {
        return priority === 'High' ? 1 : priority === "Medium" ? 2 : 3;
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    })
        .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((task) => categoryFilter === 'all' ? true : task.category === categoryFilter)
        .sort((a, b) => {
            if (a.priority !== b.priority) {
                return getPriorityValue(a.priority) - getPriorityValue(b.priority)
            }

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

    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;
    const percentage = totalCount === 0 ? 0 : ((completedCount / totalCount) * 100).toFixed(0);

    return (
        <main className='min-h-screen bg-gray-100 p-8 dark:bg-gray-900 text-gray-900 dark:text-white'>
            <div className='max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 dark:bg-gray-800'>
                <h1 className='text-3xl font-bold mb-4'>🔥 TaskPilot Dashboard</h1>
                {nickname && (
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-600">
                            Welcome, <span className="font-medium text-gray-800">{nickname}</span>
                        </p>
                        <div className='flex gap-2'>
                            <button
                                onClick={() => setIsDarkMode(prev => !prev)}
                                className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
                            >
                                {isDarkMode ? '🌙 Dark' : '☀️ Light'}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded hover:bg-red-200 dark:bg-red-800 dark:text-white dark:hover:bg-red-700 transition"
                            >
                                🔓 Logout
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleAddTask} className='flex flex-wrap gap-2 mb-6'>
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

                    {/* {priority} */}
                    <select
                        value={priorityInput}
                        onChange={(e) => setPriorityInput(e.target.value)}
                        className='border px-3 py-2 rounded'
                    >
                        <option value="Medium">Meduim</option>
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                    </select>


                    {/* {category} */}
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
                    <>
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
                                                    <span className={`text-xs font-medium px-2 py-05 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                        {task.priority}

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
                                                    className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded hover:bg-green-200 transition'
                                                >
                                                    ✅Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className='bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-300 transition'
                                                >
                                                    ✖Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditTaskId(task.id)
                                                    setEditTitle(task.title)
                                                }}
                                                className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-200 transition'
                                            >
                                                📝Edit
                                            </button>
                                        )}
                                        <button onClick={() => handleDeleteTask(task.id)}
                                            className='bg-text-100 text-red-700 text-xs px-2 py-1 rounded hover:bg-red-200 transition'>
                                            🗑 Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className='mt-6 text-sm text-gray-600 text-center'>
                            ✅Completed {completedCount} / {totalCount} tasks ({percentage}%)
                        </div>
                        <div className='text-center mt-6'>
                            <button
                                onClick={() => setShowModal(true)}
                                className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition'
                            >
                                📊 View Task Stats
                            </button>
                        </div>
                        {showModal && (
                            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-3xl relative'>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white'
                                    >
                                        ✖
                                    </button>
                                    <h2 className='text-xl font-semibold text-center'>📊Completed Task by Category</h2>
                                    <div className='h-[400px] mt-6'>
                                    <StatsChart tasks={tasks} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
