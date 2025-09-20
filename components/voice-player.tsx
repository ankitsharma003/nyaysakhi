'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoicePlayerProps {
  text: string
  language?: 'en' | 'hi'
  className?: string
  autoPlay?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnd?: () => void
}

export default function VoicePlayer({
  text,
  language = 'en',
  className = '',
  autoPlay = false,
  onPlay,
  onPause,
  onEnd,
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true)
    } else {
      setError('Text-to-speech is not supported in this browser')
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (utteranceRef.current) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (autoPlay && isSupported && text) {
      handlePlay()
    }
  }, [autoPlay, isSupported, text])

  const getVoice = () => {
    const voices = speechSynthesis.getVoices()
    const targetLang = language === 'hi' ? 'hi-IN' : 'en-US'

    // Try to find a voice for the target language
    let voice = voices.find((v) => v.lang === targetLang)

    // Fallback to any English voice if Hindi not found
    if (!voice && language === 'hi') {
      voice = voices.find((v) => v.lang.startsWith('en'))
    }

    // Fallback to any available voice
    if (!voice) {
      voice = voices[0]
    }

    return voice
  }

  const handlePlay = () => {
    if (!isSupported || !text) return

    setIsLoading(true)
    setError(null)

    try {
      // Cancel any existing speech
      speechSynthesis.cancel()

      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      // Set voice
      const voice = getVoice()
      if (voice) {
        utterance.voice = voice
      }

      // Set language
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US'

      // Set speech parameters
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = isMuted ? 0 : 1

      // Event handlers
      utterance.onstart = () => {
        setIsPlaying(true)
        setIsLoading(false)
        onPlay?.()
        startTimer()
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        onEnd?.()
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        setError('Failed to play audio')
        setIsPlaying(false)
        setIsLoading(false)
      }

      utterance.onpause = () => {
        setIsPlaying(false)
        onPause?.()
      }

      utterance.onresume = () => {
        setIsPlaying(true)
        onPlay?.()
      }

      // Start speaking
      speechSynthesis.speak(utterance)
    } catch (err) {
      console.error('Error starting speech synthesis:', err)
      setError('Failed to start audio playback')
      setIsLoading(false)
    }
  }

  const handlePause = () => {
    if (isPlaying) {
      speechSynthesis.pause()
    } else {
      speechSynthesis.resume()
    }
  }

  const handleStop = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setCurrentTime(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
    if (utteranceRef.current) {
      utteranceRef.current.volume = !isMuted ? 0 : 1
    }
  }

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        // Estimate progress based on text length and rate
        const estimatedDuration = (text.length / 150) * 60 // Rough estimate
        setDuration(estimatedDuration)

        if (prev >= estimatedDuration) {
          clearInterval(intervalRef.current!)
          return 0
        }
        return prev + 0.1
      })
    }, 100)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!isSupported) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        <VolumeX className="mx-auto mb-2 h-8 w-8" />
        <p>Text-to-speech is not supported in this browser</p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg bg-gray-50 p-4 ${className}`}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleMute}
          className="flex items-center space-x-1"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>

        <Button
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={isLoading || !text}
          className="flex items-center space-x-2"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span>{isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleStop}
          disabled={!isPlaying && !isLoading}
          className="flex items-center space-x-1"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 text-center text-sm text-red-600">{error}</div>
      )}

      {/* Language Indicator */}
      <div className="mt-2 text-center text-xs text-gray-500">
        Language: {language === 'hi' ? 'हिंदी' : 'English'}
      </div>
    </div>
  )
}
