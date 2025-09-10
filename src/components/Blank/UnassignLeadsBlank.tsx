import { Squirrel } from 'lucide-react'
import React from 'react'

const UnassignLeadsBlank = () => {
  return (
    <div>
          <div className="flex flex-col items-center justify-center py-12 min-h-screen text-gray-500">
              <Squirrel size={80} className='text-orange-300'/>
              <p className="text-lg font-medium">No leads available</p>
              <p className="text-sm text-gray-400">Try refreshing or check back later.</p>
          </div>
    </div>
  )
}

export default UnassignLeadsBlank