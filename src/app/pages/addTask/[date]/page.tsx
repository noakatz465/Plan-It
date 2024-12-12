import AddTask from '@/app/components/AddTask';
import React from 'react'

function page({ params }: { params: { date: string } }) {
  let dueDate;
  console.log("params"+ params.date);
  
  console.log('Due Date:', dueDate);
  if(params.date){
    dueDate = new Date(params.date);
    console.log('Due Date:', dueDate);

  }
  return (
    <div>
      {params.date? <AddTask dueDate={dueDate}></AddTask>: <AddTask></AddTask>}      
    </div>
  )
}

export default page
