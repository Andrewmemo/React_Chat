import React from "react";

import "./FileSpawn.css";

const FileSpawn = ({ selectedFile, setSelectedFile }) => {
  const filesArray = [...selectedFile];

  const onMarkClick = (event) => {
    let updatedSelectedFiles = [...selectedFile];

    updatedSelectedFiles = updatedSelectedFiles.filter(
      (f) => f.lastModified != event.target.id
    );

    setSelectedFile(updatedSelectedFiles);
  };
  return (
    <div>
      <div className="outerFileContainer">
        <div className="innerFileContainer">
          {filesArray.map((f) => (
            <div key={f.lastModified} className="fileName">
              <p key={f.lastModified + new Date()}>{f.name}</p>
              <i
                id={f.lastModified}
                onClick={onMarkClick}
                style={{ cursor: "pointer" }}
                className="fa fa-times fileMark"
              ></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileSpawn;
