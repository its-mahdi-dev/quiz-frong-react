"use client";
import QuestionAnswer from "@/app/components/modals/questionAnswer";
import SearchTable from "@/app/components/searchTable";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Question() {
  const head = [
    "متن سوال",
    "نام دسته بندی",
    "مدت زمان پاسخگویی",
    "پاسخ شما",
    "پاسخ درست",
    "مشاهده سوال",
  ];
  const [page, setPage] = useState(1);
  const [total_page, setTotal_page] = useState(1);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [modals, setModals] = useState([]);
  const [token, setToken] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const router = useRouter();
  const searchIndexes = [0, 1];
  const updateItems = (data) => {
    data.forEach((value) => {
      value.answers.forEach((item) => {
        if (item.id == value.correctAnswerId)
          value.correct_answer_id = item.order + 1;
      });
    });
    let newItems = data.map((item) => [
      item.body,
      item.categoryName,
      item.duration,
      item.answer.order + 1,
      item.correct_answer_id,
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
  const getQuestions = async (val = "", next_page = 1) => {
    if (!token) return;
    if ((next_page > total_page && total_page != 0) || next_page == 0) return;
    setLoading(true);
    await axios
      .get(
        "http://localhost:8081/api/player/questions?search=" +
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

  useEffect(() => {
    setToken(Cookies.get("token"));
    getQuestions();
  }, [token]);

  const submitRandomQuestion = async () => {
    if (!token) return;
    setLoadingBtn(true);
    await axios
      .get("http://localhost:8081/api/player/questions/random", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data;
        if (data) router.push("/pages/player/question/" + data);
        else setErrMsg("سوالی یافت نشد. لطفا مجددا تلاش کنید");
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      });
  };
  return (
    <section className="p-3">
      <div className="w-full">
        <button
          onClick={() => submitRandomQuestion()}
          className="btn btn-active btn-primary lg:w-1/2 w-full text-white"
        >
          {loadingBtn ? (
            <span className="loading loading-dots loading-md"></span>
          ) : (
            "پاسخ به سوال جدید"
          )}
        </button>
        <span className="-text-error">{errMsg}</span>
      </div>

      <SearchTable
        body={items}
        head={head}
        modals={modals}
        title="سوالات پاسخ داده شده شما"
        searchIndexes={searchIndexes}
        search_api={true}
        onSearch={(val) => {
          setSearch(val);
          getQuestions(val, page);
        }}
        changePage={(offset) => {
          setPage(page + offset);
          getQuestions(search, page + offset);
        }}
        loading={loading}
      />
    </section>
  );
}
