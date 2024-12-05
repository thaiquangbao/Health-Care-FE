import React from 'react'

const Location = ({ lat, lon, setType, address }) => {
    return (
        <div className="px-[2rem] min-w-[100%] h-full py-[1rem] flex flex-col justify-start gap-2">
            <div className='flex items-center'>
                <i onClick={() => setType(0)} className='bx bx-chevron-left text-[30px] cursor-pointer text-[#565656]'></i>
                <span className="font-semibold">{address}</span>
            </div>
            <div className="min-w-[100%] h-full px-[2.5rem] flex justify-center">
                <iframe
                    src={`https://www.google.com/maps?q=${lat},${lon}&z=15&output=embed`}
                    width={'100%'}
                    height="500"
                    style={{ border: 0, borderRadius: '10px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div >
    )
}

export default Location