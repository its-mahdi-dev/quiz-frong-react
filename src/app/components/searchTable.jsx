"use client";
import React, { useState, useEffect } from "react";
import Input from "./forms/input";
import Table from "./table";
import { Mr_Dafoe } from "next/font/google";

export default function SearchTable({
  head,
  body,
  searchIndexes,
  title,
  loading,
  modals,
  search_api = false,
  onSearch,
  changePage,
}) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(body);
  const [modalItems, setModalItems] = useState(modals);
  let searchNames = "جستجو بر اساس ";
  searchIndexes.forEach((i) => {
    searchNames += head[i] + " , ";
  });
  useEffect(() => {
    setItems(body);
    setModalItems(modals);
  }, [body, modals]);

  const doSearch = async (value) => {
    setSearch(value);
    if (search_api) {
      await onSearch(value);
      return;
    }
    setItems([]);
    let newItems = [];
    body.forEach((item) => {
      for (let i = 0; i < searchIndexes.length; i++) {
        if (item[searchIndexes[i]].includes(value)) {
          newItems.push(item);
          break;
        }
      }
    });
    setItems(newItems);
  };
  return (
    <div className="p-4 mt-5 bg-gray-38 bg-opacity-35 backdrop-blur-2xl shadow-lg rounded-xl">
      <h2 className="font-fedra mb-2 text-xl">{title}</h2>
      <Input value={search} onChange={doSearch} label={searchNames} />
      {loading ? (
        <div className="text-center mt-8">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        <Table head={head} body={items} modals={modalItems} />
      )}
      {search_api ? (
        <div className="join grid grid-cols-2 lg:w-1/3 mx-auto mt-3">
          <button
            className="join-item btn btn-outline"
            onClick={() => changePage(1)}
          >
            بعدی
          </button>
          <button
            className="join-item btn btn-outline disabled-btn"
            onClick={() => changePage(-1)}
          >
            قبلی
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
