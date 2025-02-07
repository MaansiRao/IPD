import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, MessageCircle, Clock, Award, Brain } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx'

const Reports = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/parental-control/parental-report');
        const result = await response.json();
        if (result.status === 'success') {
          console.log(result.data);
          // Ensure result.data has the expected structure
          if (result.data && result.data.Category && result.data.Count && result.data.Time_of_Day) {
            const transformedData = transformCategoryData(result.data);
            setCategoryData(transformedData);
          } else {
            console.error('Invalid data structure');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const transformCategoryData = (data) => {
    const timeGroups = {};

    // Reshape data into an array of objects using the data from Category, Count, and Time_of_Day arrays
    const reshapedData = data.Category.map((category, index) => ({
      Category: category,
      Count: data.Count[index],
      Time_of_Day: data.Time_of_Day[index]
    }));

    reshapedData.forEach(item => {
      if (!timeGroups[item.Time_of_Day]) {
        timeGroups[item.Time_of_Day] = {};
      }
      timeGroups[item.Time_of_Day][item.Category] = item.Count;
    });

    return Object.entries(timeGroups).map(([time, categories]) => ({
      timeOfDay: time,
      Action: categories.Action || 0,
      Greeting: categories.Greeting || 0,
      Emotion: categories.Emotion || 0,
      Request: categories.Request || 0,
      Love: categories.Love || 0,
      Other: categories.Other || 0
    }));
  };

  const categoryColors = {
    Action: "#8884d8",
    Greeting: "#82ca9d",
    Emotion: "#ffc658",
    Request: "#ff7300",
    Love: "#ff8042",
    Other: "#8dd1e1"
  };

  // More realistic daily usage statistics
  const usageStats = {
    totalInteractions: 165,
    uniqueWords: 20,
    avgSessionLength: "5.5 min",
    improvement: '+5%'
  };

  // Hourly activity pattern (more realistic for a child's day)
  const hourlyActivity = [
    { hour: '6AM', interactions: 5 },
    { hour: '7AM', interactions: 12 },
    { hour: '8AM', interactions: 18 },
    { hour: '9AM', interactions: 15 },
    { hour: '10AM', interactions: 10 },
    { hour: '11AM', interactions: 8 },
    { hour: '12PM', interactions: 14 },
    { hour: '1PM', interactions: 12 },
    { hour: '2PM', interactions: 7 },
    { hour: '3PM', interactions: 13 },
    { hour: '4PM', interactions: 11 },
    { hour: '5PM', interactions: 9 },
    { hour: '6PM', interactions: 15 },
    { hour: '7PM', interactions: 8 },
    { hour: '8PM', interactions: 4 }
  ];

  // Communication success rate
  const successRate = [
    { time: 'Morning', Understood: 85, Needed_Help: 15 },
    { time: 'Afternoon', Understood: 92, Needed_Help: 8 },
    { time: 'Evening', Understood: 88, Needed_Help: 12 }
  ];

  // Sentiment analysis data (Example)
  const sentimentData = [
    { name: 'Positive', value: 50 },
    { name: 'Neutral', value: 25 },
    { name: 'Negative', value: 15 },
    { name: 'Excited', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Most used phrases today
  const topPhrases = [
    { phrase: "I'm hungry", count: 12 },
    { phrase: "Water please", count: 10 },
    { phrase: "Bathroom", count: 8 },
    { phrase: "Play outside", count: 7 },
    { phrase: "I'm tired", count: 6 }
  ];

//   // Learning progress
//   const learningProgress = [
//     { category: 'New Words Learned', count: 3 },
//     { category: 'Phrases Mastered', count: 5 },
//     { category: 'Complex Sentences', count: 2 }
//   ];

  return (
    <>
    <div>
        <Sidebar/>
    </div>
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Daily Communication Report</h1>
        <p className="text-gray-600 font-medium">{new Date().toLocaleDateString()}</p>
      </div>
      
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Interactions</p>
              <p className="text-3xl font-bold text-blue-600">{usageStats.totalInteractions}</p>
            </div>
            <Activity className="h-10 w-10 text-blue-500 bg-blue-50 p-2 rounded-lg" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Words Used</p>
              <p className="text-3xl font-bold text-green-600">{usageStats.uniqueWords}</p>
            </div>
            <MessageCircle className="h-10 w-10 text-green-500 bg-green-50 p-2 rounded-lg" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Session Length</p>
              <p className="text-3xl font-bold text-purple-600">{usageStats.avgSessionLength}</p>
            </div>
            <Clock className="h-10 w-10 text-purple-500 bg-purple-50 p-2 rounded-lg" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Progress</p>
              <p className="text-3xl font-bold text-emerald-600">{usageStats.improvement}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-emerald-500 bg-emerald-50 p-2 rounded-lg" />
          </div>
        </div>
      </div>

     {/* Category Usage by Time */}
     <div className="col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Category Usage by Time of Day</h2>
          {!loading && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeOfDay" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(categoryColors).map((category) => (
                  <Bar 
                    key={category}
                    dataKey={category}
                    stackId="a"
                    fill={categoryColors[category]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity Pattern */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Daily Activity Pattern</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="interactions" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Communication Success Rate */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Communication Success Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={successRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Understood" stackId="a" fill="#4CAF50" />
              <Bar dataKey="Needed_Help" stackId="a" fill="#FFA726" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Emotional Expression Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Most Used Phrases */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Most Used Phrases Today</h2>
          <div className="space-y-4">
            {topPhrases.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{item.phrase}</span>
                <div className="flex items-center">
                  <span className="text-blue-600 font-semibold">{item.count}</span>
                  <span className="text-gray-400 text-sm ml-2">times</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Progress */}
        {/* <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Today's Learning Progress</h2>
          <div className="space-y-4">
            {learningProgress.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{item.category}</span>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-lg font-semibold">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
    </>
  );
};

export default Reports;