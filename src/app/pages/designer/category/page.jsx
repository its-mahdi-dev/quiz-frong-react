"use client";
import Input from "@/app/components/forms/input";
import SearchTable from "@/app/components/searchTable";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
export default function Category() {
  const [page, setPage] = useState(1);
  const [total_page, setTotal_page] = useState(1);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [token, setToken] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  let head = ["نام دسته بندی"];
  const searchIndexes = [0];
  const getCategories = async (val = "", next_page = 1) => {
    if (!token) return;
    if ((next_page > total_page && total_page != 0) || next_page == 0) return;
    setLoading(true);
    await axios
      .get(
        "http://localhost:5000/api/designer/categories?limit=5&search=" +
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
        const result = data.map((item) => [item.name]);
        setItems(result);
        setLoading(false);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      })
      .finally(function () {});
  };
  useEffect(() => {
    setToken(Cookies.get("token"));
    getCategories();
  }, [token]);
  const addCategory = async () => {
    if (!token) return;
    if (errMsg.length) return;
    setLoading(true);
    await axios
      .post(
        "http://localhost:5000/api/designer/categories",
        { name },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then(function (response) {
        let data = [[name], ...items];
        setItems(data);
        setLoading(false);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      })
      .finally(function () {});
  };

  return (
    <div className="p-3">
      <div className="p-4 bg-gray-38 bg-opacity-35 backdrop-blur-2xl shadow-lg rounded-xl">
        <h2 className="font-fedra mb-2 text-xl">ایجاد دسته بندی</h2>
        <div action="create" className="flex flex-wrap">
          <Input
            value={name}
            onChange={(val, err) => {
              setName(val);
              setErrMsg(err);
            }}
            label="نام دسته بندی"
            validations={["required"]}
          />
          <div className="lg:w-1/2 w-full lg:pe-1 mt-2 lg:pr-3">
            <button
              className="btn btn-active btn-accent lg:w-1/2 w-full"
              onClick={() => {
                addCategory();
              }}
            >
              افزودن
            </button>
          </div>
        </div>
      </div>

      <SearchTable
        head={head}
        body={items}
        title="مدیریت دسته بندی"
        searchIndexes={searchIndexes}
        modals={[]}
        search_api={true}
        onSearch={(val) => {
          setSearch(val);
          getCategories(val, page);
        }}
        changePage={(offset) => {
          setPage(page + offset);
          getCategories(search, page + offset);
        }}
        loading={loading}
      />
    </div>
  );
}
