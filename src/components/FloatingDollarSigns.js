"use client";
import React, { useEffect, useState } from 'react';
import './FloatingDollarSigns.css'; // We will create this CSS file next

const FloatingDollarSigns = () => {
    const [dollarSigns, setDollarSigns] = useState([]);

    useEffect(() => {
        const createDollarSign = () => {
            const newDollarSign = {
                id: Math.random(),
                left: Math.random() * 100, // percentage
                animationDuration: Math.random() * 5 + 5, // 5 to 10 seconds
                animationDelay: Math.random() * 5, // 0 to 5 seconds delay
            };
            setDollarSigns(prev => [...prev, newDollarSign]);

            // Remove dollar sign after animation
            setTimeout(() => {
                setDollarSigns(prev => prev.filter(ds => ds.id !== newDollarSign.id));
            }, (newDollarSign.animationDuration + newDollarSign.animationDelay) * 1000);
        };

        const intervalId = setInterval(createDollarSign, 1000); // Create a new dollar sign every second

        // Create a few initial dollar signs
        for (let i = 0; i < 10; i++) {
            createDollarSign();
        }

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="dollar-signs-container">
            {dollarSigns.map(ds => (
                <div
                    key={ds.id}
                    className="dollar-sign"
                    style={{
                        left: `${ds.left}%`,
                        animationDuration: `${ds.animationDuration}s`,
                        animationDelay: `${ds.animationDelay}s`,
                    }}
                >
                    $
                </div>
            ))}
        </div>
    );
};

export default FloatingDollarSigns;
