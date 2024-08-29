import React from 'react'

const UpdateHealthForm = ({ logBook, hidden }) => {
    return (
        <section style={{
            width: logBook ? '80%' : '0',
            height: logBook ? '90%' : '0',
            transition: '0.5s'
        }}
            className='bg-[white] rounded-xl fixed top-[50%] z-[45] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden'
        >
            <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
        </section>
    )
}

export default UpdateHealthForm