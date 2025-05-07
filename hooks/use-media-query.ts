"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Define callback
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    mediaQuery.addEventListener("change", handler)

    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [query])

  return matches
}
