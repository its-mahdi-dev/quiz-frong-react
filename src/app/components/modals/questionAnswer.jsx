import React from "react";

export default function QuestionAnswer({ body, answers , correctAnswerId , index }) {
  return (
    <div>
      <input type="checkbox" id={`my_modal_${index}`} className="modal-toggle" />
      <div className="modal overflow-y-visible" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">متن سوال</h3>
          <p>{body}</p>
          <h3 className="text-lg font-bold mt-6">گزینه ها</h3>
          <div className="modal-action">
            <label
              htmlFor={`my_modal_${index}`}
              className="btn btn-sm btn-circle btn-ghost absolute left-4 top-5"
            >
              <i className="fi fi-rr-circle-xmark text-lg"></i>
            </label>
          </div>
          {getAnswers(answers , correctAnswerId)}
        </div>
        <label className="modal-backdrop" htmlFor={`my_modal_${index}`}>
          بستن
        </label>
      </div>
    </div>
  );
}

function getAnswers(answers , correctAnswerId) {
  return (
    <div className="py-2">
    {answers.map((answer , index) => (
        <div className="flex items-center mb-2" key={index}>
        <i className={`fi fi-sr-times-hexagon -text-${answer.id == correctAnswerId ? 'success' : 'error'} ml-2`}></i>
        <span>{answer.body}</span>
      </div>
    ))}
      
    </div>
  );
}
