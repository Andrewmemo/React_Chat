import React, { Component } from "react";
import axios from "axios";

import "./Input.css";

class Input extends Component {
  onChangeHandler = (event) => {
    this.props.setSelectedFile(event.target.files);
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
        <button
          style={{ cursor: "pointer" }}
          className="sendButton"
          onClick={async (e) => {
            this.props.sendMessage(e);
            if (this.props.selectedFile) {
              const data = new FormData();
              for (let i = 0; i < this.props.selectedFile.length; i++) {
                const myNewFile = new File(
                  [this.props.selectedFile[i]],
                  Date.now() + "-" + this.props.selectedFile[i].name,
                  { type: this.props.selectedFile[i].type }
                );
                data.append("file", myNewFile);
                this.props.setMessageType("file");
                this.props.setFileName(data.get("file").name);

                await axios.post(
                  "https://chat-mix-server-test.herokuapp.com/upload",
                  data,
                  {}
                );
                this.props.sendFile(e);
                data.delete("file");
                this.props.setMessageType("text");
              }
              let inputs = document.querySelector(".inputFile");
              inputs.value = "";
              if (inputs.value) {
                inputs.type = "text";
                inputs.type = "file";
              }
              this.props.setSelectedFile(null);
            } else {
              this.props.setMessageType("text");
            }
          }}
        >
          Send
        </button>
      </form>
    );
  }
}

export default Input;
