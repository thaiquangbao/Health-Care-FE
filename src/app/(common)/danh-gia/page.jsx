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
      <FormAssessment />
      <Footer />
    </div>
  );
};
export default DanhGia;
