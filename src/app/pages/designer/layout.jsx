"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Layout({children}) {
  const [menu, setMenu] = useState(false);
  return (
    <div>
      <header>
        <button className="pr-4 pt-5 lg:hidden" onClick={() => setMenu(!menu)}>
          <i className="fi fi-sr-bars-staggered text-2xl"></i>
        </button>
        <div
          id="backdrop-menu"
          onClick={() => setMenu(!menu)}
          className={`fixed top-0 right-0 bg-black bg-opacity-50 w-screen h-screen lg:hidden z-10 ${menu ? "" : "hidden"}`}
        ></div>
        <nav className={`bg-gray-20 bg-opacity-45 backdrop-blur-3xl p-3 lg:w-2/12 w-1/2 h-[90vh] fixed lg:right-0 top-[5%] rounded-l-2xl shadow-lg transition-all duration-300 z-20 ${menu ? "right-0" : "right-[-100%]"} `}>
          <div className="text-center font-fedra text-2xl mt-5">سایت کوییز</div>
          <ul className="menu rounded-box mt-20">
            <li className="mb-3">
              <a href="#">
                <i className="fi fi-rr-home"></i>
                داشبورد
              </a>
            </li>
            <li className="mb-3 bg-gray-38 rounded-lg">
              <Link  href="/pages/designer/category">
                <i className="fi fi-rr-apps"></i>
                دسته بندی‌ها
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/pages/designer/question">
                <i className="fi fi-rr-question-square"></i>
                سوالات
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="lg:w-10/12 mr-auto pt-6">
        {children}
      </main>
    </div>
  );
}
