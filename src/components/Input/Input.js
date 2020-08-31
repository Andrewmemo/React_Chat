import React, { Component } from "react";
import axios from "axios";

import "./Input.css";

var fileInLoadKey = false;
let audio = new Audio("public/audio.mp3");

class Input extends Component {
  onChangeHandler = (event) => {
    if (!fileInLoadKey) {
      this.props.setSelectedFile(event.target.files);
    } else {
      alert("Дочекайся завантаження попереднього файлу");
    }
  };
  render() {
    return (
      <form className="form">
        <input
          className="input"
          type="text"
          placeholder="Type a message..."
          value={this.props.message}
          onChange={({ target: { value } }) => this.props.setMessage(value)}
          onKeyPress={(event) =>
            event.key === "Enter" ? this.props.sendMessage(event) : null
          }
        />
        <input
          type="file"
          hidden="hidden"
          className="inputFile"
          onChange={this.onChangeHandler}
        ></input>
        <i
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            const inputFile = document.querySelector(".inputFile");
            inputFile.click();
          }}
          className="fa fa-paperclip"
        ></i>
        <i
          style={{ cursor: "pointer" }}
          className="sendButton"
          onClick={async (e) => {
            this.props.sendMessage(e);
            if (this.props.selectedFile && !fileInLoadKey) {
              const data = new FormData();
              const myNewFile = new File(
                [this.props.selectedFile[0]],
                Date.now() + "-" + this.props.selectedFile[0].name,
                { type: this.props.selectedFile[0].type }
              );
              data.append("file", myNewFile);

              fileInLoadKey = true;
              document.getElementById("cancelFileSelect").style.visibility =
                "hidden";

              document.getElementById(
                "fileLoadingProgressBar"
              ).style.visibility = "visible";
              await axios.post(process.env.REACT_APP_API_URL + "upload", data, {
                onUploadProgress: (ProgressEvent) => {
                  this.props.setLoaded(
                    (ProgressEvent.loaded / ProgressEvent.total) * 100
                  );
                },
              });
              fileInLoadKey = false;
              this.props.setMessageType("file");
              this.props.setFileName(data.get("file").name);
              this.props.sendFile(e);
              data.delete("file");
              this.props.setMessageType("text");
              let inputs = document.querySelector(".inputFile");
              inputs.value = "";
              if (inputs.value) {
                inputs.type = "text";
                inputs.type = "file";
              }
              let audio = document.getElementById("audio");
              audio.load();
              audio.play();
              this.props.setSelectedFile(null);
              this.props.setLoaded(0);
            } else {
              this.props.setMessageType("text");
            }
          }}
          className="far fa-paper-plane"
        ></i>
      </form>
    );
  }
}

export default Input;
