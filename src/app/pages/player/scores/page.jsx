"use client";
import SearchTable from "@/app/components/searchTable";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState , useEffect } from "react";

export default function Scores() {
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
  const getScores = async () => {
    if (!token) return;
    setLoading(true);
    await axios
      .get("http://localhost:5000/api/player/scores", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data;
        const result = data.map((item) => [item.first_name + " " + item.last_name , item.score , item.correct_answers , item.wrong_answers]);
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
  return <section className="p-3 w-full pt-6">
    {loading  ? (
        <div className="text-center mt-8">
            <span className="loading loading-bars loading-lg"></span>
          </div>
    ) : (
        <SearchTable body={items} head={head} searchIndexes={searchIndexes} title="امتیازات" modals={[]}/>
    )}
  </section>;
}
