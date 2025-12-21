/**
 * Pomodoro Timer Plugin for FABRIC
 *
 * A simple, elegant focus timer using the Pomodoro Technique.
 * Work for 25 minutes, then take a 5-minute break.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react'

// Base plugin class - provided by FABRIC
class FabricPlugin {
  manifest: any
  api: any
  context: any

  async onLoad() {}
  async onUnload() {}
  onSettingsChange?(settings: Record<string, unknown>): void

  protected log(message: string) {
    console.log(`[${this.manifest?.name}] ${message}`)
  }

  protected success(message: string) {
    this.api?.showNotice(message, 'success')
  }
}

// Types
type TimerMode = 'work' | 'break' | 'longBreak'

interface WidgetProps {
  api: any
  settings: Record<string, unknown>
  theme: string
  isDark: boolean
}

// Timer Widget Component
function PomodoroWidget({ api, settings, theme, isDark }: WidgetProps) {
  const [timeLeft, setTimeLeft] = useState(
    (settings.workDuration as number || 25) * 60
  )
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>('work')
  const [sessions, setSessions] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const workDuration = (settings.workDuration as number || 25) * 60
  const breakDuration = (settings.breakDuration as number || 5) * 60
  const longBreakDuration = (settings.longBreakDuration as number || 15) * 60
  const autoStartBreaks = settings.autoStartBreaks as boolean ?? true
  const soundEnabled = settings.soundEnabled as boolean ?? true

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get duration for current mode
  const getDuration = useCallback(
    (m: TimerMode) => {
      switch (m) {
        case 'work':
          return workDuration
        case 'break':
          return breakDuration
        case 'longBreak':
          return longBreakDuration
      }
    },
    [workDuration, breakDuration, longBreakDuration]
  )

  // Play notification sound
  const playSound = useCallback(() => {
    if (!soundEnabled) return
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...')
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch {}
  }, [soundEnabled])

  // Handle timer completion
  const handleComplete = useCallback(() => {
    playSound()

    if (mode === 'work') {
      const newSessions = sessions + 1
      setSessions(newSessions)

      if (newSessions % 4 === 0) {
        setMode('longBreak')
        setTimeLeft(longBreakDuration)
        api?.showNotice('Great work! Time for a long break.', 'success')
      } else {
        setMode('break')
        setTimeLeft(breakDuration)
        api?.showNotice('Work session complete! Take a short break.', 'success')
      }

      if (autoStartBreaks) {
        setIsRunning(true)
      } else {
        setIsRunning(false)
      }
    } else {
      setMode('work')
      setTimeLeft(workDuration)
      setIsRunning(false)
      api?.showNotice('Break over! Ready for another session?', 'info')
    }
  }, [
    mode,
    sessions,
    playSound,
    autoStartBreaks,
    workDuration,
    breakDuration,
    longBreakDuration,
    api,
  ])

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, handleComplete])

  // Toggle timer
  const toggle = () => setIsRunning(!isRunning)

  // Reset timer
  const reset = () => {
    setIsRunning(false)
    setTimeLeft(getDuration(mode))
  }

  // Switch mode
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(getDuration(newMode))
  }

  // Calculate progress
  const progress = 1 - timeLeft / getDuration(mode)

  return (
    <div className="pomodoro-widget p-4">
      {/* Mode Tabs */}
      <div className="flex gap-1 mb-4">
        {(['work', 'break', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`
              flex-1 px-2 py-1 text-[10px] font-medium rounded transition-colors
              ${mode === m
                ? m === 'work'
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
                : isDark
                  ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }
            `}
          >
            {m === 'work' && <Zap className="w-3 h-3 inline mr-1" />}
            {m === 'break' && <Coffee className="w-3 h-3 inline mr-1" />}
            {m === 'longBreak' && <Coffee className="w-3 h-3 inline mr-1" />}
            {m === 'work' ? 'Work' : m === 'break' ? 'Break' : 'Long'}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative flex justify-center mb-4">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            strokeWidth="8"
            className={isDark ? 'stroke-zinc-700' : 'stroke-zinc-200'}
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={351.86}
            strokeDashoffset={351.86 * (1 - progress)}
            className={
              mode === 'work'
                ? 'stroke-red-500'
                : 'stroke-green-500'
            }
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-mono font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {formatTime(timeLeft)}
          </span>
          <span className={`text-[10px] uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {mode === 'work' ? 'Focus Time' : mode === 'break' ? 'Short Break' : 'Long Break'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button
          onClick={toggle}
          className={`
            flex items-center justify-center w-12 h-12 rounded-full
            ${isRunning
              ? 'bg-orange-500 hover:bg-orange-600'
              : mode === 'work'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }
            text-white transition-colors
          `}
        >
          {isRunning ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
        <button
          onClick={reset}
          className={`
            flex items-center justify-center w-10 h-10 rounded-full
            ${isDark
              ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
              : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-600'
            }
            transition-colors
          `}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Session Counter */}
      <div className={`text-center mt-4 text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
        Sessions today: <span className="font-semibold">{sessions}</span>
      </div>
    </div>
  )
}

// Plugin Class
class PomodoroTimerPlugin extends FabricPlugin {
  async onLoad() {
    this.api.registerSidebarWidget(PomodoroWidget)

    this.api.registerCommand({
      id: 'pomodoro:start',
      name: 'Start Pomodoro Timer',
      shortcut: 'mod+shift+p',
      callback: () => {
        this.api.showNotice('Use the sidebar widget to control the timer', 'info')
      },
    })

    this.log('Pomodoro Timer loaded!')
  }

  async onUnload() {
    this.log('Pomodoro Timer unloaded')
  }
}

export default PomodoroTimerPlugin
