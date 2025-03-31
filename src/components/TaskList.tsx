
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchSampleTasks, clearAllTasks, Priority } from '@/store/tasksSlice';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { ClipboardList, RefreshCw, Search, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TaskList = () => {
  const { items, status, error } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  
  useEffect(() => {
    if (items.length === 0 && status === 'idle') {
      dispatch(fetchSampleTasks());
    }
  }, [dispatch, items.length, status]);

  const handleFetchSampleTasks = () => {
    dispatch(fetchSampleTasks());
    toast({
      title: "Sample tasks fetched",
      description: "Sample tasks have been loaded from the API",
    });
  };

  const handleClearAllTasks = () => {
    dispatch(clearAllTasks());
    toast({
      title: "All tasks cleared",
      description: "All tasks have been removed",
    });
  };

  const filteredTasks = items.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Sort tasks by priority (high > medium > low) and then by creation date (newest first)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={handleFetchSampleTasks}>Try Again</Button>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks yet</h3>
          <p className="text-gray-500 mb-4">Add tasks to get started or load sample tasks.</p>
          <Button onClick={handleFetchSampleTasks}>Load Sample Tasks</Button>
        </div>
      );
    }

    if (sortedTasks.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No matching tasks</h3>
          <p className="text-gray-500">Try adjusting your search or filter.</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select 
          value={filterPriority} 
          onValueChange={(value) => setFilterPriority(value as Priority | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleFetchSampleTasks}
          className="bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        {items.length > 0 && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleClearAllTasks}
            className="bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {renderContent()}
    </div>
  );
};

export default TaskList;
