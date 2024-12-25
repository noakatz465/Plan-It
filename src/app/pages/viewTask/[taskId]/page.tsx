import ViewTask from '@/app/components/tasks/ViewTask'
import React from 'react'

function page({ params }: { params: { taskId: string } }) {
  return (
    <div>
      <ViewTask params={params}></ViewTask>
    </div>
  )
}

export default page
