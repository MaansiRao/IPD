import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';

// Sample data (would typically come from backend/database)
const usageTimeData = [
  { hour: '8 AM', duration: 15 },
  { hour: '10 AM', duration: 22 },
  { hour: '12 PM', duration: 30 },
  { hour: '2 PM', duration: 18 },
  { hour: '4 PM', duration: 25 },
  { hour: '6 PM', duration: 12 }
];

const categoriesData = [
  { name: 'Greetings', value: 3 },
  { name: 'Food', value: 5 },
  { name: 'Feelings', value: 2 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const DailyReport = () => {
  const [parentNotes, setParentNotes] = useState('');

  const totalUsageTime = usageTimeData.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Daily AAC Communication Report</h1>
      
      {/* Usage Statistics Section */}
      <div className="bg-white shadow-md rounded-lg mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Total Usage Time */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Total Usage Time</h3>
            <p className="text-xl">{totalUsageTime} minutes</p>
          </div>

          {/* Usage Time Chart */}
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="duration" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Categories Pie Chart */}
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Most Used Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Most Used Categories</h3>
            <ul className="list-disc pl-5">
              {categoriesData
                .sort((a, b) => b.value - a.value)
                .map((category) => (
                  <li key={category.name}>
                    {category.name}: {category.value} times
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Parental Notes Section */}
      <div className="bg-white shadow-md rounded-lg mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Parental Notes</h2>
        <textarea
          placeholder="Add your observations, notes about mood, behavior, or progress for today..."
          value={parentNotes}
          onChange={(e) => setParentNotes(e.target.value)}
          className="w-full min-h-[120px] p-2 border rounded-md"
        />
      </div>

      {/* Recommendations Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Suggested Words/Phrases</h3>
            <ul className="list-disc pl-5">
              <li>Summer activities</li>
              <li>Outdoor play</li>
              <li>Favorite snacks</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Caregiver Tips</h3>
            <ul className="list-disc pl-5">
              <li>Encourage use during meal times</li>
              <li>Practice new phrases together</li>
              <li>Celebrate communication attempts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;