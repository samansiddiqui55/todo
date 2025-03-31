
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteTask, toggleComplete, updateTaskPriority, Priority, Task } from '@/store/tasksSlice';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { Trash2, Check, Flag, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TaskItemProps {
  task: Task;
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  low: 'bg-green-100 text-green-700 border-green-300'
};

const priorityIcons: Record<Priority, React.ReactNode> = {
  high: <Flag className="h-4 w-4 text-red-500" />,
  medium: <Flag className="h-4 w-4 text-yellow-500" />,
  low: <Flag className="h-4 w-4 text-green-500" />
};

const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      dispatch(deleteTask(task.id));
      toast({
        title: "Task deleted",
        description: "The task has been removed",
      });
    }, 300);
  };
  
  const handleToggleComplete = () => {
    dispatch(toggleComplete(task.id));
  };
  
  const handlePriorityChange = (priority: Priority) => {
    dispatch(updateTaskPriority({ id: task.id, priority }));
    toast({
      title: "Priority updated",
      description: `Task priority set to ${priority}`,
    });
  };

  const timeAgo = task.createdAt 
    ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
    : '';
  
  return (
    <div 
      className={cn(
        "p-4 border rounded-lg mb-3 transition-all flex items-start gap-3",
        isDeleting ? "opacity-0 scale-95" : "opacity-100",
        task.completed ? "bg-gray-50" : "bg-white"
      )}
    >
      <Checkbox 
        checked={task.completed}
        onCheckedChange={handleToggleComplete}
        className="mt-1"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className={cn(
            "text-gray-800 break-words",
            task.completed && "line-through text-gray-500"
          )}>
            {task.text}
          </p>
          
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs px-2 py-1 rounded-full border flex items-center gap-1",
              priorityColors[task.priority]
            )}>
              {priorityIcons[task.priority]}
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePriorityChange('high')} className="gap-2">
                          <Flag className="h-4 w-4 text-red-500" />
                          High Priority
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePriorityChange('medium')} className="gap-2">
                          <Flag className="h-4 w-4 text-yellow-500" />
                          Medium Priority
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePriorityChange('low')} className="gap-2">
                          <Flag className="h-4 w-4 text-green-500" />
                          Low Priority
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Change priority</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleDelete}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
      </div>
    </div>
  );
};

export default TaskItem;
