import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { useSocket } from './socket-context';
import AgentChatComponent from '../components/ai-chat/AgentChatComponent';
import { useAuth } from './auth-context';
import { useUser } from './user-context';
import { notifyError } from '../components/util-components/Notify';
import { betterErrorLog } from '../util-methods/log-methods';

const AuthorValues = ['AI', 'User', 'Admin'] as const;
type AuthorRole = (typeof AuthorValues)[number];

export type MessageTypes = {
  author: AuthorRole;
  role: 'user' | 'assistant' | 'function' | 'system';
  content: string;
  function_call?: { name: string; arguments: string };
};

interface AgentContextTypes {
  messages: MessageTypes[];
  setMessages: React.Dispatch<React.SetStateAction<MessageTypes[]>>;
  handleNewUserQuery: () => void;
  userQuery: string;
  setUserQuery: React.Dispatch<React.SetStateAction<string>>;
  resetChat: () => void;
}

interface AgentProviderProps {
  children: ReactNode;
}

export const AgentContext = createContext<AgentContextTypes>({
  messages: [],
  userQuery: '',
  setUserQuery: () => {},
  setMessages: () => {},
  handleNewUserQuery: () => {},
  resetChat: () => {},
});

export function AgentContextProvider({ children }: AgentProviderProps) {
  const { user } = useUser();
  const { token } = useAuth();
  const MAX_MESSAGES = 100;
  const { socket } = useSocket();
  const [userQuery, setUserQuery] = useState('');
  const { fetchWithBodyData } = useFetchData();
  const [messages, setMessages] = useState<MessageTypes[]>([
    {
      author: 'AI',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
    },
  ]);

  // Refresh messages / Clear messages / on logout

  function resetChat() {
    setMessages([]);
  }

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) resetChat();
  }, [user]);

  async function handleNewUserQuery() {
    const newMsg = {
      author: user?.role === 'admin' ? 'Admin' : 'User',
      role: 'user',
      content: userQuery,
    } as MessageTypes;
    const thinkingMsg = {
      author: 'AI',
      role: 'assistant',
      content: 'Thinking...',
    } as MessageTypes;
    addMessage(newMsg as MessageTypes);
    addMessage(thinkingMsg as MessageTypes);

    setUserQuery('');

    // Send as authenticated user
    try {
      const updatedMessages = [...messages, newMsg, thinkingMsg];
      const response = await fetchWithBodyData('agent/message', {
        messages: updatedMessages,
        token: token || null,
      });

      if (!response) return;

      const parsed = await response.json();

      if (response.status === 200) {
        replaceThinkingWithResponse(parsed.text);
      } else {
        notifyError(parsed.message);
      }
    } catch (err) {
      betterErrorLog('> Error while communicating with agent', err);
    }
  }

  /**
   * Adds a new message to the messages state, trimming if exceeding max limit.
   * @param newMsg - The message to add
   */
  function addMessage(newMsg: MessageTypes) {
    setMessages((prev) => {
      const updated = [...prev, newMsg];
      return updated.length > MAX_MESSAGES
        ? updated.slice(updated.length - MAX_MESSAGES)
        : updated;
    });
  }

  /**
   * Replaces the 'Thinking...' AI message with the actual response text.
   * @param newText - The AI response text to replace with
   */
  function replaceThinkingWithResponse(newText: string) {
    setMessages((current) =>
      current.map((msg) =>
        msg.author === 'AI' &&
        msg.content === 'Thinking...' &&
        msg.role === 'assistant'
          ? { author: 'AI', role: 'assistant', content: newText }
          : msg,
      ),
    );
  }

  useEffect(() => {
    if (socket) {
      // socket.on('connect', handleConnect);

      return () => {
        // socket.off('connect', handleConnect);
      };
    }
  }, [socket]);

  const value: AgentContextTypes = {
    messages,
    setMessages,
    handleNewUserQuery,
    userQuery,
    setUserQuery,
    resetChat,
  };

  return (
    <AgentContext.Provider value={value}>
      <>
        {children}
        <div
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1000,
          }}
        >
          <AgentChatComponent />
        </div>
      </>
    </AgentContext.Provider>
  );
}

export function useAgent() {
  return useContext(AgentContext);
}
