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
  const [messageType, setMessageType] = useState("text");
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "https://chat-mix-test-server.herokuapp.com/";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    socket.on("display-chat", (messages) => {
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
          <FileSpawn
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
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
          messageType={messageType}
          setMessageType={setMessageType}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
