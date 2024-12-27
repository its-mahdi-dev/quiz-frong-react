"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { redirect, usePathname } from "next/navigation";

export default function Layout({ children }) {
  const [menu, setMenu] = useState(false);

  const path = usePathname();

  function getRandomPurple() {
    const purpleShades = [
      "#9b5de5",
      "#f15bb5",
      "#7400b8",
      "#6930c3",
      "#4a4e69",
      "#c77dff",
    ];
    return purpleShades[Math.floor(Math.random() * purpleShades.length)];
  }

  function createHalfCircle(position, side, isCenter = false) {
    const circle = document.createElement("div");
    const size = window.innerWidth > 992 ? 300 : 200;
    const posY = position;

    circle.classList.add("half-circle");
    circle.style.width = `${size}px`;
    circle.style.height = `${size / 2}px`;
    circle.style.top = `${posY}px`;

    if (isCenter) {
      circle.style.left = "50%";
      circle.style.transform = "translateX(-50%)";
    } else if (side === "left") {
      circle.style.left = `0`;
    } else {
      circle.style.right = `0`;
    }

    circle.style.background = `linear-gradient(135deg, ${getRandomPurple()}, ${getRandomPurple()})`;
    document.body.appendChild(circle);
  }

  function generateHalfCirclesInOrder() {
    const totalCircles = Math.floor(window.innerHeight / 200);
    let currentY = 0;
    let isLeft = true;

    for (let i = 0; i < totalCircles; i++) {
      const side = isLeft ? "left" : "right"; 
      createHalfCircle(currentY, side);
      currentY += 200;
      isLeft = !isLeft; 
    }
  }

  function generateCenterCircles() {
    if (window.innerWidth > 992) {
      const totalCircles = Math.floor(window.innerHeight / 400);
      let currentY = 100;

      for (let i = 0; i < totalCircles; i++) {
        createHalfCircle(currentY, null, true);
        currentY += 400;
      }
    }
  }

  useEffect(() => {
    generateHalfCirclesInOrder();
    generateCenterCircles();
  }, []);

  const logout = ()=>{
    Cookies.remove("token");
    redirect("/pages/auth");
  }
  return (
    <div>
      <header>
        <button className="pr-4 pt-5 lg:hidden" onClick={() => setMenu(!menu)}>
          <i className="fi fi-sr-bars-staggered text-2xl"></i>
        </button>
        <div
          id="backdrop-menu"
          onClick={() => setMenu(!menu)}
          className={`fixed top-0 right-0 bg-black bg-opacity-50 w-screen h-screen lg:hidden z-10 ${
            menu ? "" : "hidden"
          }`}
        ></div>
        <nav
          className={`bg-gray-20 bg-opacity-45 backdrop-blur-3xl p-3 lg:w-2/12 w-1/2 h-[90vh] fixed lg:right-0 top-[5%] rounded-l-2xl shadow-lg transition-all duration-300 z-20 ${
            menu ? "right-0" : "right-[-100%]"
          } `}
        >
          <div className="text-center font-fedra text-2xl mt-5">سایت کوییز</div>
          <ul className="menu rounded-box mt-20">
            <li className="mb-3">
              <a href="#">
                <i className="fi fi-rr-home"></i>
                داشبورد
              </a>
            </li>
            <li
              className={`mb-3 ${
                path.includes("category") ? "bg-gray-38 rounded-lg" : ""
              }`}
            >
              <Link href="/pages/designer/category">
                <i className="fi fi-rr-apps"></i>
                دسته بندی‌ها
              </Link>
            </li>
            <li
              className={`mb-3 ${
                path.includes("question") ? "bg-gray-38 rounded-lg" : ""
              }`}
            >
              <Link href="/pages/designer/question">
                <i className="fi fi-rr-question-square"></i>
                سوالات
              </Link>
            </li>
            <li
              className={`mb-3 `}
            >
            <button onClick={logout}>
              <i class="fi fi-rr-sign-out-alt"></i>
                خروج
                </button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="lg:w-10/12 mr-auto pt-6">{children}</main>
    </div>
  );
}
