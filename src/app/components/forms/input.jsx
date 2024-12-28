import React, { useEffect, useState } from "react";

export default function Input({
  label,
  value,
  onChange,
  type,
  validations,
  max,
  min,
}) {
  const [errMsg, setErrMsg] = useState("");
  const errorsPersian = {
    required: `تکمیل فیلد ${label} الزامیست`,
    persian: `مقدار ${label} را به فارسی وارد کنید`,
    number: "فقط عدد وارد کنید",
    english: `مقدار ${label} را به انگلیسی وارد کنید`,
    email: `ایمیل خود را به درستی وارد کنید`,
    max: `حداکثر مقدار برای فیلد ${label} ${max} می باشد`,
    min: `حداقل مقدار برای فیلد ${label} ${min} می باشد`,
  };
  if ((type = "date")) {
    // jalaliDatepicker = require("/lib/jalali.min.js");
    // jalaliDatepicker.startWatch({
    //   maxDate: "attr",
    //   minDate: 'attr'
    // });
  }
  const persianLetters = /^[\u0600-\u06FF\s]+$/;
  const numbers = /^[\u06F0-\u06F90-9]+$/;
  const englishLetter = /[a-zA-Z]/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const checkValidations = (val) => {
    if (validations) {
      let err = false;
      validations.forEach((validation) => {
        if (validation == "required" && val.length == 0) {
          console.log("errrrs " , errorsPersian["required"] , errorsPersian)
          err= errorsPersian["required"];
        }
        if (validation == "persian") {
          if (!persianLetters.test(val) && val.length > 0)
            err= errorsPersian["persian"];
        } else if (validation == "number") {
          if (!numbers.test(val) && val.length > 0)
            err= errorsPersian["number"];
        } else if (validation == "english") {
          if (!englishLetter.test(val) && val.length > 0)
            err= errorsPersian["english"];
        } else if (validation == "email") {
          if (!emailRegex.test(val) && val.length > 0)
            err= errorsPersian["email"];
        }
      });
      if(err) return err;
    }
    if(max){
      if(val.length > max){
        return errorsPersian["max"];
      }
    }
    if(min){
      if(val.length < min){
        return errorsPersian["min"];
      }
    }
    return "";
  };
  const handleChange = (e) => {
    let err = checkValidations(e.target.value);
    setErrMsg(err);
    onChange(e.target.value, err);
  };
  return (
    <div className={`lg:w-1/2 w-full lg:ps-1 mt-${errMsg.length > 0 ? "6" : "2"} relative check-input`}>
      <span className="mb-1 -text-error text-xs error-message absolute -top-5">
        {errMsg}
      </span>
      <div className="w-full h-12 rounded-lg bg-gray-700 bg-opacity-50 backdrop-blur-2xl p-2 flex items-center justify-between  -border-error">
        <input
          type="text"
          onChange={handleChange}
          className="w-full border-none bg-transparent outline-none text-sm pt-2 ml-auto text-input"
          data-max="5"
          data-validations="required,persian"
          value={value}
          data-jdp
          data-jdp-min-date="today"
          data-jdp-max-date="1405/01/01"
        />
        <label className={value.length > 0 ? "active" : ""}>{label}</label>
        {validations ? (
          <div>
            <i
              className={`fi fi-sr-check-circle -text-success ${
                errMsg ? "hidden" : ""
              } error-icon`}
            ></i>
            <i
              className={`fi fi-sr-exclamation -text-error ${
                errMsg ? "" : "hidden"
              } success-icon`}
            ></i>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
