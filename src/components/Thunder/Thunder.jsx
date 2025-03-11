"use client"

import "./Thunder.css"
import { useEffect } from "react";

function Thunder() {
    // ! This isn't particularly great since the delay is permanently the same, but it works for now
    useEffect(() => {
        const thunderElement = document.getElementById('thunder');

        const triggerThunderAnimation = () => {
            thunderElement.classList.remove('animate-thunder');
            void thunderElement.offsetWidth; // Forces reflow
            thunderElement.classList.add('animate-thunder');
        };

        // First trigger after random delay
        const firstTimeout = setTimeout(() => {
            triggerThunderAnimation(); // Trigger animation after delay

            // Start interval after first animation
            const intervalId = setInterval(triggerThunderAnimation, (Math.floor(Math.random() * 16) + 5) * 1000);

            // Cleanup interval on component unmount
            return () => clearInterval(intervalId);
        }, (Math.floor(Math.random() * 16) + 5) * 1000);  // Only delay this first trigger

        // Cleanup the timeout on component unmount
        return () => clearTimeout(firstTimeout);
    }, []);

    return (
        <div id="thunder"></div>
    )
}

export default Thunder;