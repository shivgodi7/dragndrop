// src/components/Column.tsx
import { Paper, Typography, Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import {Column, Task} from '../types'

interface ColumnProps {
  column: Column;
  onAddTask: (columnId: string, task: Task) => void;
  onEditT: (taskId: string, newTitle: string) => void;
  onDeleteT: (columnId: string, taskId: string)=> void;
  onEditSt: (taskId: string, stId: string, newTitle: string) => void;
  onDeleteSt: (taskId: string, stId: string)=> void;  
}

const Columns: React.FC<ColumnProps> = ({ column, onAddTask, onEditT, onDeleteT, onEditSt, onDeleteSt }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  let bgColor = '';
  switch (column.id) {
    case "not-started" : { bgColor = 'pink'; break;}
    case "in-progress" : { bgColor = '#00FFFF'; break;}
    case "blocked" : { bgColor = '#B0C4DE'; break;}
    case "done" : { bgColor = '#F5F5DC'; break;}
  }
  const handleEditTask = (taskId:string, title:string) =>{
    console.log("handleEditTask called..in Columns")
    onEditT(taskId, title);
  }
  const handleAddTask = () => {
    console.log("handleAddTask is getting called")
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `${Date.now()}`,
      title: newTaskTitle.trim(),
      dueData: new Date().toDateString(),
      subTasks: [{id: '111', title: 'st 111'}, {id: '112', title: 'st 112'}, {id: '113', title: 'st 113'}]
    };
    onAddTask(column.id, newTask);
    setNewTaskTitle('');
  };
  const handleEditSt = (taskId: string, stId:string, title:string) =>{
    console.log("handleEditSt called...in Columns");
    onEditSt(taskId, stId, title);
  }
  const handleDeleteSt = (taskId: string, stId: string) => {
    console.log("handleDeleteSt called...in Columns");
    onDeleteSt(taskId, stId);
  }
  const handleDeleteTask = (taskId:string) => {
    onDeleteT(column.id, taskId);
  }
  const {isOver, setNodeRef } = useDroppable({
    id: column.id,
  });
  const style = {
    color: isOver ? 'red' : undefined,
  };

  return (
    <Box ref={setNodeRef} style={style} sx={{ width: '270px', margin: 2 }}>
      <Paper sx={{ padding: 2, marginBottom: 2, backgroundColor:bgColor}}>
        <Typography variant="h6">{column.title}</Typography>
      </Paper>
      <Box
        style={{maxWidth: '100%'}}
      >
        {column.tasks?.map((task) => (
          <TaskCard key={task.id} col={column.id} task={task} onEditT={handleEditTask} 
          onDeleteT={handleDeleteTask} onEditSt={handleEditSt} onDeleteSt={handleDeleteSt}/>
        ))}
      </Box>
      {column.id === "not-started" && 
      <Box sx={{ marginTop: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="New Task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button onClick={handleAddTask}>Add</Button>
      </Box>}
    </Box>
    
  );
};

export default Columns;
