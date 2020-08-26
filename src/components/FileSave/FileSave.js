import React from "react";

import "./FileSave.css";

const FileSave = ({ message: { text, user }, name }) => {
  const fileName = (fileName) => {
    let temp = fileName.split(".");

    let tempFileName = fileName.slice(
      0,
      fileName.length - temp[temp.length - 1].length - 1
    );

    let newFileName;

    if (tempFileName.length > 12) {
      temp = fileName.split(".");
      newFileName =
        tempFileName.slice(0, 12) + "..." + " ." + temp[temp.length - 1];
    } else {
      newFileName = fileName;
    }

    return newFileName;
  };

  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        <a href={`https://chat-mix-test-server.herokuapp.com/upload/${text}`}>
          <nobr>
            <p className="messageText colorWhite">
              {" "}
              <i className="fa fa-file fileIcon"></i>
              {fileName(text.slice(14))}
            </p>
          </nobr>
        </a>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <a href={`https://chat-mix-test-server.herokuapp.com/upload/${text}`}>
          <nobr>
            <p className="messageText colorDark">
              {" "}
              <i className="fa fa-file fileIcon"></i>
              {fileName(text.slice(14))}
            </p>
          </nobr>
        </a>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );
};

export default FileSave;
