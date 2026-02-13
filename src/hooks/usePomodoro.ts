import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../services/supabase'


export function usePomodoro() {
    const FOCUS = 25 * 60
    const BREAK = 5 * 60

    const [secondsLeft, setSecondsLeft] = useState(FOCUS)
    const [isRunning, setIsRunning] = useState(false)
    const [mode, setMode] = useState<'focus' | 'break'>('focus')
    const [sessions, setSessions] = useState(0)

    const intervalRef = useRef<number | null>(null)

    const handleSwitch = useCallback(async () => {
        if (mode === 'focus') {
            setSessions((prev) => prev + 1)

            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (user) {
                await supabase.from('sessions').insert({
                    user_id: user.id,
                })
            }

            setMode('break')
            setSecondsLeft(BREAK)
        } else {
            setMode('focus')
            setSecondsLeft(FOCUS)
        }

        setIsRunning(false)
    }, [mode, BREAK, FOCUS])

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = window.setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        if (intervalRef.current) clearInterval(intervalRef.current)
                        handleSwitch()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isRunning, handleSwitch])


    const start = () => setIsRunning(true)
    const pause = () => setIsRunning(false)
    const reset = () => {
        setIsRunning(false)
        setMode('focus')
        setSecondsLeft(FOCUS)
    }

    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60

    return {
        minutes,
        seconds,
        isRunning,
        start,
        pause,
        reset,
        mode,
        sessions,
    }
}
