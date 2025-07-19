import { useEffect, useState } from 'react';
import './aiMessage.scss';

function AiMessage({ data, onComplete }) {
  const [text, setText] = useState('');
  const speed = 10;

  useEffect(() => {
    setText('');
    const tempTextArr = data.split('');
    const timeouts = [];

    tempTextArr.forEach((char, index) => {
      const timeout = setTimeout(() => {
        setText((prev) => {
          const newText = `${prev}${char}`;
          onComplete();
          return newText;
        });
      }, speed * index);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [data, speed, onComplete]);

  // Function to render text with bold sections and links
  const renderTextWithBoldAndLinks = (text) => {
    const lines = text.split('\n').map((line, lineIndex) => {
      // Updated regex to match bold (**...**), italic (*...* or _..._), and links
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|_.*?_|\[.*?\]\(.*?\))/g);

      return parts.map((part, partIndex) => {
        // Bold
        if (part.startsWith('**') && part.endsWith('**')) {
          const innerText = part.slice(2, -2);
          return (
            <strong key={`${lineIndex}-${partIndex}`}>
              {renderTextWithBoldAndLinks(innerText)}
            </strong>
          );
        }

        // Italic (* or _)
        if (
          (part.startsWith('*') && part.endsWith('*') && part.length > 1) ||
          (part.startsWith('_') && part.endsWith('_') && part.length > 1)
        ) {
          const innerText = part.slice(1, -1);
          return (
            <em key={`${lineIndex}-${partIndex}`}>
              {renderTextWithBoldAndLinks(innerText)}
            </em>
          );
        }

        // Link
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const linkText = linkMatch[1];
          const linkUrl = linkMatch[2];
          return (
            <a
              className="ai-link"
              key={`${lineIndex}-${partIndex}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkText}
            </a>
          );
        }

        // Plain text
        return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
      });
    });

    return <>{lines}</>;
  };

  // Split text into lines and render each line with bold formatting
  const textWithLineBreaks = text.split('\n').map((line, index) => (
    <p className="p-ai" key={index}>
      {renderTextWithBoldAndLinks(line)}
    </p>
  ));

  return <div className="message-bubble from-ai">{textWithLineBreaks}</div>;
}

export default AiMessage;
