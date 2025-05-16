"use client";
import React, { useEffect, useState } from 'react';
import './FireEmojiRain.css'; // We'll create this CSS file next

const FireEmojiRain = ({ active }) => {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    if (active) {
      const newEmojis = Array.from({ length: 30 }).map((_, index) => ({
        id: index,
        left: Math.random() * 100, // percentage
        animationDuration: Math.random() * 1 + 1, // 1 to 2 seconds
        animationDelay: Math.random() * 0.5, // up to 0.5s delay
      }));
      setEmojis(newEmojis);

      // Clear emojis after animation
      const timer = setTimeout(() => {
        setEmojis([]);
      }, 2000); // Corresponds to the longest animation + desired visibility

      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || emojis.length === 0) {
    return null;
  }

  return (
    <div className="fire-emoji-rain-container">
      {emojis.map(emoji => (
        <div
          key={emoji.id}
          className="fire-emoji"
          style={{
            left: `${emoji.left}%`,
            animationDuration: `${emoji.animationDuration}s`,
            animationDelay: `${emoji.animationDelay}s`,
          }}
        >
          🔥
        </div>
      ))}
    </div>
  );
};

export default FireEmojiRain;
