"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import Cookies from "js-cookie";
import axios from "axios";
import SearchTable from "@/app/components/searchTable";
import { JDate } from "jdate";
import QuestionAnswer from "@/app/components/modals/questionAnswer";
export default function Question() {
  const head = [
    "متن سوال",
    "نام دسته بندی",
    "ایجاد کننده",
    "تاریخ ایجاد",
    "تاریخ شروع",
    "مدت زمان پاسخگویی",
    "مشاهده کامل",
  ];
  const [items, setItems] = useState([]);
  const [modals, setModals] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchIndexes = [0,1,2];

  const updateItems = (data) => {
    let newItems = data.map((item) => [
      item.body,
      item.category.name,
      item.user.first_name + " " + item.user.last_name,
      JDate(item.createdAt).toString('yyyy/MM/dd HH:mm'),
      JDate(item.start_time).toString('yyyy/MM/dd HH:mm'),
      item.duration,
    ]);
    
    let new_modals = [];
    data.forEach((item , index) => {
      let modal = <QuestionAnswer body={item.body} answers={item.answers} correct_answer_id={item.correct_answer_id} index={index} />;
      new_modals = [modal , ...new_modals];
    });
    setModals(new_modals);
    setItems(newItems);
    setLoading(false);
  };
  const getQuestions = async () => {
    if (!token) return;
    await axios
      .get("http://localhost:5000/api/designer/questions", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data;
        updateItems(data);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      })
      .finally(function () {});
  };
  useEffect(() => {
    setToken(Cookies.get("token"));
    getQuestions();
  }, [token]);
  return (
    <section className="p-3">
      <div className="my-3">
      {loading ? (
        <span className="loading loading-bars loading-md"></span>
      ) : (
        <div className="transition-all duration-150">
          <SearchTable body={items} modals={modals} head={head} title="سوالات" searchIndexes={searchIndexes}/>
        </div>
      )}
        
      </div>
    </section>
  );
}
