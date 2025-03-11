"use client"

import { useEffect } from "react"
import "./RainEffect.css"

// * Originally by Aaron Rickle (https://codepen.io/arickle), modified to meet the needs of this app
export default function RainEffect() {
  useEffect(() => {
    makeItRain()
  }, []);

  const makeItRain = () => {
    // Clear out everything
    const frontRow = document.querySelector(".rain.front-row")
    const backRow = document.querySelector(".rain.back-row")

    if (frontRow) frontRow.innerHTML = ""
    if (backRow) backRow.innerHTML = ""

    let increment = 0
    let drops = ""
    let backDrops = ""

    while (increment < 100) {
      // Random number between 98 and 1
      const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1)
      // Random number between 5 and 2
      const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2)

      // Increment
      increment += randoFiver

      // Create new raindrops with various randomizations
      drops += `
        <div 
          class="drop" 
          style="
            left: ${increment}%; 
            bottom: ${50 + randoFiver + randoFiver - 1 + 100}%; 
            animation-delay: 0.${randoHundo}s; 
            animation-duration: 0.5${randoHundo}s;
          "
        >
          <div 
            class="stem" 
            style="
              animation-delay: 0.${randoHundo}s; 
              animation-duration: 0.5${randoHundo}s;
            "
          ></div>
          <div 
            class="splat" 
            style="
              animation-delay: 0.${randoHundo}s; 
              animation-duration: 0.5${randoHundo}s;
            "
          ></div>
        </div>
      `

      backDrops += `
        <div 
          class="drop" 
          style="
            right: ${increment}%; 
            bottom: ${50 + randoFiver + randoFiver - 1 + 100}%; 
            animation-delay: 0.${randoHundo}s; 
            animation-duration: 0.5${randoHundo}s;
          "
        >
          <div 
            class="stem" 
            style="
              animation-delay: 0.${randoHundo}s; 
              animation-duration: 0.5${randoHundo}s;
            "
          ></div>
          <div 
            class="splat" 
            style="
              animation-delay: 0.${randoHundo}s; 
              animation-duration: 0.5${randoHundo}s;
            "
          ></div>
        </div>
      `
    }

    if (frontRow) frontRow.innerHTML = drops
    if (backRow) backRow.innerHTML = backDrops
  }

  return (
    <div>
      <div className="rain front-row"></div>
      <div className="rain back-row"></div>
    </div>
  )
}