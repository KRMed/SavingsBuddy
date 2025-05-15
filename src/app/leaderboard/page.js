'use client';
import React, { useEffect, useState } from 'react';

export default function LeaderboardPage() {
  const [worldwide, setWorldwide] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setWorldwide([
      { name: 'Naame1', streak: 10 },
      { name: 'Name2', streak: 8 },
      { name: 'Name3', streak: 7 },
      { name: 'Name4', streak: 6 },
      { name: 'Name5', streak: 5 }
    ]);

    setFriends([
      { name: 'Name1', streak: 12 },
      { name: 'Name2', streak: 11 },
      { name: 'Name3', streak: 9 },
      { name: 'Name4', streak: 7 },
      { name: 'Name5', streak: 4 }
    ]);
  }, []);

  const renderEntries = (entries) =>
    entries.map((entry, index) => (
      <div key={index} style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#e2e2e2',
        padding: '0.5rem',
        borderTop: '1px solid #ccc'
      }}>
        <div style={{
          width: 30,
          height: 30,
          background: 'white',
          borderRadius: '50%',
          marginRight: '0.5rem',
          flexShrink: 0
        }}></div>
        <span style={{ fontWeight: 'bold', color: 'black' }}>{entry.name} / {entry.streak}</span>
      </div>
    ));

  return (
    <div style={{ height: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#153d66',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            background: 'white',
            borderRadius: '50%',
            marginRight: '1rem'
          }}></div>
          <nav>
            <a href="/register" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>DASHBOARD</a>
            <a href="/leaderboard" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>LEADERBOARD</a>
          </nav>
        </div>
        <div>
          <a href="/login">
            <button style={{
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#cc3b2f',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>Login</button>
          </a>
          <a href="/register">
            <button style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#cc3b2f',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>Sign Up</button>
          </a>
        </div>
      </header>
      <main style={{
        flex: 1,
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <section style={{ display: 'flex', gap: '2rem' }}>
          <div style={{
            border: '1px solid black',
            borderRadius: '8px',
            overflow: 'hidden',
            width: '260px', 
            backgroundColor: 'white'
          }}>
            <div style={{
              backgroundColor: '#cc3b2f',
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '0.5rem'
            }}>WORLDWIDE</div>
            {renderEntries(worldwide)}
          </div>
          <div style={{
            border: '1px solid black',
            borderRadius: '8px',
            overflow: 'hidden',
            width: '260px',
            backgroundColor: 'white'
          }}>
            <div style={{
              backgroundColor: '#cc3b2f',
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '0.5rem'
            }}>FRIENDS</div>
            {renderEntries(friends)}
          </div>
        </section>
      </main>
    </div>
  );
}
