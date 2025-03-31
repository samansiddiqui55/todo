
import { useState, useEffect } from 'react';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import { CheckCircle, Circle } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';

const Index = () => {
  const { items } = useAppSelector((state) => state.tasks);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    high: 0,
    medium: 0,
    low: 0
  });

  useEffect(() => {
    const completed = items.filter(task => task.completed).length;
    const high = items.filter(task => task.priority === 'high').length;
    const medium = items.filter(task => task.priority === 'medium').length;
    const low = items.filter(task => task.priority === 'low').length;
    
    setStats({
      total: items.length,
      completed,
      high,
      medium,
      low
    });
  }, [items]);

  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
            To-Do 
          </h1>
        </header>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-8 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="mr-2 h-6 w-6 text-purple-500" />
            Add New Task
          </h2>
          <TaskInput />
        </div>

        {stats.total > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-purple-500">
              <p className="text-sm font-medium text-gray-500">Completion</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-800">{completionPercentage}%</p>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  {stats.completed}/{stats.total}
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-red-500">
              <p className="text-sm font-medium text-gray-500">High Priority</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-800">{stats.high}</p>
                <div className="text-sm text-gray-600">
                  {Math.round((stats.high / stats.total) * 100) || 0}%
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-gray-500">Medium Priority</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-800">{stats.medium}</p>
                <div className="text-sm text-gray-600">
                  {Math.round((stats.medium / stats.total) * 100) || 0}%
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500">
              <p className="text-sm font-medium text-gray-500">Low Priority</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-800">{stats.low}</p>
                <div className="text-sm text-gray-600">
                  {Math.round((stats.low / stats.total) * 100) || 0}%
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl p-6 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Circle className="mr-2 h-6 w-6 text-purple-500" />
            Tasks
          </h2>
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Index;
