"use client";

import { usePathname } from "next/navigation"; // Use usePathname for accurate route detection
import { useState } from "react"; // Import useState for managing popup state
import savingsbuddyImage from "../assets/savingsbuddy.png";

const Header = () => {
    const pathname = usePathname(); // Get the current pathname
    const isLandingPage = pathname === "/"; // Check if the current path is "/"
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility

    const togglePopup = () => {
        setIsPopupVisible((prev) => !prev);
    };

    return (
        <header style={{
        backgroundColor: '#153D66',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            href={savingsbuddyImage}
            src={savingsbuddyImage.src}
            alt="Logo"
            style={{ width: '40px', height: '40px', marginRight: '1rem' }}
          />
          <nav>
            <a href="/dashboard" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>DASHBOARD</a>
            <a href="/leaderboard" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>LEADERBOARD</a>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          {isLandingPage && ( // Conditionally render Login and Sign Up
                    <>
                        <a href="/login">
                            <button style={{
                                marginRight: '0.5rem',
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: '#CC3B2F',
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
                                backgroundColor: '#CC3B2F',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}>Sign Up</button>
                        </a>
                    </>
                )}
          <div
                    onClick={togglePopup}
                    style={{
                        width: 40,
                        height: 40,
                        background: 'white',
                        borderRadius: '50%',
                        marginLeft: '1rem',
                        cursor: 'pointer'
                    }}
                ></div>
                {isPopupVisible && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '0.5rem',
                        zIndex: 1000
                    }}>
                        <a href="/" style={{ display: 'block', padding: '0.5rem', color: '#153D66', textDecoration: 'none' }}>Profile</a>
                        <a href="/" style={{ display: 'block', padding: '0.5rem', color: '#153D66', textDecoration: 'none' }}>Settings</a>
                        <a href="/" style={{ display: 'block', padding: '0.5rem', color: '#CC3B2F', textDecoration: 'none' }}>Logout</a>
                    </div>
                )}
        </div>
      </header>
      
    );
}

export default Header;
