'use client';

import { useEffect, useState, FormEvent, use } from 'react';
import StatsChart from './StatsChart';
import { TaskService, Task } from '@/lib/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, LayoutDashboard, Minus, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import localFont from 'next/font/local';


const wdXLLubrifont = localFont({
    src: '../../fonts/wdxl-regular.otf',
})

const ExileFont = localFont({
    src: '../../fonts/Exile-Regular.ttf',
})

const playPenFont = localFont({
    src: '../../fonts/PlaypenSansDeva-VariableFont_wght.ttf'
})

const shadowFont = localFont({
    src: '../../fonts/ShadowsIntoLight-Regular.ttf'
})

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
    const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        TaskService.clearOldCompleted(7);
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
            due_date: dueDateInput
                ? new Date(
                    new Date(dueDateInput).getFullYear(),
                    new Date(dueDateInput).getMonth(),
                    new Date(dueDateInput).getDate(),
                    23, 59, 59
                ).toISOString()
                : null,
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


    const isOverdue = (dueDate: string | null): boolean => {
        if (!dueDate) return false;
        const now = new Date();
        const due = new Date(dueDate);

        return (
            due.getFullYear() < now.getFullYear() ||
            (due.getFullYear() === now.getFullYear() && due.getMonth() < now.getMonth()) ||
            (due.getFullYear() === now.getFullYear() &&
                due.getMonth() === now.getMonth() &&
                due.getDate() < now.getDate())
        );
    };

    const isDueToday = (dueDate: string | null): boolean => {
        if (!dueDate) return false;
        const now = new Date();
        const due = new Date(dueDate);

        return (
            due.getFullYear() === now.getFullYear() &&
            due.getMonth() === now.getMonth() &&
            due.getDate() === now.getDate()
        );
    };


    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-[#E8F9EF] to-[#DFF5E3] text-[--foreground]">
            <div className="max-w-xl mx-auto space-y-6">
                <Card className="p-6 rounded-2xl shadow border border-[#e0e0e0]">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className={`text-2xl font-bold flex items-center gap-2 ${wdXLLubrifont.className}`}>
                            <LayoutDashboard className="text-orange-400 w-6 h-6" /> TaskPilot Dashboard
                        </h1>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="bg-[#333333] hover:bg-[#1f1f1f] text-white border border-[#1f1f1f] shadow-md hover:shadow-lg transition rounded-full p-2"
                                >
                                    <Plus className="w-5 h-5" />
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md bg-[#f8f9fa] text-gray-900 rounded-xl shadow-lg border border-gray-300">
                                <DialogHeader>
                                    <DialogTitle>Add New Task</DialogTitle>
                                </DialogHeader>


                                <form onSubmit={(e) => {
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
                                    setOpen(false);
                                }} className="space-y-4">
                                    <Input
                                        type="text"
                                        value={taskInput}
                                        placeholder="Enter a task"
                                        onChange={(e) => setTaskInput(e.target.value)}
                                        className="w-full border border-gray-300 bg-white placeholder:text-gray-500"
                                    />

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="relative w-full">
                                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                            <input
                                                type="date"
                                                value={dueDateInput}
                                                onChange={(e) => setDueDateInput(e.target.value)}
                                                className="w-full h-[40px] rounded-md border border-gray-300 bg-white text-gray-800 pl-10 pr-2 appearance-none text-sm leading-none"
                                                style={{ WebkitAppearance: 'none' }}
                                            />
                                        </div>

                                        <Select value={priorityInput} onValueChange={setPriorityInput}>
                                            <SelectTrigger className="w-full h-[40px] border border-gray-300 bg-white text-gray-800">
                                                <SelectValue placeholder="Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button type="submit" className="w-full mt-2">Add Task</Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                    </div>

                    {/* 🔍 搜索栏 - 放置在任务列表前面 */}
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks..."
                            className="flex-1 px-3 py-2 rounded border border-gray-300 bg-white text-sm text-gray-800 shadow-sm"
                        />
                    </div>

                    {/* 📂 分类筛选 */}
                    <div className="flex gap-2 mb-4">
                        {/* All */}
                        <Button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${filter === 'all'
                                ? 'bg-[#E0E0E0] text-[#616161] shadow-md'
                                : 'bg-white text-[#616161] border border-[#E0E0E0] hover:bg-[#BDBDBD] hover:shadow-md'
                                }`}
                        >
                            All
                        </Button>

                        {/* Completed */}
                        <Button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${filter === 'completed'
                                ? 'bg-[#66BB6A] text-white shadow-md'
                                : 'bg-white text-[#66BB6A] border border-[#66BB6A] hover:bg-[#4CAF50] hover:text-white hover:shadow-md'
                                }`}
                        >
                            Completed
                        </Button>

                        {/* Incomplete */}
                        <Button
                            onClick={() => setFilter('incomplete')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${filter === 'incomplete'
                                ? 'bg-[#FFA726] text-white shadow-md'
                                : 'bg-white text-[#FFA726] border border-[#FFA726] hover:bg-[#FB8C00] hover:text-white hover:shadow-md'
                                }`}
                        >
                            Incomplete
                        </Button>
                    </div>


                    {/* 此处可继续保留原搜索、筛选、任务列表逻辑 */}
                    {filteredTasks.length === 0 ? (
                        <p className="text-gray-500 text-center mt-4">No tasks found.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredTasks.map((task) => (
                                <div key={task.id} className="border-b last:border-b-0 pb-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Created: {new Date(task.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-1">
                                        📅 Due: {task.due_date || 'N/A'} &nbsp; | &nbsp;
                                        🔥 Priority:
                                        <span
                                            className={
                                                task.priority === 'High'
                                                    ? 'text-red-500 font-semibold'
                                                    : task.priority === 'Medium'
                                                        ? 'text-yellow-600 font-medium'
                                                        : 'text-green-600 font-medium'
                                            }
                                        >
                                            {task.priority}
                                        </span>
                                    </p>


                                    <div className="flex items-center justify-between gap-3">
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

                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`text-sm ${playPenFont.className} ${task.completed
                                                            ? 'line-through text-gray-400'
                                                            : isOverdue(task.due_date)
                                                                ? 'text-red-600 font-semibold'
                                                                : 'text-gray-800'
                                                            }`}
                                                    >
                                                        {task.title}
                                                    </span>

                                                    {!task.completed && isOverdue(task.due_date) && (
                                                        <span className={`text-xs text-red-500 font-medium ${wdXLLubrifont.className}`}>⚠️ Overdue</span>
                                                    )}

                                                    {!task.completed && isDueToday(task.due_date) && (
                                                        <span className={`text-xs text-yellow-600 font-medium ${wdXLLubrifont.className}`}>⚡ Due Today</span>
                                                    )}
                                                </div>


                                            )}
                                        </div>
                                        <div className="flex-shrink-0">
                                            {editTaskId === task.id ? (
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleConfirmEdit(task.id)}>
                                                        Save
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent side="bottom" align="end" className="w-28">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setEditTaskId(task.id);
                                                                setEditTitle(task.title);
                                                            }}
                                                        >
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteTask(task.id)}
                                                            className="text-red-500 hover:text-red-600"
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className='pt-6 mt-6 border-t text-center'>
                        <Button
                            onClick={() => {
                                TaskService.clearOldCompleted(7);
                                setTasks(TaskService.load());
                            }}
                            variant="ghost"
                            className={`bg-[#FF9100] text-white hover:bg-[#e67f00] ${playPenFont.className} px-4 py-2 rounded transition w-full sm:w-auto`}
                        >
                            Clear old completed tasks older than 7 days
                        </Button>
                    </div>
                </Card>
            </div>
        </main>
    );
}
