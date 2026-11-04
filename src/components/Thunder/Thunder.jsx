"use client"

import "./Thunder.css"
import { useEffect } from "react";

function Thunder() {
    useEffect(() => {
        const thunderElement = document.getElementById('thunder');
        let timeoutId;

        const randomDelay = () => (Math.floor(Math.random() * 16) + 5) * 1000; // 5-20 seconds

        const triggerThunderAnimation = () => {
            thunderElement.classList.remove('animate-thunder');
            void thunderElement.offsetWidth; // Forces reflow
            thunderElement.classList.add('animate-thunder');

            // Schedule the next strike with a fresh random delay
            timeoutId = setTimeout(triggerThunderAnimation, randomDelay());
        };

        timeoutId = setTimeout(triggerThunderAnimation, randomDelay());

        // Always holds the pending timeout, so this stops the chain on unmount
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div id="thunder"></div>
    )
}

export default Thunder;