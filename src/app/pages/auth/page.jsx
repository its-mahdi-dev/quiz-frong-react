"use client";
import Input from "@/app/components/forms/input";
import Select from "@/app/components/forms/select";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [toggleForm, setToggleForm] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errLoginMsg, setErrLoginMsg] = useState("");
  const [errSignupMsg, setErrSignupMsg] = useState("");
  const router = useRouter();
  const options = [
    { value: "0", label: "بازیکن" },
    { value: "1", label: "طراح" },
  ];

  const [mY, setMy] = useState(0);
  const [mX, setMx] = useState(0);

  const tiltEffectSettings = {
    max: 12,
    perspective: 2500,
    scale: 1.1,
    speed: 1000,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  };
  let card;
  // document.addEventListener('mouseover', handleMouseLeave);
  function handleMouseEnter(event) {
    setTransition(event);
  }

  function handleMouseMove(event) {
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const centerX = card.offsetLeft + cardWidth / 2;
    const centerY = card.offsetTop + cardHeight / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    const rotateXUncapped =
      (+1 * tiltEffectSettings.max * mouseY) / (cardHeight / 2);
    const rotateYUncapped =
      (-1 * tiltEffectSettings.max * mouseX) / (cardWidth / 2);
    const rotateX =
      rotateXUncapped < -tiltEffectSettings.max
        ? -tiltEffectSettings.max
        : rotateXUncapped > tiltEffectSettings.max
        ? tiltEffectSettings.max
        : rotateXUncapped;
    const rotateY =
      rotateYUncapped < -tiltEffectSettings.max
        ? -tiltEffectSettings.max
        : rotateYUncapped > tiltEffectSettings.max
        ? tiltEffectSettings.max
        : rotateYUncapped;

    card.style.transform = `perspective(${tiltEffectSettings.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)
                          scale3d(${tiltEffectSettings.scale}, ${tiltEffectSettings.scale}, ${tiltEffectSettings.scale})`;
  }

  function handleMouseLeave(event) {
    console.log(event.currentTarget);
    event.currentTarget.style.transform = `perspective(${tiltEffectSettings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    setTransition(event);
  }

  function setTransition(event) {
    clearTimeout(card.transitionTimeoutId);
    card.style.transition = `transform ${tiltEffectSettings.speed}ms ${tiltEffectSettings.easing}`;
    card.transitionTimeoutId = setTimeout(() => {
      card.style.transition = "";
    }, tiltEffectSettings.speed);
  }

  useEffect(() => {
    document.addEventListener("mousemove", function (event) {
      setMx(event.clientX - 200);
      setMy(event.clientY - 200);
    });
    card = document.getElementById("myCard");
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseMove);
  }, []);
  const login = async (e) => {
    e.preventDefault();
    if (errLoginMsg.length > 0) return;
    setLoading(true);
    await axios
      .post("http://localhost:8080/api/auth/login", { phone, password })
      .then(function (response) {
        let token = response.data.token;
        let type = response.data.type;
        Cookies.set("token", token);
        if (type == "player") router.push("/pages/player/question");
        if (type == "designer") router.push("/pages/designer/question");
      })
      .catch(function (err) {
        console.log(err);
      })
  };
  const signup = async (e) => {
    e.preventDefault();
    if (errSignupMsg.length > 0) return;
    setLoading(true);
    let data = {
      first_name: name,
      last_name: lastName,
      phone,
      email,
      password,
      type,
    };
    await axios
      .post(process.env.BASE_URL + "auth/signup", data)
      .then(function (response) {
        let token = response.data.token;
        Cookies.set("token", token);
        document.getElementById("register-form").submit();
      })
      .catch(function (err) {
        console.log(err);
      })
  };
  return (
    <div>
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl mouseover"
        style={{
          left:mX + "px",
          top: mY + "px"
        }}
      ></div>
      <div className="pt-32">
        <div
          className="card lg:w-8/12 w-10/12 mx-auto bg-gray-700 bg-opacity-30 backdrop-blur-xl p-4 rounded-xl"
          id="myCard"
        >
          <h1 className="font-fedra text-center text-3xl">ورود</h1>
          <div className="text-center mt-5 flex justify-center items-center">
            ثبت نام
            <input
              type="checkbox"
              onChange={() => setToggleForm(!toggleForm)}
              className="toggle border-blue-500 bg-blue-500 [--tglbg:yellow] hover:bg-blue-700 mx-3"
            />
            ورود
          </div>
          {!toggleForm ? (
            <form
              action="/pages/player/questions"
              className="mt-8 check-form"
              id="login-form"
              onSubmit={login}
            >
              <div
                className="flex flex-wrap transition-all duration-150"
                id="login-container"
              >
                <Input
                  onChange={(val, err) => {
                    setPhone(val);
                    setErrLoginMsg(err);
                  }}
                  value={phone}
                  label="شماره تلفن"
                  min={11}
                  max={11}
                  validations={["number"]}
                />
                <Input
                  onChange={(val, err) => {
                    setPassword(val);
                    setErrLoginMsg(err);
                  }}
                  value={password}
                  label="گذرواژه"
                />

                <span className="-text-error text-xs error-message mt-4">
                  {errLoginMsg}
                </span>
                <button
                  className="w-full rounded-lg bg-gradient-to-t from-purple-700 to-purple-500 h-12 flex items-center justify-center mt-2"
                  type="submit"
                >
                  {!loading ? (
                    "ورود"
                  ) : (
                    <span className="loading loading-dots loading-md"></span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form
              action="/pages/designer/category"
              className="mt-8 check-form"
              id="register-form"
              onSubmit={signup}
            >
              <div
                className="flex flex-wrap transition-all duration-150"
                id="register-container"
              >
                <Input
                  onChange={(val, err) => {
                    setName(val);
                    setErrSignupMsg(err);
                  }}
                  value={name}
                  label="نام"
                  validations={["persian", "required"]}
                />
                <Input
                  onChange={(val, err) => {
                    setLastName(val);
                    setErrSignupMsg(err);
                  }}
                  value={lastName}
                  label="نام خانوادگی"
                  validations={["persian", "required"]}
                />
                <Input
                  onChange={(val, err) => {
                    setPhone(val);
                    setErrSignupMsg(err);
                  }}
                  value={phone}
                  label="شماره تلفن"
                  max={11}
                  min={11}
                  validations={["number", "required"]}
                />
                <Input
                  onChange={(val, err) => {
                    setEmail(val);
                    setErrSignupMsg(err);
                  }}
                  value={email}
                  label="ایمیل"
                  validations={["email"]}
                />
                <Input
                  onChange={(val, err) => {
                    setPassword(val);
                    setErrSignupMsg(err);
                  }}
                  value={password}
                  label="گذرواژه"
                  validations={["required"]}
                  min={8}
                />
                <Select
                  onChange={setType}
                  value={type}
                  label="نوع بازیکن"
                  options={options}
                />
                <span className="mb-1 -text-error text-xs error-message mt-4">
                  {errSignupMsg}
                </span>
                <button
                  className="w-full rounded-lg bg-gradient-to-t from-purple-700 to-purple-500 h-12 flex items-center justify-center mt-2"
                  type="submit"
                >
                  {!loading ? (
                    "ثبت نام"
                  ) : (
                    <span className="loading loading-dots loading-md"></span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
