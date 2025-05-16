'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LeaderboardPage() {
  const [worldwideLongest, setWorldwideLongest] = useState([]); // New state for longest streaks
  const [worldwideCurrent, setWorldwideCurrent] = useState([]); // New state for current streaks
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      try {
        // Fetch for Worldwide Longest Streaks
        const { data: longestData, error: longestError } = await supabase
          .from('profiles')
          .select('username, current_streak, longest_streak')
          .order('longest_streak', { ascending: false })
          .limit(50);

        if (longestError) {
          console.error("Error fetching worldwide longest streaks:", longestError);
          // Handle error appropriately
        } else {
          setWorldwideLongest(longestData || []);
        }

        // Fetch for Worldwide Current Streaks
        const { data: currentData, error: currentError } = await supabase
          .from('profiles')
          .select('username, current_streak, longest_streak') // longest_streak can be kept for consistency if renderEntries expects it
          .order('current_streak', { ascending: false })
          .limit(50);

        if (currentError) {
          console.error("Error fetching worldwide current streaks:", currentError);
          // Handle error appropriately
        } else {
          setWorldwideCurrent(currentData || []);
        }

        // Assuming friends fetching logic is separate or will be updated similarly
        // For now, friends data fetching is not modified as per the specific issue reported.

      } catch (error) {
        console.error("Error fetching leaderboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboards();
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
              {renderEntries(worldwideLongest, 1)}
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
              {renderEntries(friends, 1)}
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
              {renderEntries(worldwideCurrent, 0)}
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
              {renderEntries(friends, 0)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
