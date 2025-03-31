
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addTask, Priority } from '@/store/tasksSlice';
import { toast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

const TaskInput = () => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim()) {
      dispatch(addTask({
        text: text.trim(),
        completed: false,
        priority
      }));
      
      setText('');
      toast({
        title: "Task added",
        description: "Your task has been added successfully",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 mb-8">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-grow"
      />
      
      <Select 
        value={priority} 
        onValueChange={(value) => setPriority(value as Priority)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">High Priority</SelectItem>
          <SelectItem value="medium">Medium Priority</SelectItem>
          <SelectItem value="low">Low Priority</SelectItem>
        </SelectContent>
      </Select>
      
      <Button type="submit" className="gap-2">
        <PlusCircle size={18} />
        <span>Add Task</span>
      </Button>
    </form>
  );
};

export default TaskInput;
