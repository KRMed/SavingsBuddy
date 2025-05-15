'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LeaderboardPage() {
  const [worldwide, setWorldwide] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchWorldWideLeaderboard = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, current_streak')
        .order('current_streak', { ascending: false })
        .limit(50);

      if (!error) setWorldwide(data);
      setLoading(false);
    };

    fetchWorldWideLeaderboard();
  }, []);
  if (loading) return <p>Loading leaderboard...</p>;
  const renderEntries = (entries, current) =>
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
        <span style={{ fontWeight: 'bold', color: 'black' }}>
          {entry.username} / {current === 0 ? (entry.current_streak || 0) : (entry.longest_streak || 0)} 🔥
        </span>
      </div>
    ));

  return (
    <div style={{ height: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
      
      <main style={{
        flex: 1,
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <h1 style={{ fontSize: "80px" }} className="font-semibold leading-tight text-black">
          <span className="inline-block pb-1">Leaderboards</span>
        </h1>
        
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3rem',
          width: '100%'
        }}>
          <section style={{ display: 'flex', gap: '3rem' }}>
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
              }}>TOP WORLDWIDE LONGEST STREAKS</div>
              {renderEntries(worldwide, 0)}
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
              }}>TOP FRIENDS LONGEST STREAKS</div>
              {renderEntries(friends, 0)}
            </div>
          </section>
          <section style={{ display: 'flex', gap: '3rem' }}>
            <div style={{
              border: '1px solid black',
              borderRadius: '8px',
              overflow: 'hidden',
              width: '260px', 
              backgroundColor: 'white'
            }}>
              <div style={{
                backgroundColor: '#153d66',
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '0.5rem'
              }}>TOP WORLDWIDE CURRENT STREAKS</div>
              {renderEntries(worldwide, 1)}
            </div>
            <div style={{
              border: '1px solid black',
              borderRadius: '8px',
              overflow: 'hidden',
              width: '260px',
              backgroundColor: 'white'
            }}>
              <div style={{
                backgroundColor: '#153d66',
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '0.5rem'
              }}>TOP FRIENDS CURRENT STREAKS</div>
              {renderEntries(friends, 1)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
