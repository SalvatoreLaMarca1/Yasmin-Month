import { useState, useEffect } from 'react';
import './App.css';
import MessageBox from './MessageBox';
import { useSwipeable } from 'react-swipeable';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface Message {
  id: string;
  date: Date;
  message: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [offsetX, setOffsetX] = useState(0);
  const [transition, setTransition] = useState('none');
  const SWIPE_THRESHOLD = 100;

  const [opacity, setOpacity] = useState(1)

  // Fetch messages once
  useEffect(() => {
    const fetchMessages = async () => {
      const snapshot = await getDocs(collection(db, '2026'));
    
      const fetched: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          message: data.message,
          date: data.date.toDate(),
        };
      });
    
      // sort by date ascending
      fetched.sort((a, b) => a.date.getTime() - b.date.getTime());
    
      setMessages(fetched);
    
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      let startIndex = 0;
      let smallestDiff = Infinity;
    
      fetched.forEach((msg, index) => {
        const msgDate = new Date(msg.date);
        msgDate.setHours(0, 0, 0, 0);
    
        const diff = today.getTime() - msgDate.getTime();
    
        if (diff >= 0 && diff < smallestDiff) {
          smallestDiff = diff;
          startIndex = index;
        }
      });
    
      setCurrentIndex(startIndex);
    };
    
    fetchMessages();
  }, []);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;
      setTransition('none');
      setOffsetX(e.deltaX);
    },
    onSwiped: (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;

      // Block swipe at edges
      if (e.deltaX < -SWIPE_THRESHOLD && currentIndex >= messages.length-1) {
        setTransition('transform 0.2s ease');
        setOffsetX(0);
        return;
      }
      if (e.deltaX > SWIPE_THRESHOLD && currentIndex <= 0) {
        setTransition('transform 0.2s ease');
        setOffsetX(0);
        return;
      }

      if (e.deltaX < -SWIPE_THRESHOLD) {
        // swipe left -> next
        setTransition('transform 0.3s ease, opacity 0.3s ease');
        setOffsetX(-window.innerWidth);
        setOpacity(0); // fade out

        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
          setTransition('none');
          setOffsetX(0);
          setOpacity(0);                // keep it invisible to slide in
          // animate fade in
          requestAnimationFrame(() => {
            setTransition('transform 0.3s ease, opacity 0.3s ease');
            setOffsetX(0);
            setOpacity(1);
          });
        }, 100);
      } else if (e.deltaX > SWIPE_THRESHOLD) {
        // swipe right -> previous
        setTransition('transform 0.3s ease, opacity 0.3s ease');
        setOffsetX(window.innerWidth);
        setOpacity(0);

        setTimeout(() => {
          setCurrentIndex((i) => i - 1);
          setTransition('none');
          setOffsetX(0);
          setOpacity(0);                // keep it invisible to slide in
          // animate fade in
          requestAnimationFrame(() => {
            setTransition('transform 0.3s ease, opacity 0.3s ease');
            setOffsetX(0);
            setOpacity(1);
          });
        }, 100);
      } else {
        setTransition('transform 0.2s ease');
        setOffsetX(0);
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: false,
  });

  return (

    <div>
      {/* <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div> */}
        <div className="content">
          <div
          {...handlers}
          style={{
            transform: `translateX(${offsetX}px)`,
            transition,
            touchAction: 'pan-y',
            opacity: opacity
          }}
          className="hold-all"
        >
          <MessageBox
            messages={messages}
            currentIndex={currentIndex}
            setIndex={setCurrentIndex}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
