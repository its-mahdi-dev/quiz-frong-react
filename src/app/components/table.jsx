import React from "react";

export default function Table({ head, body ,modals}) {
  function getModal(index) {
    return modals[index];
  }
  return (
    <div className="overflow-x-auto">
      <input type="hidden" className="modal-toggle"/>
      <table
        className="table text-right able-search"
        data-index="0"
        data-input="search"
      >
        <thead>
          <tr>
          <th>ردیف</th>
            {head.map((th, index) => (
              <th key={index}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((tr, index) => (
            <tr className="hover" key={index}>
            <td>{index + 1}</td>
              {tr.map((td, index2) => (
                <td key={index2}>{td}</td>
              ))}
              <td>
                    <label
                      htmlFor={`my_modal_${index}`}
                      className="cursor-pointer text-accent"
                    >
                      مشاهده
                    </label>
                  </td>
                  <td>{modals[index]}</td>
                  
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
