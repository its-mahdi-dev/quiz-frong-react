"use client";
import Button from "@/app/components/button";
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
    "دنبال کردن",
  ];
  const searchIndexes = [0];
  const followUnFollw = async (user_id, status) => {
    
    try {
      if (status) {
        // Unfollow
        await axios.delete(`http://localhost:8080/api/follow/${user_id}`, {
          headers: { authorization: `Bearer ${token}` },
        });
      } else {
        // Follow
        await axios.post(`http://localhost:8080/api/follow/${user_id}`, {}, {
          headers: { authorization: `Bearer ${token}` },
        });
      }

    } catch (err) {
      if (err.response && err.response.status === 401) {
        router.push("/pages/auth");
      }
      console.error(err);
    }
  };

  const getScores = async (val = "", next_page = 1) => {
    if (!token) return;
    if ((next_page > total_page && total_page !== 0) || next_page === 0) return;

    setLoading(true);
    
    try {
      const response = await axios.get(
        `http://localhost:8080/api/player/scores?search=${val}&page=${next_page}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      const data = response.data.data;
      setPage(response.data.meta.currentPage);
      setTotal_page(response.data.meta.totalPages);

      // Map over data to create rows with Button component
      const result = data.map((item) => [
        item.firstName + " " + item.lastName,
        item.score,
        item.correctAnswers,
        item.wrongAnswers,
        <Button
          key={item.id}
          label={item.isFollowing ? 'لغو دنبال کردن' : 'دنبال کردن'}
          onClick={() => followUnFollw(item.id, item.isFollowing)}
          loading={false}
        />,
      ]);

      setItems(result);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        router.push("/pages/auth");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
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
