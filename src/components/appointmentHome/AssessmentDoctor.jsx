import { notifyType } from '@/context/GlobalContext';
import { utilsContext } from '@/context/UtilsContext';
import { api, TypeHTTP } from '@/utils/api';
import React from 'react'
import { useState, useContext } from 'react';

const AssessmentDoctor = ({ setType, appointmentHome }) => {
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState("");
    const [name, setName] = useState("");
    const { utilsHandler } = useContext(utilsContext)

    const handleRating = (rate) => {
        setRating(rate);
    };

    const submit = () => {
        const data = {
            doctor_record_id: appointmentHome?.doctor_record_id,
            assessment_list: {
                star: rating,
                content: comments,
                fullName: appointmentHome?.patient.fullName,
                image: appointmentHome?.patient.image,
                date: {
                    day: appointmentHome?.appointment_date?.day,
                    month: appointmentHome?.appointment_date?.month,
                    year: appointmentHome?.appointment_date?.year,
                },
            },
        };
        utilsHandler.notify(notifyType.LOADING, 'Đang gửi đánh giá của bạn')
        api({
            type: TypeHTTP.POST,
            path: `/assessments/save`,
            body: data,
            sendToken: false,
        }).then((res) => {
            utilsHandler.notify(
                notifyType.SUCCESS,
                "Đánh giá thành công, Cảm ơn bạn đã đánh giá!!!"
            );
            globalThis.window.location.reload()
        });
    };

    return (
        <div className="px-[2rem] min-w-[100%] h-full py-[1rem] flex flex-col gap-2">
            <div className='flex items-center'>
                <i onClick={() => setType(0)} className='bx bx-chevron-left text-[30px] cursor-pointer text-[#565656]'></i>
                <span className="font-semibold">Đánh giá bác sĩ</span>
            </div>
            <div className="min-w-[100%] px-[2.5rem] py-[1.5rem] flex justify-center">
                <div className="w-full h-full px-[0.25rem] flex flex-col gap-1">
                    <h2 className="text-xl font-bold mb-4">
                        Bạn hãy đánh giá cho bác sĩ {name}
                    </h2>
                    <div className="flex mb-4 justify-center items-center space-x-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                onClick={() => handleRating(star)}
                                className={`w-12 h-12 cursor-pointer ${star <= rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                            </svg>
                        ))}
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="comments" className="mb-1">
                                Nội dung đánh giá:
                            </label>
                            <textarea
                                id="comments"
                                name="comments"
                                className="border p-2 rounded focus:outline-0"
                                rows="4"
                                required
                                style={{ height: "145px" }}
                                value={comments}
                                onChange={(e) =>
                                    setComments(e.target.value)
                                }
                            ></textarea>
                        </div>
                        <button
                            style={{
                                background:
                                    "linear-gradient(to right, #11998e, #38ef7d)",
                            }}
                            onClick={() => submit()}
                            className="bg-blue-500 text-white p-2 rounded mt-4 cursor-pointer font-semibold text-[16px] shadow-md shadow-[#767676]"
                        >
                            Đánh giá
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AssessmentDoctor