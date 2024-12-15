import React from "react";

export default function QuestionAnswer({ body, answers , correct_answer_id , index }) {
  return (
    <div>
      <input type="checkbox" id={`my_modal_${index}`} class="modal-toggle" />
      <div class="modal overflow-y-visible" role="dialog">
        <div class="modal-box">
          <h3 class="text-lg font-bold">متن سوال</h3>
          <p>{body}</p>
          <h3 class="text-lg font-bold mt-6">گزینه ها</h3>
          <div class="modal-action">
            <label
              htmlFor={`my_modal_${index}`}
              class="btn btn-sm btn-circle btn-ghost absolute left-4 top-5"
            >
              <i class="fi fi-rr-circle-xmark text-lg"></i>
            </label>
          </div>
          {getAnswers(answers , correct_answer_id)}
        </div>
        <label class="modal-backdrop" htmlFor={`my_modal_${index}`}>
          بستن
        </label>
      </div>
    </div>
  );
}

function getAnswers(answers , correct_answer_id) {
  return (
    <div class="py-2">
    {answers.map((answer , index) => (
        <div className="flex items-center mb-2" key={index}>
        <i className={`fi fi-sr-times-hexagon -text-${answer.id == correct_answer_id ? 'success' : 'error'} ml-2`}></i>
        <span>{answer.body}</span>
      </div>
    ))}
      
    </div>
  );
}
