"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";

import Cookies from "js-cookie";
import axios from "axios";
import SearchTable from "@/app/components/searchTable";
import { JDate } from "jdate";
import QuestionAnswer from "@/app/components/modals/questionAnswer";
import Accordion from "@/app/components/accordion";
import Input from "@/app/components/forms/input";
import Select from "@/app/components/forms/select";
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
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [body, setBody] = useState("");
  const [correct_answer, setCorrect_answer] = useState("");
  const [duration, setDuration] = useState("");
  const [start_time, setStart_time] = useState("");
  const [end_time, setEnd_time] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [categories, setCategories] = useState([]);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const router = useRouter();
  const searchIndexes = [0, 1, 2];

  const updateItems = (data) => {
    let newItems = data.map((item) => [
      item.body,
      item.category.name,
      item.user.first_name + " " + item.user.last_name,
      JDate(item.createdAt).toString("yyyy/MM/dd HH:mm"),
      JDate(item.start_time).toString("yyyy/MM/dd HH:mm"),
      item.duration,
    ]);

    let new_modals = [];
    data.forEach((item, index) => {
      let modal = (
        <QuestionAnswer
          body={item.body}
          answers={item.answers}
          correct_answer_id={item.correct_answer_id}
          index={index}
        />
      );
      new_modals = [modal, ...new_modals];
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
      
  };
  const getCategories = async () => {
    if (!token) return;
    await axios
      .get("http://localhost:5000/api/designer/categories", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data;
        let new_categories = data.map((category) => ({
          label: category.name,
          value: category.id
        }));
        setCategories(new_categories);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      })
  };
  useEffect(() => {
    setToken(Cookies.get("token"));
    getQuestions();
    getCategories();
  }, [token]);

 
  const addQuestion = async (e) => {
    if (!token) return;
    setLoadingBtn(true);
    const data = {
      body,
      correct_answer,
      duration,
      start_time,
      end_time,
      category_id,
      answers,
    };
    await axios
      .post("http://localhost:5000/api/designer/questions", data, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data;
        getQuestions();
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      }).finally(function(){
        setLoadingBtn(false);
      });
  };

  const setNewAnswer = useCallback(
    (val, index) => {
      let new_answers = [...answers];
      new_answers[index] = val;
      setAnswers(new_answers);
    },
    [answers]
  );

  return (
    <section className="p-3">
      <div className="my-3">
        <Accordion title="ایجاد سوال">
          <div action="create" className="flex flex-wrap">
            <div className="w-full lg:pe-1 mt-2 check-input relative">
              <span className="mb-1 -text-error text-xs error-message absolute -top-4"></span>
              <Input label="شرح سوال" value={body} onChange={setBody} />
            </div>
            <div className="lg:w-1/2 w-full lg:pr-10 pr-3 mt-4">
              <div className="lg:pe-1 mt-2 check-input relative">
                <span className="mb-1 -text-error text-xs error-message absolute -top-4"></span>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="radio-5"
                    value="0"
                    className="radio radio-success ml-2"
                    onChange={(e)=>{setCorrect_answer(e.target.value)}}
                  />
                  <Input
                    label="گزینه یک"
                    value={answers[0]}
                    onChange={(value) => setNewAnswer(value, 0)}
                  />
                </div>
              </div>
              <div className="lg:pe-1 mt-2 check-input relative">
                <span className="mb-1 -text-error text-xs error-message absolute -top-4"></span>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="radio-5"
                    value="1"
                    className="radio radio-success ml-2"
                    onChange={(e)=>{setCorrect_answer(e.target.value)}}
                  />

                  <Input
                    label="گزینه دو"
                    value={answers[1]}
                    onChange={(value) => setNewAnswer(value, 1)}
                  />
                </div>
              </div>
              <div className="lg:pe-1 mt-2 check-input relative">
                <span className="mb-1 -text-error text-xs error-message absolute -top-4"></span>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="radio-5"
                    value="2"
                    className="radio radio-success ml-2"
                    onChange={(e)=>{setCorrect_answer(e.target.value)}}
                  />

                  <Input
                    label="گزینه سه"
                    value={answers[2]}
                    onChange={(value) => setNewAnswer(value, 2)}
                  />
                </div>
              </div>
              <div className="lg:pe-1 mt-2 check-input relative">
                <span className="mb-1 -text-error text-xs error-message absolute -top-4"></span>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="radio-5"
                    value="3"
                    className="radio radio-success ml-2"
                    onChange={(e)=>{setCorrect_answer(e.target.value)}}
                  />

                  <Input
                    label="گزینه چهار"
                    value={answers[3]}
                    onChange={(value) => setNewAnswer(value, 3)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap w-full mt-4">
              <Select options={categories} onChange={setCategory_id} />
              <Input
                value={duration}
                onChange={setDuration}
                label="مدت زمان پاسخگویی (به ثانیه)"
              />
              <Input
                value={start_time}
                onChange={setStart_time}
                label="تاریخ شروع سوال"
                type="date"
              />
              <Input
                value={end_time}
                onChange={setEnd_time}
                label="تاریخ پایان سوال"
                type="date"
              />
            </div>
            <span className="-text-error form-error mt-4 block text-center w-full"></span>
            <div className="w-full">
              <div className="lg:w-1/2 w-full lg:pe-1 mt-8">
                <button
                  className="btn btn-active btn-accent w-full"
                  onClick={() => addQuestion()}
                >
                  {!loadingBtn ? "افزودن" : (
                  <span className="loading loading-dots loading-md"></span>
                )}
                </button>
              </div>
            </div>
          </div>
        </Accordion>

        {loading ? (
          <div className="text-center mt-8">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : (
          <div className="transition-all duration-150">
            <SearchTable
              body={items}
              modals={modals}
              head={head}
              title="سوالات"
              searchIndexes={searchIndexes}
            />
          </div>
        )}
      </div>
    </section>
  );
}
