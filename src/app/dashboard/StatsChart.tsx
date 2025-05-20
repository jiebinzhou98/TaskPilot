'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS: { [key: string]: string } = {
  General: '#6b7280',  // gray
  Work: '#3b82f6',     // blue
  Personal: '#ec4899', // pink
  Study: '#facc15',    // yellow
};

export default function StatsChart({ tasks }: { tasks: any[] }) {
  const categories = ['General', 'Work', 'Personal', 'Study'];

  const data = categories.map(category => ({
    name: category,
    value: tasks.filter(t => t.category === category && t.completed).length
  })).filter(item => item.value > 0);

  return (
    <div className="text-center">
      {/* <h3 className="text-lg font-semibold mb-4">✅ Completed Tasks by Category</h3> */}
      {data.length === 0 ? (
        <p className="text-gray-500 italic">No completed tasks yet.</p>
      ) : (
        <div className="w-full h-64 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                nameKey="name"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} tasks`, name]}
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 0 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
