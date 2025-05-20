'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Task {
  category: string;
  completed: boolean;
}

interface Props {
  tasks: Task[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Work: '#60a5fa',     // blue-400
  Personal: '#f472b6', // pink-400
  Study: '#facc15',    // yellow-400
  General: '#2dd4bf',  // gray-400
};

export default function StatsChart({ tasks }: Props) {
  // Convert each task into a pie slice (1 task = 1 slice)
  const chartData = tasks.map((task, index) => ({
    name: task.category,
    completed: task.completed,
    fill: task.completed
      ? CATEGORY_COLORS[task.category] || '#aaa'
      : '#e5e7eb', // gray-200 for incomplete
    id: `${task.category}-${index}`,
  }));

  return (
    <>
    <div className='flex justify-center gap-4 text-sm mb-2'>
      <div className='flex items-center gap-1'>
        <span className='inline-block w-3 h-3 rounded-full bg-gray-300'></span>
        <span>❌ Incomplete</span>
      </div>
      <div className='flex items-center gap-1'>
        <span className='inline-block w-3 h-3 rounded-full bg-green-500'></span>
        <span>✅ Completed</span>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey={() => 1} // every task counts as 1
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={120}
            labelLine={false}
            label={({ name, cx, cy, midAngle, outerRadius }) => {
              const RADIAN = Math.PI / 180;
              const radius = outerRadius + 10;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              const totalInCategory = tasks.filter(t => t.category === name).length;
              const completedInCategory = tasks.filter(t => t.category === name && t.completed).length;
              const percent = totalInCategory === 0 ? 0 : Math.round((completedInCategory / totalInCategory) * 100);

              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                  fontSize={12}
                  fill="#333"
                >
                  {`${name} (${percent}%)`}
                </text>
              );
            } }
            isAnimationActive={false}
          >

            {chartData.map((entry) => (
              <Cell key={entry.id} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(_, __, props) => `${props?.payload?.completed ? '✅ Completed' : '❌ Incomplete'}`} />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            payload={Object.entries(CATEGORY_COLORS).map(([category, color]) => {
              const count = tasks.filter((t) => t.category === category).length;
              return {
                id: category,
                type: 'circle',
                value: `${category} (${count})`,
                color,
              };
            })} />
        </PieChart>
      </ResponsiveContainer>
      </>
  );
}
