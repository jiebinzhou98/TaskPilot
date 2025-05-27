'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import StatsChart from './StatsChart';
import { TaskService, Task } from '@/lib/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
    <main className='min-h-screen bg-background text-foreground p-4'>
      <div className='max-w-3xl mx-auto space-y-6'>
        <h1 className='text-3xl font-bold'>📋 Task Dashboard</h1>

        <form onSubmit={handleAddTask} className='flex flex-wrap gap-3'>
          <Input
            type='text'
            value={taskInput}
            placeholder='Enter a task'
            onChange={(e) => setTaskInput(e.target.value)}
            className='flex-1'
          />
          <Input type='date' value={dueDateInput} onChange={(e) => setDueDateInput(e.target.value)} />

          <Select value={priorityInput} onValueChange={setPriorityInput}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Priority' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='High'>High</SelectItem>
              <SelectItem value='Medium'>Medium</SelectItem>
              <SelectItem value='Low'>Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryInput} onValueChange={setCategoryInput}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='General'>General</SelectItem>
              <SelectItem value='Work'>Work</SelectItem>
              <SelectItem value='Personal'>Personal</SelectItem>
              <SelectItem value='Study'>Study</SelectItem>
            </SelectContent>
          </Select>

          <Button type='submit'>➕ Add</Button>
        </form>

        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='🔍 Search tasks'
        />

        <div className='flex justify-between items-center'>
          <div className='flex gap-2'>
            {(['all', 'completed', 'incomplete'] as Filter[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='Work'>Work</SelectItem>
              <SelectItem value='Personal'>Personal</SelectItem>
              <SelectItem value='Study'>Study</SelectItem>
              <SelectItem value='General'>General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-3'>
          {filteredTasks.map((task) => (
            <Card key={task.id} className='p-4 flex justify-between items-center'>
              <div className='flex items-center gap-3'>
                <Switch checked={task.completed} onCheckedChange={() => handleToggleComplete(task)} />
                {editTaskId === task.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmEdit(task.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                  />
                ) : (
                  <span className={task.completed ? 'line-through text-muted-foreground' : ''}>{task.title}</span>
                )}
              </div>
              <div className='flex gap-2'>
                {editTaskId === task.id ? (
                  <>
                    <Button variant='outline' onClick={() => handleConfirmEdit(task.id)}>✅ Save</Button>
                    <Button variant='ghost' onClick={handleCancelEdit}>✖ Cancel</Button>
                  </>
                ) : (
                  <Button variant='outline' onClick={() => {
                    setEditTaskId(task.id);
                    setEditTitle(task.title);
                  }}>📝 Edit</Button>
                )}
                <Button variant='destructive' onClick={() => handleDeleteTask(task.id)}>🗑 Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
