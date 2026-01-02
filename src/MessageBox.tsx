import { useEffect, useRef } from 'react';
import './MessageBox.css';

interface Message {
  id: string;
  date: Date;
  message: string;
}

interface Props {
  messages: Message[];
  currentIndex: number;
  setIndex: (i: number) => void;
}

export default function MessageBox({ messages, currentIndex, setIndex }: Props) {
  const messageRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLHeadingElement>(null);

  // Update displayed message
  useEffect(() => {
    if (!messages[currentIndex]) return;

    const today = new Date();

    if (messages[currentIndex].date > today) {
      if (messageRef.current) messageRef.current.textContent = 'You have to wait for tomorrow';
      if (dateRef.current) dateRef.current.textContent = 'Till Next Time';
      return;
    }

    if (messageRef.current) messageRef.current.textContent = messages[currentIndex].message;
    if (dateRef.current)
      dateRef.current.textContent = messages[currentIndex].date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
  }, [currentIndex, messages]);

  const prevMessage = () => {
    if (currentIndex > 0) setIndex(currentIndex - 1);
  };

  const nextMessage = () => {
    if (currentIndex < messages.length - 1) setIndex(currentIndex + 1);
  };

  return (
    <div className="message-box-container">
      <h3 className='date-header' ref={dateRef}></h3>
      <div className="message-block">
        <div className="message-box">
          <p
            ref={messageRef}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="scrollable-text"
          ></p>
        </div>
        <div className="holdButtons">
          <button
            onTouchStartCapture={(e) => e.stopPropagation()}
            onMouseDownCapture={(e) => e.stopPropagation()}
            onClick={prevMessage}
            disabled={currentIndex <= 0}
            className={currentIndex <= 0 ? 'button-disabled' : 'button-enabled'}
          >
            Past Day
          </button>
          <button
            onTouchStartCapture={(e) => e.stopPropagation()}
            onMouseDownCapture={(e) => e.stopPropagation()}
            onClick={nextMessage}
            disabled={currentIndex >= messages.length - 1}
            className={currentIndex >= messages.length - 1 ? 'button-disabled' : 'button-enabled'}
          >
            Next Day
          </button>
        </div>
      </div>
    </div>
  );
}
