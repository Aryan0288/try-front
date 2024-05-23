import React from 'react'

export default function Avatar({userId,username,online}) {
    const firstLetter = username ? username[0].toUpperCase() : '';
    const colors=['bg-red-500','bg-green-500','bg-purple-500','bg-blue-500','bg-yellow-500','bg-teal-500']
    
    const userBase10=parseInt(userId.substring(10),16);
    const colorIndex=userBase10 % colors.length;

    const color=colors[colorIndex];
    // console.log("color is "+color);
    return (
    <div className={'w-8 h-8 relative rounded-full text-center flex items-center '+color}>
        <div className='text-center w-full'>{firstLetter}</div>
        { online && (
          <div className='absolute w-3 h-3 bg-green-600 -bottom-[2px] -right-[2px] border border-white shadow-lg shadow-black  rounded-full'></div>
        )}
        { !online && (
          <div className='absolute w-3 h-3 bg-gray-700 -bottom-[2px] -right-[2px] border border-white shadow-lg shadow-black  rounded-full'></div>
        )}
    </div>
  )
}
