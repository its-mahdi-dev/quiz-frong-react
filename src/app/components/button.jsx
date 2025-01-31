"use client"
import React, { useEffect, useState } from 'react'

export default function Button({loading , label , onClick}) {
    const [loadingBtn, setLoadingBtn] = useState(loading);
    const [title, setTitle] = useState(label);

    useEffect(()=>{
        setLoadingBtn(loading);
        setTitle(label);
    } , [loading , label]);
  return (
    <div className='w-full'>
    <button
                    className="btn btn-active btn-accent w-full submit-btn"
                    onClick={onClick}
                  >
                    {loadingBtn ? (
                      <span className="loading loading-dots loading-md"></span>
                    ) : (
                      title
                    )}
                  </button>
    </div>
  )
}
