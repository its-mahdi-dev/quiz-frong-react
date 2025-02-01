"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SingleQuestion() {
  const params = useParams();
  let id = params.id;
  const [token, setToken] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [body, setBody] = useState("");
  const [answers, setAnswers] = useState("");
  const [duration, setDuration] = useState("");
  const [answer, setAnswer] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [days, setdays] = useState();
  const [hours, sethours] = useState();
  const [minutes, setminutes] = useState();
  const [seconds, setseconds] = useState();
  const [isFollow, setIsFollow] = useState(false);
  const router = useRouter();

  const getQuestion = async () => {
    if (!token) return;
    await axios
      .get("http://localhost:8081/api/player/questions/" + id, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data;
        setBody(data.body);
        setAnswers(data.answers);
        setDuration(new Date(new Date().getTime() + data.duration * 1000));
        setUserId(data.user.id);
        setLoading(false);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      });
  };

  const getFollowStatus = async () => {
    if (!token) return;
    await axios
      .get("http://localhost:8081/api/follow/" + id, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data;
        if (data.message == "true") setIsFollow(true);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      });
  };
  useEffect(() => {
    setToken(Cookies.get("token"));
    getFollowStatus();
    getQuestion();
  }, [token]);

  const followUnfollow = async () =>{
    setLoadingFollow(true);
    if(isFollow){
      await axios
      .delete("http://localhost:8081/api/follow/" + id, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data;
        setIsFollow(!isFollow);
        setLoadingFollow(false);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      });
    }else{
      await axios
      .post("http://localhost:8081/api/follow/" + id, {} ,{
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        let data = response.data;
        setIsFollow(!isFollow);
        setLoadingFollow(false);
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        console.log(err);
      });
    }
  }
  var x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = duration - now;

    // Time calculations for days, hours, minutes and seconds
    setdays(Math.floor(distance / (1000 * 60 * 60 * 24)));
    sethours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    setminutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    setseconds(Math.floor((distance % (1000 * 60)) / 1000));
    if (distance < 0) {
      clearInterval(x);
    }
  }, 1000);

  const submitQuestion = async () => {
    setErrMsg("");
    if (!token) return;
    if (!answer) {
      setErrMsg("لطفا یک گزینه را انتخاب کنید");
      return;
    }
    setLoadingBtn(true);
    const data = Number(answer) ;
    await axios
      .post("http://localhost:8081/api/player/questions/" + id + "?answer_id=" + data, {}, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        router.push("/pages/player/question");
      })
      .catch(function (err) {
        if (err.status == 401) router.push("/pages/auth");
        setErrMsg(err.response.data.message);
      })
      .finally(function () {
        setLoadingBtn(false);
      });
  };

  return (
    <section className="p-3 w-full">
      {loading ? (
        <div className="text-center mt-8">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        <div className="w-full mx-auto p-4 mt-5 bg-gray-38 bg-opacity-35 backdrop-blur-2xl shadow-lg rounded-xl">
          <h2 className="font-fedra mb-2 text-xl">سوال</h2>
          <div id="countdown" className="lg:w-1/2 w-full lg:mt-0 mt-3 mr-auto">
            <div className="flex justify-between items-center">
              <div className="flex flex-col justify-center bg-gradient-to-b w-1/5 from-purple-800 to-purple-400 p-2 rounded-lg text-center">
                <span>{days}</span>
                <span>روز</span>
              </div>
              <span>:</span>
              <div className="flex flex-col justify-center bg-gradient-to-b w-1/5 from-purple-800 to-purple-400 p-2 rounded-lg text-center">
                <span>{hours}</span>
                <span>ساعت</span>
              </div>
              <span>:</span>
              <div className="flex flex-col justify-center bg-gradient-to-b w-1/5 from-purple-800 to-purple-400 p-2 rounded-lg text-center">
                <span>{minutes}</span>
                <span>دقیقه</span>
              </div>
              <span>:</span>
              <div className="flex flex-col justify-center bg-gradient-to-b w-1/5 from-purple-800 to-purple-400 p-2 rounded-lg text-center">
                <span>{seconds}</span>
                <span>ثانیه</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <span className="text-xl font-bold">متن سوال</span>
            <p className="mt-2">{body}</p>
          </div>
          <div className="mt-8">
            <span className="text-xl font-bold">گزینه ها</span>
            <div action="create" className="flex flex-col mt-3">
              {answers.map((value, index) => (
                <div className="flex items-center mb-2" key={index}>
                  <input
                    type="radio"
                    name="radio-5"
                    id={`answer-${value.id}`}
                    value={value.id}
                    className="radio radio-success ml-2"
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <label htmlFor={`answer-${value.id}`}>{value.body}</label>
                </div>
              ))}

              <span className="-text-error form-error mt-4 block text-center w-full">
                {errMsg}
              </span>
              <div className="w-full">
                <div className="lg:w-1/2 w-full lg:pe-1 mt-8">
                  <button
                    className="btn btn-active btn-accent w-full submit-btn"
                    onClick={() => submitQuestion()}
                  >
                    {loadingBtn ? (
                      <span className="loading loading-dots loading-md"></span>
                    ) : (
                      "ثبت پاسخ"
                    )}
                  </button>
                </div>
                <div className="lg:w-1/2 w-full lg:pe-1 mt-8">
                  <button
                    className={`btn btn-accent w-full submit-btn ${
                      !isFollow ? "bg-indigo-400" : "bg-amber-400"
                    }`}
                    onClick={() => followUnfollow()}
                  >
                    {loadingFollow ? (
                      <span className="loading loading-dots loading-md"></span>
                    ) : !isFollow ? (
                      "دنبال کردن طراح سوال"
                    ) : (
                      "لغو دنبال کردن"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
