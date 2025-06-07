import {SubTask} from '../types'
import {Typography, TextField, IconButton } from '@mui/material';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import Checkbox from '@mui/material/Checkbox';

interface SubTaskCardProps {
  col: string;
  subTask: SubTask;
  onEditSubTask: (subTaskId: string, title: string) => void;
  onDeleteSubTask: (stId: string)=>void;
  onStatusChange : (subtaskId:string, status: boolean)=>void;
}

const SubTaskCard: React.FC<SubTaskCardProps> = ({ col, subTask, onEditSubTask, onDeleteSubTask, onStatusChange}) => { 
  const [title, setSubTask] = useState(subTask.title);
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState(subTask.status)
  const handleChange = (e:any)=>{
    console.log("subtask.status", subTask.status);
    console.log("e.value", e.target.value);
    console.log("checked ", checked);
    setChecked(val => !val);
    onStatusChange(subTask.id, checked);
  }

  const handleSaveSubtask = () => {
    console.log("handleSaveSubtask called in SubTaskCard");
    console.log("subTask.id, title", subTask.id, title);
    if (title !== subTask.title) {onEditSubTask(subTask.id, title);}
    setEditing(false);
  };
  const handleDeleteSubTask = () => {
    console.log("handleDeleteSubTask called in SubTaskCard");
    onDeleteSubTask(subTask.id);
    // setEditing(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', border: '0px solid red' }}>
      {editing ? (
        <TextField
          style={{wordWrap: 'break-word', width:'100%', paddingLeft:'7px'}}
          variant="standard"
          value={title}
          onChange={(e) => setSubTask(e.target.value)}
          onBlur={handleSaveSubtask}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveSubtask()}
          autoFocus = {true}
        />
      ) : (
        <>
          <Checkbox  
            style={{opacity: col === 'done' ? 0.5 : 1, pointerEvents: col ==='done' ? 'none' : 'auto',}}
            checked={checked}
            onChange={handleChange}
          /> 
          <Typography 
            onClick={()=>setEditing(true)} 
            style={{opacity: col === 'done' ? 0.5 : 1, pointerEvents: col ==='done' ? 'none' : 'auto', 
              textDecorationLine:`${checked ? 'line-through' : 'none'}`, wordWrap: 'break-word', width:'60%', 
              position: 'relative', paddingLeft:'7px'}}
          > 
            {title} 
          </Typography>
        </>
      )}  
      
      <IconButton style={{ opacity: col === 'done' ? 0.5 : 1, pointerEvents: col ==='done' ? 'none' : 'auto', 
        position: 'relative', zIndex:1000, paddingLeft:'7px'}} onClick={handleDeleteSubTask} size="small" color="error">
        <DeleteIcon fontSize="small" />
      </IconButton>

    </div>
  )
}
export default SubTaskCard;