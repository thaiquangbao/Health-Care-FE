"use client";
import LineChart from "@/components/Chart/LineChart";
import Navbar from "@/components/navbar";
export default function ThongTin() {
    return (
        <div className="w-full pt-[60px] min-h-screen flex flex-col pb-[2rem]">
            <Navbar />
            <div className="flex flex-col gap-4 mt-2">
                <div className="items-center flex justify-center">
                    <span className="text-[30px] font-semibold text-center">
                        Hồ sơ sức khỏe
                    </span>
                </div>
                <LineChart />
            </div>
        </div>
    )
}