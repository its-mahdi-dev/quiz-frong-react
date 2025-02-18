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
  const [page, setPage] = useState(1);
  const [total_page, setTotal_page] = useState(1);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [errMsg, setErrMsg] = useState([]);
  const [modals, setModals] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [body, setBody] = useState("");
  const [correctAnswerId, setCorrectAnswerId] = useState();
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState("");
  const [startTime, setstartTime] = useState("");
  const [endTime, setendTime] = useState("");
  const [categoryId, setcategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const router = useRouter();
  const searchIndexes = [0];

  const updateItems = (data) => {
    let newItems = data.map((item) => [
      item.body,
      item.categoryName,
      item.user.first_name + " " + item.user.last_name,
      JDate(item.createdAt).toString("yyyy/MM/dd HH:mm"),
      JDate(item.startTime).toString("yyyy/MM/dd HH:mm"),
      item.duration,
    ]);

    let new_modals = [];
    data.forEach((item, index) => {
      let modal = (
        <QuestionAnswer
          body={item.body}
          answers={item.answers}
          correctAnswerId={item.correctAnswerId}
          index={index}
        />
      );
      new_modals = [modal, ...new_modals];
    });
    setModals(new_modals);
    setItems(newItems);
    setLoading(false);
  };
  const getQuestions = async (val ="", next_page = 1) => {
    if (!token) return;
    if ((next_page > total_page && total_page != 0) || next_page == 0) return;
    setLoading(true);
    await axios
      .get(
        "http://localhost:8082/api/designer/questions?search=" +
          val +
          "&page=" +
          next_page,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then(function (response) {
        let data = response.data.data;
        setPage(response.data.meta.currentPage);
        setTotal_page(response.data.meta.totalPages);
        updateItems(data);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      });
  };
  const getCategories = async () => {
    if (!token) return;
    await axios
      .get("http://localhost:8082/api/designer/categories", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data.data;
        let new_categories = data.map((category) => ({
          label: category.name,
          value: category.id,
        }));
        setCategories(new_categories);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      });
  };

  useEffect(() => {
    setToken(Cookies.get("token"));
    getQuestions();
    getCategories();
  }, [token]);

  const addQuestion = async (e) => {
    if (!token) return;
    if (errMsg.length > 0) return;
    if (!correctAnswerId) {
      setErrMsg("لطفا گزینه صحیح این سوال را انتخاب کنید");
      return;
    }

    
    setLoadingBtn(true);
    let new_answers = [];
    answers.forEach(ans => {
        let new_ans = {
            body: ans
        }
        new_answers = [...new_answers, new_ans];
    })
    const data = {
        body,
        correctAnswerId : Number(correctAnswerId),
        duration,
        startTime,
        endTime,
        categoryId,
        answers: new_answers,
    }; 
    await axios
      .post("http://localhost:8082/api/designer/questions", data, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data;
        getQuestions();
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      })
      .finally(function () {
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
              <Input
                label="شرح سوال"
                value={body}
                onChange={(val, err) => {
                  setBody(val);
                  setErrMsg(err);
                }}
                validations={["required"]}
                min={10}
              />
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
                    onChange={(e) => {
                      setCorrectAnswer(e.target.value);
                    }}
                  />
                  <Input
                    label="گزینه یک"
                    value={answers[0]}
                    onChange={(value, err) => {
                      setNewAnswer(value, 0);
                      setErrMsg(err);
                    }}
                    validations={["required"]}
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
                    onChange={(e) => {
                      setCorrectAnswer(e.target.value);
                    }}
                  />

                  <Input
                    label="گزینه دو"
                    value={answers[1]}
                    onChange={(value, err) => {
                      setNewAnswer(value, 1);
                      setErrMsg(err);
                    }}
                    validations={["required"]}
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
                    onChange={(e) => {
                      setCorrectAnswer(e.target.value);
                    }}
                  />

                  <Input
                    label="گزینه سه"
                    value={answers[2]}
                    onChange={(value, err) => {
                      setNewAnswer(value, 2);
                      setErrMsg(err);
                    }}
                    validations={["required"]}
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
                    onChange={(e) => {
                      setCorrectAnswerId(e.target.value);
                    }}
                  />

                  <Input
                    label="گزینه چهار"
                    value={answers[3]}
                    onChange={(value, err) => {
                      setNewAnswer(value, 3);
                      setErrMsg(err);
                    }}
                    validations={["required"]}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap w-full mt-4">
              <Select options={categories} onChange={setcategoryId} />
              <Input
                value={duration}
                onChange={(val, err) => {
                  setDuration(val);
                  setErrMsg(err);
                }}
                label="مدت زمان پاسخگویی (به ثانیه)"
                validations={["required", "number"]}
              />
              <Input
                value={startTime}
                onChange={setstartTime}
                label="تاریخ شروع سوال"
                type="date"
              />
              <Input
                value={endTime}
                onChange={setendTime}
                label="تاریخ پایان سوال"
                type="date"
              />
            </div>
            <span className="-text-error form-error mt-4 block text-center w-full">
              {errMsg}
            </span>
            <div className="w-full">
              <div className="lg:w-1/2 w-full lg:pe-1 mt-6 mb-8">
                <button
                  className="btn btn-active btn-accent w-full"
                  onClick={() => addQuestion()}
                >
                  {!loadingBtn ? (
                    "افزودن"
                  ) : (
                    <span className="loading loading-dots loading-md"></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Accordion>

        <div className="transition-all duration-150">
          <SearchTable
            body={items}
            modals={modals}
            head={head}
            title="سوالات"
            searchIndexes={searchIndexes}
            search_api={true}
            onSearch={(val) => {
              setSearch(val);
              getQuestions(val , page);
            }}
            changePage={(offset) => {
              setPage(page + offset);
              getQuestions(search , page+ offset);
            }}
            loading={loading}
          />
        </div>
      </div>
    </section>
  );
}
