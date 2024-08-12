import React from 'react'

const Input = ({ name, value, onChange, type = 'text', disabled = false }) => {
    return (
        <div className='flex flex-col gap-1'>
            <span className='text-[15px] font-medium'>{name}</span>
            <input disabled={disabled} type={type} className='border-[#dbdbdb] border-[1px] text-[14px] px-2 py-2 focus:outline-none rounded-md' value={value} placeholder={name} onChange={(e) => onChange(e)} />
        </div>
    )
}

export default Input