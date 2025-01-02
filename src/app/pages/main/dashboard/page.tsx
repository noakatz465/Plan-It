import TasksBarChart from '@/app/components/dashboard/TasksBarChart'
import TasksScatterChart from '@/app/components/dashboard/TasksScatterChart '
import TasksTimelineChart from '@/app/components/dashboard/TasksTimelineChart'
import UserInfo from '@/app/components/UserInfo'
import React from 'react'

function page() {
  return (
    <div>
        {/* <UserInfo/> */}
        {/* <TasksTimelineChart/> */}
        <TasksBarChart/>
        {/* <TasksScatterChart/> */}
    </div>
  )
}

export default page
