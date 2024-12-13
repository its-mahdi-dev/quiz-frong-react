"use client";
import Input from "@/app/components/forms/input";
import Select from "@/app/components/forms/select";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

export default function Auth() {
  const [toggleForm, setToggleForm] = useState(false);
  const [name,setName] = useState("");
  const [lastName,setLastName] = useState("");
  const [phone,setPhone] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [type,setType] = useState("");
  const [loading,setLoading] = useState(false);
  const options = [
    { value: "0", label: "بازیکن" },
    { value: "1", label: "طراح" },
  ];
  const login = async (e) =>{
    setLoading(true);
    e.preventDefault();
      await axios.post(process.env.BASE_URL + "auth/login" , {phone,password}
      ).then(function(response){
        let token = response.data.token;
        Cookies.set('token',token)
        document.getElementById('login-form').submit();
      }).catch(function(err){
        console.log(err)
      }).finally(function () {
        setLoading(false);
      });
  }
  const signup = async (e) =>{
    setLoading(true);
    e.preventDefault();
    let data = {
      first_name:name, last_name:lastName, phone, email, password, type
    }
      await axios.post(process.env.BASE_URL + "auth/signup" , data
      ).then(function(response){
        let token = response.data.token;
        Cookies.set('token',token)
        document.getElementById('register-form').submit();
      }).catch(function(err){
        console.log(err)
      }).finally(function () {
        setLoading(false);
      });
  }
  return (
    <div>
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl mouseover"
        id="backdrop"
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
              onChange={()=>setToggleForm(!toggleForm)}
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
                <Input onChange={setPhone} value={phone} label="شماره تلفن"/>
                <Input onChange={setPassword} value={password} label="گذرواژه" />
                <button
                  className="w-full rounded-lg bg-gradient-to-t from-purple-700 to-purple-500 h-12 mt-4 flex items-center justify-center"
                  type="submit"
                >
                {!loading ? "ورود" : (
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
                <Input onChange={setName} value={name} label="نام"/>
                <Input onChange={setLastName} value={lastName} label="نام خانوادگی" />
                <Input onChange={setPhone} value={phone} label="شماره تلفن"/>
                <Input onChange={setEmail} value={email} label="ایمیل"/>
                <Input onChange={setPassword} value={password} label="گذرواژه" />
                <Select onChange={setType} value={type} label="نوع بازیکن" options={options}/>
                <button
                  className="w-full rounded-lg bg-gradient-to-t from-purple-700 to-purple-500 h-12 mt-4 flex items-center justify-center"
                  type="submit"
                >
                  {!loading ? "ثبت نام" : (
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
