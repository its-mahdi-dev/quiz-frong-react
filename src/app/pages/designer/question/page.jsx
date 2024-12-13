"use client";
import React, { useState } from 'react'

export default function Question() {
    const [countClick, setCountClick] = useState(0);

    // Function to change the value of state on 
    // click of button
    const countClickHandler = () => {
        setCountClick(countClick + 1);
    };

    return (
        <center>
            <h1>GeeksforGeeks</h1>
            <h2> State value: {countClick} </h2>
            <button onClick={countClickHandler}>
                Click Me
            </button>
        </center>
    );
}
