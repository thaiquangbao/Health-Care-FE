import React from 'react'

const Sure = ({ visible, functionalAccept, functionalReject, hidden, message }) => {
    return (
        <section
            style={{
                width: visible ? '400px' : 0,
                height: visible ? 'auto' : 0,
                transition: '0.5s'
            }}
            className='bg-[white] rounded-lg fixed overflow-hidden left-[50%] top-[50%] z-[45] translate-x-[-50%] translate-y-[-50%]'
        >
            <div className='w-full h-full px-[1rem] gap-1 py-[1rem] flex flex-col'>
                <span className='font-bold text-[20px]'>Thông Báo</span>
                <span className='font-semibold'>{message}</span>
                <div className='w-full flex items-center justify-end gap-2'>
                    <button onClick={() => {
                        functionalReject()
                        hidden()
                    }} className="text-[white] bg-[red] font-semibold px-3 py-[5px] rounded-md hover:scale-[1.05] transition-all">
                        Hủy
                    </button>
                    <button onClick={() => {
                        functionalAccept()
                        hidden()
                    }} className="text-[white] bg-[#1dcbb6] font-semibold px-3 py-[5px] rounded-md hover:scale-[1.05] transition-all">
                        Đồng ý
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Sure