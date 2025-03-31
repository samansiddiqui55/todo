
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}

interface TasksState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null
};

// Load initial tasks from localStorage
const savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
  initialState.items = JSON.parse(savedTasks);
}

// Async thunk for fetching sample tasks
export const fetchSampleTasks = createAsyncThunk(
  'tasks/fetchSampleTasks',
  async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    const data = await response.json();
    
    // Transform the data to match our Task interface
    return data.map((item: any) => ({
      id: String(item.id),
      text: item.title,
      completed: item.completed,
      priority: 'medium' as Priority, // Default priority
      createdAt: new Date().toISOString()
    }));
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      const newTask: Task = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...action.payload
      };
      state.items.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(state.items));
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.items));
    },
    toggleComplete: (state, action: PayloadAction<string>) => {
      const task = state.items.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(state.items));
      }
    },
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: Priority }>) => {
      const task = state.items.find(task => task.id === action.payload.id);
      if (task) {
        task.priority = action.payload.priority;
        localStorage.setItem('tasks', JSON.stringify(state.items));
      }
    },
    clearAllTasks: (state) => {
      state.items = [];
      localStorage.setItem('tasks', JSON.stringify(state.items));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSampleTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSampleTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add the fetched tasks to our existing tasks
        state.items = [...state.items, ...action.payload];
        localStorage.setItem('tasks', JSON.stringify(state.items));
      })
      .addCase(fetchSampleTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tasks';
      });
  }
});

export const { 
  addTask, 
  deleteTask, 
  toggleComplete, 
  updateTaskPriority,
  clearAllTasks
} = tasksSlice.actions;

export default tasksSlice.reducer;
