"use client";
import React from "react";
import savingsbuddyImage from "../assets/savingsbuddy_no_background.png";
import Link from "next/link";
import FloatingDollarSigns from "./FloatingDollarSigns"; // Import the new component

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}> {/* Added position: 'relative' and overflow: 'hidden' */}
            <FloatingDollarSigns /> {/* Add the floating dollar signs component */}
            <main style={{ marginTop: '20px', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}> {/* Added zIndex: 1 to ensure content is above the dollar signs */}
                <div className="container mx-auto px-6 py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-12 md:mb-0">
                            <h1 style={{ fontSize: "56px" }} className="font-bold mb-6 leading-tight text-gray-800">
                                <span className="inline-block pb-1">Make Saving Money</span>
                                <br />
                                <span className="inline-block pb-1">Fun & Interactive</span>
                            </h1>
                            <hr style={{ borderTop: '4px solid black', width: '100%', margin: '2rem 0' }} />

                            <p className="mb-8 text-lg text-gray-600 max-w-md">
                                SavingsBuddy is an interactive and engaging way to budget and save money. Sign up now to find out how fun it is to save!
                            </p>
                            <Link href={"/register"}>
                                <button className="bg-blue-600 text-white px-10 py-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg text-lg font-semibold cursor-pointer"> {/* Added cursor-pointer */}
                                    Try Now!
                                </button>
                            </Link>
                        </div>
                        <div className="md:w-1/2 flex justify-center items-center">
                            <img
                                src={savingsbuddyImage.src}
                                alt="SavingsBuddy"
                                className="w-full h-auto max-w-md md:max-w-lg object-contain rounded-lg shadow-2xl"
                            />
                    </div>
                </div>
            </div>
        </main>
        </div>
    );
}
