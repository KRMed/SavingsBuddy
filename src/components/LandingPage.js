"use client";
import React from "react";
import savingsbuddyImage from "../assets/savingsbuddy.png";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div style={{ height: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#153D66',
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
            <a href="/register" style={{ marginRight: '1rem', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>LEADERBOARD</a>
          </nav>
        </div>
        <div>
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
        </div>
      </header>
        <main style={{ marginTop: '75px' }}>
            <div className="flex-1 flex items-center justify-center h-screen">
                <div className="flex flex-col md:flex-row items-center w-full max-w-7xl px-4 py-4 -mt-65">
                    <div className="flex-1 flex flex-col items-center md:items-start max-w-[50%]">
                        <h1 style={{ fontSize: "70px" }} className="md:text-5xl font-semibold mb-6 leading-tight text-black">
                            <span className="inline-block pb-1 mb-1">Take Control of</span>
                            <br />
                            <span className="inline-block pb-1 mb-1">your Finances with</span>
                            <br />
                            <span className="inline-block border-b-4 border-blue-700 pb-1 mb-1">SavingsBuddy</span>
                        </h1>
                        <p className="mb-3 text-base text-gray-700">
                            An interactive and engaging way to budget and save money!
                        </p>
                        <Link href={"/login"}>
                            <button className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition duration-200 shadow">
                                Try Now!
                            </button>
                        </Link>
                    </div>
                    <div className="flex-1 flex justify-center items-center max-w-[50%]">
                        <img
                            src={savingsbuddyImage.src}
                            alt="SavingsBuddy"
                            className="w-full h-auto max-w-[500px] object-contain"
                        />
                </div>
            </div>
        </div>
    </main>
    </div>
);
}
