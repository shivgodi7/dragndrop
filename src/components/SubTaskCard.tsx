import {SubTask} from '../types'
import {Typography, TextField, IconButton } from '@mui/material';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import Checkbox from '@mui/material/Checkbox';

interface SubTaskCardProps {
  subTask: SubTask;
  onEditSubTask: (subTaskId: string, title: string) => void;
  onDeleteSubTask: (stId: string)=>void;
}

const SubTaskCard: React.FC<SubTaskCardProps> = ({ subTask, onEditSubTask, onDeleteSubTask}) => { 
  const [title, setSubTask] = useState(subTask.title);
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState(false)
  const handleChange = (e:any)=>{
    console.log("e.value", e.value);
    setChecked(val => !val);
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
            checked={checked}
            onChange={handleChange}
          /> 
          <Typography 
            onClick={()=>setEditing(true)} 
            style={{textDecorationLine:`${checked ? 'line-through' : 'none'}`, wordWrap: 'break-word', width:'60%', position: 'relative', paddingLeft:'7px'}}
          > 
            {title} 
          </Typography>
        </>
      )}  
      
      <IconButton style={{ position: 'relative', zIndex:1000, pointerEvents: 'auto', paddingLeft:'7px'}} onClick={handleDeleteSubTask} size="small" color="error">
        <DeleteIcon fontSize="small" />
      </IconButton>

    </div>
  )
}
export default SubTaskCard;