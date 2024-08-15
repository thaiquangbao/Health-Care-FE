"use client";
import FormAssessment from "@/components/assessment/FormAssessment";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { api, TypeHTTP } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
const DanhGia = () => {
  return (
    <div className="w-full min-h-screen pb-4 flex flex-col background-public">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <FormAssessment />
      </div>
    </div>
  );
};
export default DanhGia;
