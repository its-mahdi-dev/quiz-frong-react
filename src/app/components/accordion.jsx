import { useState, useRef } from "react";

export default function Accordion({ title, children }) {
  const [isChecked, setIsChecked] = useState(false);
  const accordionBodyRef = useRef(null);
  const arrowRef = useRef(null);

  const handleToggle = () => {
    setIsChecked(!isChecked);

    const accordionBody = accordionBodyRef.current;
    const arrow = arrowRef.current;

    if (!isChecked) {
      arrow.style.transform = "rotate(180deg)";
      accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
    } else {
      arrow.style.transform = "rotate(0deg)";
      accordionBody.style.maxHeight = 0;
    }
  };

  return (
    <div className="bg-gray-38 bg-opacity-35 backdrop-blur-2xl shadow-lg rounded-xl transition-all duration-300 p-3 overflow-hidden">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={handleToggle}
      >
        <span className="p-4 text-xl">{title}</span>
        <div
          className="arrow transition-all duration-300"
          ref={arrowRef}
        >
          <i className="fi fi-rr-angle-down text-white"></i>
        </div>
      </div>
      <div
        ref={accordionBodyRef}
        className="accordion-body transition-all duration-300 max-h-0 overflow-hidden pt-3"
      >
        {children}
      </div>
    </div>
  );
}
