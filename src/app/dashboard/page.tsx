'use client';

import { useEffect, useState, FormEvent } from 'react';
import StatsChart from './StatsChart';
import { TaskService, Task } from '@/lib/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CalendarIcon, ListTodo, LayoutDashboard, Search } from 'lucide-react';

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskInput, setTaskInput] = useState('');
    const [editTaskId, setEditTaskId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [categoryInput, setCategoryInput] = useState('General');
    const [dueDateInput, setDueDateInput] = useState('');
    const [priorityInput, setPriorityInput] = useState('Medium');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);

    type Filter = 'all' | 'completed' | 'incomplete';
    const [filter, setFilter] = useState<Filter>('all');

    useEffect(() => {
        const stored = TaskService.load();
        setTasks(stored);
    }, []);

    const saveTasks = (next: Task[]) => {
        setTasks(next);
        TaskService.save(next);
    };

    const handleAddTask = (e: FormEvent) => {
        e.preventDefault();
        if (!taskInput.trim()) return;

        const newTask: Task = {
            id: crypto.randomUUID(),
            title: taskInput.trim(),
            completed: false,
            category: categoryInput,
            due_date: dueDateInput || null,
            priority: priorityInput as Task['priority'],
            createdAt: new Date().toISOString(),
        };
        saveTasks([newTask, ...tasks]);
        setTaskInput('');
    };

    const handleToggleComplete = (task: Task) => {
        TaskService.update(task.id, { completed: !task.completed });
        setTasks(TaskService.load());
    };

    const handleDeleteTask = (taskId: string) => {
        TaskService.delete(taskId);
        setTasks(TaskService.load());
    };

    const handleConfirmEdit = (taskId: string) => {
        if (!editTitle.trim()) return;
        TaskService.update(taskId, { title: editTitle });
        setEditTaskId(null);
        setEditTitle('');
        setTasks(TaskService.load());
    };

    const handleCancelEdit = () => {
        setEditTaskId(null);
        setEditTitle('');
    };

    const getPriorityValue = (priority: string) => {
        return priority === 'High' ? 1 : priority === 'Medium' ? 2 : 3;
    };

    const filteredTasks = tasks
        .filter((task) => {
            if (filter === 'completed') return task.completed;
            if (filter === 'incomplete') return !task.completed;
            return true;
        })
        .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((task) => (categoryFilter === 'all' ? true : task.category === categoryFilter))
        .sort((a, b) => {
            if (a.priority !== b.priority) {
                return getPriorityValue(a.priority) - getPriorityValue(b.priority);
            }
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });

    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-[#E8F9EF] to-[#DFF5E3] text-[--foreground]">
            <div className="max-w-xl mx-auto space-y-6">
                <Card className="p-6 rounded-2xl shadow border border-[#e0e0e0]">
                    <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
                        <LayoutDashboard className="text-orange-400 w-6 h-6" /> TaskPilot Dashboard
                    </h1>

                    <form onSubmit={handleAddTask} className="space-y-3">
                        <Input
                            type="text"
                            value={taskInput}
                            placeholder="Enter a task"
                            onChange={(e) => setTaskInput(e.target.value)}
                            className="w-full border border-gray-300 bg-white placeholder:text-gray-500"
                        />

                        <div className="flex flex-col md:flex-row justify-between gap-3 items-start md:items-center">
                            <div className="relative w-full md:max-w-sm">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                <input
                                    type="date"
                                    value={dueDateInput}
                                    onChange={(e) => setDueDateInput(e.target.value)}
                                    className="w-full h-[40px] rounded-md border border-gray-300 bg-white text-gray-800 pl-10 pr-2"
                                />
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <Select value={priorityInput} onValueChange={setPriorityInput}>
                                    <SelectTrigger className="border border-gray-300 bg-white text-gray-800 w-[120px]">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={categoryInput} onValueChange={setCategoryInput}>
                                    <SelectTrigger className="border border-gray-300 bg-white text-gray-800 w-[120px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General">General</SelectItem>
                                        <SelectItem value="Work">Work</SelectItem>
                                        <SelectItem value="Personal">Personal</SelectItem>
                                        <SelectItem value="Study">Study</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full mt-2">Add Task</Button>
                        </div>
                    </form>

                </Card>

                <Card className="p-4 border border-[#e0e0e0]">
                    <div className="flex items-center gap-2 mb-4">
                        <Search className="text-gray-400 w-5 h-5" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks..."
                            className="border border-gray-300 bg-white"
                        />
                    </div>

                    <div className="flex justify-between items-center gap-2 flex-wrap">
                        <div className="flex gap-2">
                            {(['all', 'completed', 'incomplete'] as Filter[]).map((f) => (
                                <Button
                                    key={f}
                                    variant={filter === f ? 'default' : 'outline'}
                                    onClick={() => setFilter(f)}
                                    className={
                                        filter !== f
                                            ? 'bg-white border text-gray-600 hover:bg-gray-200 hover:text-black rounded-lg shadow-sm'
                                            : 'rounded-lg shadow-sm'
                                    }
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </Button>

                            ))}
                        </div>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="border border-gray-300 bg-white text-gray-800 rounded-md shadow-sm px-3 h-[40px]" >
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>


                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Work">Work</SelectItem>
                                <SelectItem value="Personal">Personal</SelectItem>
                                <SelectItem value="Study">Study</SelectItem>
                                <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                {filteredTasks.length === 0 ? (
                    <p className="text-gray-500 text-center mt-4">No tasks found.</p>
                ) : (
                    <div className="space-y-3">
                        {filteredTasks.map((task) => (
                            <Card key={task.id} className="p-4 border border-gray-300">
                                <div className="flex items-center justify-between gap-3">
                                    {/* 左侧: checkbox + 文字 or 编辑框 */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleToggleComplete(task)}
                                            className="w-5 h-5 accent-green-500"
                                        />

                                        {editTaskId === task.id ? (
                                            <Input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleConfirmEdit(task.id);
                                                    if (e.key === 'Escape') handleCancelEdit();
                                                }}
                                                autoFocus
                                                className="w-full border border-gray-400 bg-white text-gray-800 placeholder:text-gray-500 shadow-sm"
                                            />
                                        ) : (
                                            <span
                                                className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                                                    }`}
                                            >
                                                {task.title}
                                            </span>
                                        )}
                                    </div>

                                    {/* 右侧: 编辑和删除按钮 */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        {editTaskId === task.id ? (
                                            <>
                                                <Button variant="outline" size="sm" onClick={() => handleConfirmEdit(task.id)}>
                                                    Save
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="outline" size="sm" onClick={() => {
                                                    setEditTaskId(task.id);
                                                    setEditTitle(task.title);
                                                }} className='border border-gray-400 text-gray-800 hover:bg-gray-200 hover:text-black'>
                                                    Edit
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)}>
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}


            </div>
        </main>
    );
}
