import React, { useState, useEffect } from 'react';
import { Users, CreditCard, AlertCircle, TrendingUp, Calendar, Bell, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define proper types for chart components
interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface LineChartData {
  month: string;
  amount: number;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      name: 'Total Students',
      value: '2,543',
      icon: Users,
      change: '+5.4%',
      changeType: 'increase',
      description: 'Active enrollments this semester'
    },
    {
      name: 'Fees Collected',
      value: '₹15,43,250',
      icon: CreditCard,
      change: '+12.3%',
      changeType: 'increase',
      description: 'Total collections this month'
    },
    {
      name: 'Due Payments',
      value: '₹2,38,400',
      icon: AlertCircle,
      change: '-2.3%',
      changeType: 'decrease',
      description: 'Pending fee payments'
    },
    {
      name: 'Monthly Growth',
      value: '18.6%',
      icon: TrendingUp,
      change: '+3.2%',
      changeType: 'increase',
      description: 'Compared to last month'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'New Student Registration',
      description: 'John Doe registered for Computer Science',
      timestamp: '2 hours ago',
      icon: Users
    },
    {
      id: 2,
      title: 'Fee Payment Received',
      description: 'Sarah Smith paid ₹45,000',
      timestamp: '4 hours ago',
      icon: CreditCard
    },
    {
      id: 3,
      title: 'Due Date Reminder',
      description: 'Fee payment due for 125 students',
      timestamp: '5 hours ago',
      icon: Bell
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: 'March 1, 2025',
      time: '10:00 AM'
    },
    {
      id: 2,
      title: 'Annual Sports Day',
      date: 'March 5, 2025',
      time: '9:00 AM'
    }
  ];

  // Sample data for charts
  const feeCollectionData: LineChartData[] = [
    { month: 'Jan', amount: 1250000 },
    { month: 'Feb', amount: 1350000 },
    { month: 'Mar', amount: 1543250 },
    { month: 'Apr', amount: 1650000 },
    { month: 'May', amount: 1440000 },
    { month: 'Jun', amount: 1380000 },
  ];

  // Data for pie chart
  const departmentDistribution: PieChartData[] = [
    { name: 'Computer Science', value: 750, color: '#4f46e5' },
    { name: 'Engineering', value: 620, color: '#8b5cf6' },
    { name: 'Business', value: 1480, color: '#ec4899' },
    { name: 'Arts', value: 350, color: '#f97316' },
    { name: 'Science', value: 343, color: '#14b8a6' },
  ];

  const formatIndianRupee = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.4 }
    })
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Institution Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's your institution's overview for today.
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {stats.map((item, index) => (
          <motion.div 
            key={item.name} 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
            variants={cardVariants}
            custom={index}
          >
            <div className="flex items-center">
              <div className="bg-indigo-600 rounded-lg p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{item.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
        }}
      >
        {/* Fee Collection Chart */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          variants={cardVariants}
          custom={0}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900">Fee Collection Trend</h2>
            </div>
            <select className="text-sm border rounded-md p-1">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={feeCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                <Tooltip formatter={(value: number) => [formatIndianRupee(value), 'Amount']} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#4f46e5" activeDot={{ r: 8 }} name="Fee Collection" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Department Distribution Pie Chart */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          variants={cardVariants}
          custom={1}
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-gray-900">Department Distribution</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie<any>
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}: {name: string; percent: number}) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} students`, 'Enrollment']} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
        }}
      >
        {/* Recent Activity Card */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          variants={cardVariants}
          custom={0}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={activity.id} 
                className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <div className="bg-indigo-100 rounded-full p-2">
                  <activity.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events Card */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          variants={cardVariants}
          custom={1}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">Add Event</button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <motion.div 
                key={event.id} 
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <div className="bg-indigo-100 rounded-lg p-3 text-center min-w-14">
                  <p className="text-xs font-medium text-indigo-600">
                    {event.date.split(',')[0]}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{`${event.date} at ${event.time}`}</p>
                </div>
                <div className="ml-auto">
                  <button className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 transition-colors">Details</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;