import React from 'react'
import Avatar from './Avatar'
export default function Contact({id,username,onClick,selected,online}) {
    // console.log("this is contact username",username);
    // console.log("this is contact id",id);
    
    return (
        <div key={id} onClick={() => onClick(id)}
            className={'border-b border-gray-100 pt-2 pb-2 flex items-center gap-2 cursor-pointer ' + (selected ? 'bg-blue-400' : '')}>
            {selected && (
                <div className='w-1 h-14 rounded-md bg-blue-500'></div>
            )}

            <div className='flex gap-2 py-2 pl-4 items-center'>
                <Avatar online={online} username={username} userId={id} />
                <span className='text-gray-800 cursor-pointer '>{username}</span>
            </div>
        </div>
    )
}
