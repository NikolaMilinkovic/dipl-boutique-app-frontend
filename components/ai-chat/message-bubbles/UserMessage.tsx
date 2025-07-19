import React from 'react';
import './userMessage.scss';

function UserMessage({ data }) {
  return <div className="message-bubble from-user">{data}</div>;
}

export default UserMessage;
