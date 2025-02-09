import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, MessageCircle, Clock } from 'lucide-react';

const Reports = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [uniqueWords, setUniqueWords] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Category data
        const categoryResponse = await fetch('http://127.0.0.1:8000/parental-control/parental-report');
        const categoryResult = await categoryResponse.json();
        if (categoryResult.status === 'success') {
          const transformedData = transformCategoryData(categoryResult.data);
          setCategoryData(transformedData);
        }

        // Unique words data
        const uniqueWordsResponse = await fetch('http://127.0.0.1:8000/parental-control/unique-words-report');
        const uniqueWordsResult = await uniqueWordsResponse.json();
        if (uniqueWordsResult.status === 'success') {
          setUniqueWords(uniqueWordsResult.data);
        }

        // Transform sentiment data from phrases and labels
        const transformedSentimentData = transformSentimentData();
        setSentimentData(transformedSentimentData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const transformCategoryData = (data) => {
    if (!data || !data.Time_of_Day) return [];

    const timeGroups = {};
    data.Time_of_Day.forEach((time, index) => {
      if (!timeGroups[time]) {
        timeGroups[time] = {
          timeOfDay: time,
          Action: 0,
          Request: 0,
          Greeting: 0,
          Emotion: 0,
          Love: 0,
          Other: 0
        };
      }
      timeGroups[time][data.Category[index]] = (timeGroups[time][data.Category[index]] || 0) + data.Count[index];
    });

    return Object.values(timeGroups);
  };

  const transformSentimentData = () => {
    const sentimentCounts = {
      Positive: 0,
      Negative: 0,
      Neutral: 0
    };

    const sampleData = {
      Predicted_Label: ["Neutral", "Negative", "Negative", "Positive", "Positive"]
    };

    sampleData.Predicted_Label.forEach(sentiment => {
      sentimentCounts[sentiment]++;
    });

    return Object.entries(sentimentCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const categoryColors = {
    Action: "#8884d8",
    Request: "#82ca9d",
    Emotion: "#ffc658",
    Greeting: "#ff7300",
    Love: "#ff8042",
    Other: "#8dd1e1"
  };

  const usageStats = {
    totalInteractions: categoryData.reduce((sum, item) => 
      sum + Object.entries(item)
        .filter(([key]) => key !== 'timeOfDay')
        .reduce((acc, [_, value]) => acc + value, 0), 0),
    uniqueWords: uniqueWords,
    avgSessionLength: "5.5 min",
    improvement: '+5%'
  };

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

  const successRate = [
    { time: 'Morning', Understood: 85, Needed_Help: 15 },
    { time: 'Afternoon', Understood: 92, Needed_Help: 8 },
    { time: 'Evening', Understood: 88, Needed_Help: 12 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const topPhrases = [
    { phrase: "I need some chai", count: 1 },
    { phrase: "Where's the remote?", count: 1 },
    { phrase: "I need a break", count: 1 },
    { phrase: "Let's meet up", count: 1 },
    { phrase: "Happy Monday!", count: 1 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Daily Communication Report</h1>
        <p className="text-gray-600 font-medium">{new Date().toLocaleDateString()}</p>
      </div>
      
      {/* Stats Overview */}
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
      </div>
    </div>
  );
};

export default Reports;