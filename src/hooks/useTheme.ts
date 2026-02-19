import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
    const [theme] = useState<Theme>('dark')

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light')
        root.classList.add('dark')
    }, [])

    const toggleTheme = () => {
        // Disabled for permanent dark mode
    }

    return { theme, toggleTheme }
}
