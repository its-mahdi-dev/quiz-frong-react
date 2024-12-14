import React from "react";

export default function Table({ head, body }) {
  
  return (
    <div className="overflow-x-auto">
      <table
        className="table text-right able-search"
        data-index="0"
        data-input="search"
      >
        <thead>
          <tr>
            {head.map((th, index) => (
              <th key={index}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((tr, index) => (
            <tr className="hover" key={index}>
              {tr.map((td, index2) => (
                <td key={index2}>{td}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
