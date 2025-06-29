import React from 'react'

const Spinner = () => {
 
   return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400/90"></div>
    </div>
  )
}
export default Spinner