// src/components/TaskCard.tsx
import { useEffect, useState } from 'react';
import { Paper, Typography, TextField, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';

import {Task} from '../types'
import SubTaskCard from './SubTaskCard'
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  col: string;
  task: Task;
  onEditT: (taskId: string, newTitle: string) => void;
  onDeleteT: (taskId: string)=>void;
  onDeleteSt: (taskId: string, stId: string)=>void;
  onEditSt: (taskId: string, stId: string, title: string)=>void;
  editDueData: (taskId:string, date: string)=>void;
  // addSubtask: (taskId:string, title: string)=>void;
}

const TaskCard: React.FC<TaskCardProps> = ({ col, task, onEditT, onDeleteT, onEditSt, onDeleteSt, editDueData}) => { 
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  let bgColor = '';
  const [dueData, setDueDate] = useState<Dayjs | null>(dayjs(task.dueData));

  switch (col) {
    case "not-started" : { bgColor = 'pink'; break;}
    case "in-progress" : { bgColor = '#00FFFF'; break;}
    case "blocked" : { bgColor = '#B0C4DE'; break;}
    case "done" : { bgColor = '#F5F5DC'; break;}
  }
  const onEditSubTask = (stId: string, subTask: string) =>{
    console.log("onEditSubTask called...in TaskCard");
    console.log("stId, subTask", stId, subTask);
    task.subTasks?.map((st)=>{
      if (subTask !== st.title) {onEditSt(task.id, stId, subTask)}
    })
  }
  const onDeleteSubTask = (stId:string) => {
    console.log("onDeleteSubTask called in TaskCard");
    onDeleteSt(task.id, stId);
  }
  const handleSave = () => {
    console.log("handleSave called")
    if (task.title !== title) {onEditT(task.id, title);}
    setEditing(false);
  };

  useEffect(()=>{
    if(dueData !== null)
      editDueData(task.id, dueData.format('DD/MM/YYYY'));
  }, [dueData])

  // const handleDataChange = (newDate :Dayjs) => {
  //   setDueDate(newDate);
  //   editDueData(task.id, dueData.format('YYYY/MM/DD'));
  // }

  const handleAddSubtask = () => {
    console.log("handleAddSubtask");
    // addSubtask(tast);
  }
  const handleDeleteTask = () => {
    console.log("onDeleteTask called, taskId ", task.id)
    onDeleteT(task.id);
  }

  const handleEditTask = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
    console.log("Inside handleEditTask", event);
    setEditing(true);
  }

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      // index: props.index,
      // supports: ['todo', 'in-progress', 'done'],
    },
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

  return (
    <>
      <Paper
        elevation={3}
        {...attributes} 
        // {...listeners} 
        ref={setNodeRef} 
        sx={{
          padding: 2,
          marginBottom: 1,
          zIndex: 1000,
          pointerEvents: 'auto',
          position: 'relative',
          maxWidth:'100%'
        }}
      >
      <div style={{cursor:'grab',  backgroundColor:'#E0FFFF', width:'100%', height:'100%'}} {...listeners}>
        <DragHandleIcon />
      </div>        
        {editing ? (
          <TextField
            style = {{wordWrap: 'break-word', width:'100%', borderStyle: 'none'}}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus = {true}
            placeholder="Edit task title"
            aria-label="Task title"
          />
        ) : (
          <Typography 
            onClick={handleEditTask} 
            style = {{wordWrap: 'break-word', width:'100%', pointerEvents: 'auto', zIndex:1000, cursor: 'pointer'}}
            onKeyDown={(e) => e.key === 'Enter' && handleEditTask}
            tabIndex={0}
            role="button"
          >
            {task.title}
          </Typography>
        )}

        {task.subTasks?.map((st)=>(
          <SubTaskCard  
            key={st.id} 
            subTask={st}
            onEditSubTask={onEditSubTask}
            onDeleteSubTask={onDeleteSubTask}/>
        ))}
        { (col === 'not-started') ? 
        <Box
          style={{marginTop:'10px'}}
        >        
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateField', 'DateField']}>
              <DateField
                label="Due Data"
                value={dueData}
                onChange={(newDate)=>{setDueDate(newDate)}}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box> : 
        <Typography
          style={{backgroundColor:bgColor, padding:'5px', paddingLeft:'20px', marginTop:'10px'}}
        >
          {dueData ? `Due ${dueData.format('YYYY/MM/DD')}` : 'No due date'}</Typography>}
      </Paper>
        <Tooltip title="Delete Task" placement="bottom">
          <IconButton 
            style = {{pointerEvents:'auto', zIndex:1000}}
            onClick={handleDeleteTask} 
            size="small" 
            color="error"
          >
            <DeleteIcon  fontSize="small" />
          </IconButton>
        </Tooltip>
        {((col === 'not-started') || (col === 'in-progress')) && 
        <Tooltip title="Add subtask" placement="bottom">
          <IconButton 
            style = {{ position:'relative', pointerEvents:'auto', zIndex:1000}}
            onClick={handleAddSubtask} 
            size="small" color="error"
          >
            <AddIcon  fontSize="small" />
          </IconButton>
        </Tooltip>}
    </>
  )
}

export default TaskCard;
