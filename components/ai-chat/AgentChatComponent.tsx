import {
  MdClose,
  MdDeleteOutline,
  MdMic,
  MdMicOff,
  MdSupportAgent,
} from 'react-icons/md';
import './agentChatComponent.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAgent } from '../../store/agent-context';
import AiMessage from './message-bubbles/AiMessage';
import UserMessage from './message-bubbles/UserMessage';
import TextArea from '../util-components/TextArea';

function AgentChatComponent() {
  const { messages, userQuery, setUserQuery, handleNewUserQuery, resetChat } =
    useAgent();
  const chatboxRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<{ focus: () => void }>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isTtsActive, setIsTtsActive] = useState(false);
  function handleClick() {
    if (isOpen === false) {
      textAreaRef.current?.focus();
    }
    setIsOpen((prev) => !prev);
  }
  // Scroll automatically for each new message
  const scrollToBottom = useCallback(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, []);

  // KEY LISTENER
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClick();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleEnterPress(e) {
    e.preventDefault();
    if (!userQuery) return;
    await handleNewUserQuery();
  }
  return (
    <>
      {/* BACKGROUND OVERLAY */}
      <div
        className={`chatbox-active-overlay ${isOpen ? 'visible' : 'hide-overlay'}`}
        onClick={handleClick}
      ></div>

      {/* CHAT */}
      <div
        className={`agent-chat ${isOpen ? 'agent-chat-open' : 'agent-chat-closed'}`}
      >
        {/* HEADER */}
        <div className="chat-header" onClick={handleClick}>
          <h3>Infi help chatbot</h3>
          <MdClose />
        </div>

        {/* CONSTROLS */}
        <div className="chat-controls">
          <button
            onClick={() => setIsTtsActive((prev) => !prev)}
            className="chat-controls-button"
            title="Read messages"
          >
            {isTtsActive ? <MdMicOff /> : <MdMic />}
          </button>
          <button
            onClick={resetChat}
            className="chat-controls-button"
            title="Clear chat"
          >
            <MdDeleteOutline />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="chat-messages-container" ref={chatboxRef}>
          {messages.map((message, index) =>
            message.author === 'AI' ? (
              <AiMessage
                tts={isTtsActive}
                key={`ai-message-${index}`}
                data={message.content}
                onComplete={scrollToBottom}
              />
            ) : (
              <UserMessage
                key={`user-message-${index}`}
                data={message.content}
              />
            ),
          )}
          {messages.length === 0 && (
            <>
              <img
                src="/img/no_messages.png"
                className="chat-no-messages-icon"
                alt="No messages icon"
              />
              <h3 className="no-messages-header">No messages here..</h3>
            </>
          )}
        </div>

        {/* INPUT */}
        <form
          className="chat-input-container"
          onSubmit={async (e) => handleEnterPress(e)}
        >
          <TextArea
            ref={textAreaRef}
            customInputClass="chat-input-text-area-styles"
            showClearBtn={true}
            backgroundColor="var(--primaryLight)"
            label="Message"
            inputText={userQuery}
            setInputText={(data) => setUserQuery(data as string)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                await handleEnterPress(e);
              }
            }}
          />
        </form>
      </div>

      {/* BUTTON */}
      <div className="agent-chat-button-container">
        <button className="agent-chat-button" onClick={handleClick}>
          <MdSupportAgent className="agent-chat-icon" />
        </button>
      </div>
    </>
  );
}

export default AgentChatComponent;
