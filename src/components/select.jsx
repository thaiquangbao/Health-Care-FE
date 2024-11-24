import React from 'react'

const Select = ({ name, value, onChange, list }) => {
    return (
        <div className='flex flex-col gap-1'>
            <span className='text-[15px] font-medium'>{name}</span>
            <select className='border-[#dbdbdb] border-[1px] text-[14px] px-2 py-2 focus:outline-none rounded-md' value={value} onChange={(e) => onChange(e)}>
                <option value={''}>{name}</option>
                {list.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </select>
        </div>
    )
}

export default Select