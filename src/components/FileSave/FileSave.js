import React from "react";

import "./FileSave.css";

const FileSave = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <a href={`http://localhost:5000/upload/${text}`}>
        <div
          style={{ cursor: "pointer" }}
          className="messageBox backgroundBlue colorWhite"
        >
          <i className="fa fa-file"></i>
          <span clasaname="messageText colorWhite">{text.slice(14)}</span>
        </div>
      </a>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <a href={`http://localhost:5000/upload/${text}`}>
        <div
          style={{ cursor: "pointer" }}
          className="messageBox backgroundLight colorDark"
        >
          <i className="fa fa-file fileIcon"></i>
          <span clasaname="messageText colorDark">{text.slice(14)}</span>
        </div>
      </a>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

export default FileSave;
