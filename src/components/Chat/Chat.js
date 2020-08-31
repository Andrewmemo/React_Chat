import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import FileSpawn from "../FileSpawn/FileSpawn";

import "./Chat.css";

let socket;

const Chat = ({ location }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loaded, setLoaded] = useState(0);
  const [messageType, setMessageType] = useState("text");
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [key, setKey] = useState("");
  const [m, setM] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const ENDPOINT = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const { name, room, key, m } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);
    if (m) {
      setM(m);
    }

    socket.emit("join", { name, room, m }, (error) => {
      if (error) {
        alert(error);
      }
    });

    socket.on("display-chat", (messages) => {
      console.log("display-chat");
      setMessages([]);
      for (let i = 0; i < messages.length; i++) {
        let { name, text, messageType } = messages[i];
        setMessages((messages) => [
          ...messages,
          {
            user: name,
            text: text,
            type: messageType,
          },
        ]);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("file", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", { message, messageType }, () => {
        setMessage("");
      });

      let audio = document.getElementById("audio");
      audio.play();
    }
  };

  const sendFile = (event) => {
    event.persist();

    if (fileName) {
      socket.emit("sendFile", { fileName, messageType }, () => {
        setFileName("");
      });
    }
  };
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />

        {selectedFile && (
          <React.Fragment>
            <FileSpawn
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              loaded={loaded}
            />
          </React.Fragment>
        )}
        <Input
          message={message}
          fileName={fileName}
          setFileName={setFileName}
          sendFile={sendFile}
          setMessage={setMessage}
          sendMessage={sendMessage}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          loaded={loaded}
          setLoaded={setLoaded}
          messageType={messageType}
          setMessageType={setMessageType}
        />
      </div>
      <TextContainer users={users} />
      <audio id="audio" src="https://fikustest.000webhostapp.com/audio.mp3">
        Your browser does not support the <code>audio</code> element.
      </audio>
    </div>
  );
};

export default Chat;
