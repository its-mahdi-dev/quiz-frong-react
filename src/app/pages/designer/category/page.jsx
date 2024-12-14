"use client";
import Input from '@/app/components/forms/input';
import SearchTable from '@/app/components/searchTable';
import Table from '@/app/components/table';
import React , {useState} from 'react'

export default function Category() {
    const [name , setName] = useState("");
    let head = ["ردیف" , "نام دسته بندی" , "ایجاد کننده"];
    let body = [
        ["test" , "tesy" , "ydsa"],
        ["sada" , " dadas" , "sda"]
    ]
    const searchIndexes = [1,2];
  return (
    <div className="p-3">
            <div className="p-4 bg-gray-38 bg-opacity-35 backdrop-blur-2xl shadow-lg rounded-xl">
                <h2 className="font-fedra mb-2 text-xl">ایجاد دسته بندی</h2>
                <div action="create" className="flex flex-wrap">
                    <Input value={name} onChange={setName} label="نام دسته بندی"/>
                    <div className="lg:w-1/2 w-full lg:pe-1 mt-2 lg:pr-3">
                        <button className="btn btn-active btn-accent lg:w-1/2 w-full">افزودن</button>
                    </div>
                </div>
            </div>

        <SearchTable head={head} body={body} title="مدیریت دسته بندی" searchIndexes={searchIndexes} />
            
        </div>
  )
}
