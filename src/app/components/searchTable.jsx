"use client";
import React, { useState , useEffect } from "react";
import Input from "./forms/input";
import Table from "./table";
import { Mr_Dafoe } from "next/font/google";

export default function SearchTable({ head, body, searchIndexes, title , modals}) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(body);
  const [modalItems, setModalItems] = useState(modals);
  let searchNames = "جستجو بر اساس ";
  searchIndexes.forEach((i) => {
    searchNames += head[i] + " , ";
  });
  useEffect(() => {
    setItems(body);
    setModalItems(modals)
  }, [body , modals]);
  const doSearch = (value) =>{
    setSearch(value);
    setItems([]);
    let newItems = [];
    body.forEach((item) =>{
      for(let i =0; i< searchIndexes.length; i++){
        if(item[searchIndexes[i]].includes(value)){
          newItems.push(item);
          break;
        }
      }
    }) 
    setItems(newItems);
  }
  return (
    <div className="p-4 mt-5 bg-gray-38 bg-opacity-35 backdrop-blur-2xl shadow-lg rounded-xl">
      <h2 className="font-fedra mb-2 text-xl">{title}</h2>
      <Input value={search} onChange={doSearch} label={searchNames} />
      <Table head={head} body={items} modals={modalItems} />
    </div>
  );
}
