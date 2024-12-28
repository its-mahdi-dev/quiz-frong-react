"use client";
import SearchTable from "@/app/components/searchTable";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function Scores() {
  const [page, setPage] = useState(1);
  const [total_page, setTotal_page] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [token, setToken] = useState("");
  const router = useRouter();
  let head = [
    "نام و نام خانوادگی",
    "امتیاز",
    "تعداد پاسخ های درست",
    "تعداد پاسخ های غلط",
  ];
  const searchIndexes = [0];
  const getScores = async (val = "", next_page = 1) => {
    if (!token) return;
    if ((next_page > total_page && total_page != 0) || next_page == 0) return;
    setLoading(true);
    await axios
      .get(
        "http://localhost:5000/api/player/scores?search=" +
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
        const result = data.map((item) => [
          item.first_name + " " + item.last_name,
          item.score,
          item.correct_answers,
          item.wrong_answers,
        ]);
        setItems(result);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      })
      .finally(function () {
        setLoading(false);
      });
  };
  useEffect(() => {
    setToken(Cookies.get("token"));
    getScores();
  }, [token]);
  return (
    <section className="p-3 w-full pt-6">
      <SearchTable
        body={items}
        head={head}
        searchIndexes={searchIndexes}
        title="امتیازات"
        modals={[]}
        search_api={true}
        onSearch={(val) => {
          setSearch(val);
          getScores(val, page);
        }}
        changePage={(offset) => {
          setPage(page + offset);
          getScores(search, page + offset);
        }}
        loading={loading}
      />
    </section>
  );
}
