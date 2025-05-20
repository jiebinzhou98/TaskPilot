'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface Task{
    completed: boolean;
}

export default function StatsChart({ tasks } : { tasks: Task[]}){
    const completed = tasks.filter((t) => t.completed).length;
    const incomplete = tasks.length - completed;

    const data = [
        {name: 'Completed', value: completed},
        {name: 'Incomplete', value: incomplete},
    ];

    const COLORS = ['#4ade80', '#f87171'];

    return(
        <div className='w-full h-64'>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]}/>
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}