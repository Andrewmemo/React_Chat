import React from "react";

import ScrollToBottom from "react-scroll-to-bottom";

import Message from "./Message/Message";
import FileSave from "./../FileSave/FileSave";

import "./Messages.css";

const Messages = ({ messages, name }) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        {message.type === "text" ? (
          <Message message={message} name={name} />
        ) : (
          <FileSave message={message} name={name} />
        )}
      </div>
    ))}
  </ScrollToBottom>
);

export default Messages;
