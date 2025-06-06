// src/components/KanbanBoard.tsx
import { Box } from '@mui/material';
import { DndContext, rectIntersection } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import Column from './Column';
import { Column as ColumnType, Task } from '../types';

const initialColumns: ColumnType[] = [
  {
    id: 'not-started',
    title: 'Not Started',
    tasks: [
      { id: 'task-1', title: 'Task 1', dueData: '2/2/2026', 
        subTasks:[{id: '111', title: 'st 111'}, {id: '112', title: 'st 112'}, {id: '113', title: 'st 113'}] },
      { id: 'task-2', title: 'Task 2', dueData: '2/2/2026', 
        subTasks:[{id: '11', title: 'st 11'}, {id: '12', title: 'st 12'}, {id: '13', title: 'st 13'}] }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: 'task-3', title: 'Task 3', dueData: '2/2/2026', 
        subTasks:[{id: '1111', title: 'st 1111'}, {id: '1112', title: 'st 1112'}, 
          {id: '1113', title: 'st 1113'}] }
    ]
  },
    {
    id: 'blocked',
    title: 'Blocked',
    tasks: [
      { id: 'task-4', title: 'Task 4', dueData: '2/2/2026', 
        subTasks:[{id: '2111', title: 'st 2111'}, {id: '2112', title: 'st 2112'}, 
          {id: '2113', title: 'st 2113'}] }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: 'task-5', title: 'Task 5', dueData: '2/2/2026', 
        subTasks:[{id: '1114', title: 'st 1114'}, {id: '1124', title: 'st 1124'}, 
          {id: '1134', title: 'st 1134'}]}
    ]
  }
];

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    const key : string = 'kanban-columns';
    const stored : string | null = localStorage.getItem(key);
    // console.log(JSON.parse(stored as string));
    // console.log(stored);
    return stored ? JSON.parse(stored) : initialColumns;
  });
  useEffect(() => {
    console.log("useEffect called =================")
    try{
    localStorage.setItem('kanban-columns', JSON.stringify(columns));
    } catch(e){
      console.log("localStorage error", e);
    }
  }, [columns]);

  const handleDeleteTask = (columnId: string, taskId: string) => {
    console.log("handleDeleteTAsk called ");
      setColumns((prev) =>
        prev?.map((col) =>
          col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col
      )
    );
  }
  const handleEditTask = (taskId: string, newTitle: string) => {
    console.log("handleEditTask called in KanbanBoard");
    console.log('newTitle, taskId', newTitle, taskId)
    // columns.map((col) => {
    //   col.tasks.map((task)=>{
    //     console.log("task.id", task.id);
    //     if(task.id === taskId){
    //       setColumns((cols) =>
    //         cols.map((col) => ({
    //         ...col,
    //         tasks: col.tasks.map((t) =>
    //            t.id === taskId ? { ...t, title: newTitle } : t
    //         ),
    //       }))
    //       );
    //     }
    //   })
    // })
    setColumns((cols) =>
      cols?.map((col) => ({
        ...col,
        tasks: col.tasks?.map((t) =>
            t.id === taskId ? { ...t, title: newTitle } : t
        ),
      }))
    );
  };
  const handleEditSubtask = (taskId:string, stId: string, title: string)=>{
    console.log("handleEsitSubtask called...in KanbanBoard");
    setColumns((cols) =>
      cols?.map((col) => ({
        ...col,
        tasks: col.tasks?.map((t) =>(
            t.id === taskId ? { ...t,  subTasks: t.subTasks?.map((st)=>(st.id === stId)?{...st,title: title}:st)} : t)
        ),
      }))
    );
  }
  const handleDeleteSubtask = (taskId:string, stId:string) => {
    console.log("handleDeleteSubtask called in KanbanBoard");
    console.log("taskId, stId", taskId, stId);
  }
  const handleAddTask = (columnId: string, task: Task) => {
    console.log("handleAddTask is getting called ")
    setColumns((prev) =>
      prev?.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
      )
    );
  };

  const handleDragEnd = (event: any) => {
    let newTask : Task = {id: '', title: "", dueData:'', subTasks:[]};
    let activeColumn : any ;
    let overColumn: any;
    // console.log("event : ", event);
    const { active, over } = event;
    // console.log("active", active);
    // console.log("over", over);
    // if (event.activatorEvent.type !== "pointerdown") {
    if (over) {
      // console.log("columns", columns);
      activeColumn = columns.find((col) => {
        // console.log("col.tasks", col.tasks);
        return col?.tasks.find((val: any, key : any ) => {
          if (col.tasks[key].id === active.id){
            newTask = col?.tasks[key];
            return true;
          } else {return false}
        });
      });
      overColumn = columns.find((col) => col.id === over.id);
        
      if (activeColumn.id !== overColumn.id){
        if (activeColumn !== undefined){
          for(let key of activeColumn.tasks.keys()){
            if(activeColumn.tasks[key].id === active.id){
              activeColumn?.tasks.splice(key, 1);
            }
          }
        }
        if ((overColumn !== undefined) && (newTask.id !== '') ){
              overColumn?.tasks.push(newTask);
        }
        setColumns(columns?.map(col => {
          if(col.id === activeColumn?.id) {
            return {...col, activeColumn}
          }
          if(col.id === overColumn?.id) {
            return {...col, overColumn}
          }
          return col;
        }))
      }
    }
  // }
  }

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex' }}>
        {columns?.map((column) => (
          <Column 
            key={column.id} 
            column={column} 
            onAddTask={handleAddTask} 
            onEditT={handleEditTask}
            onDeleteT={handleDeleteTask}
            onEditSt={handleEditSubtask}
            onDeleteSt={handleDeleteSubtask}
          />
        ))}
      </Box>
    </DndContext>
  );
};

export default KanbanBoard;
