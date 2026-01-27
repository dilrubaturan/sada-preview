import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface SilentMomentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  duration: number
}

const BREATH_CYCLE = 16
const breathPhases = [
  { duration: 4, instruction: 'Breathe in slowly...', action: 'inhale' },
  { duration: 4, instruction: 'Hold gently...', action: 'hold' },
  { duration: 4, instruction: 'Breathe out softly...', action: 'exhale' },
  { duration: 4, instruction: 'Rest...', action: 'rest' }
]

const guidanceMessages = [
  "Find a comfortable position",
  "Let your shoulders relax",
  "Notice the present moment",
  "Allow thoughts to pass like clouds",
  "Feel gratitude for this pause",
  "Connect with your inner peace",
  "Observe without judgment",
  "Simply be here, now"
]

export function SilentMoment({ open, onOpenChange, duration }: SilentMomentProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isActive, setIsActive] = useState(false)
  const [breathTimer, setBreathTimer] = useState(0)
  const [guidanceIndex, setGuidanceIndex] = useState(0)

  useEffect(() => {
    if (open) {
      setTimeLeft(duration * 60)
      setIsActive(false)
      setBreathTimer(0)
      setGuidanceIndex(0)
    }
  }, [open, duration])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    let guidanceInterval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
        setBreathTimer((timer) => (timer + 1) % BREATH_CYCLE)
      }, 1000)

      guidanceInterval = setInterval(() => {
        setGuidanceIndex((prev) => (prev + 1) % guidanceMessages.length)
      }, 20000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
      if (guidanceInterval) clearInterval(guidanceInterval)
    }
  }, [isActive, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentBreathPhase = () => {
    let elapsed = 0
    for (const phase of breathPhases) {
      elapsed += phase.duration
      if (breathTimer < elapsed) {
        return phase
      }
    }
    return breathPhases[0]
  }

  const getBreathProgress = () => {
    let elapsed = 0
    for (const phase of breathPhases) {
      if (breathTimer < elapsed + phase.duration) {
        const phaseProgress = (breathTimer - elapsed) / phase.duration
        return phaseProgress
      }
      elapsed += phase.duration
    }
    return 0
  }

  const currentPhase = isActive ? getCurrentBreathPhase() : null
  const breathProgress = getBreathProgress()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-0 bg-gradient-to-br from-background via-background to-accent/5 backdrop-blur">
        <div className="space-y-12 py-12 px-6 text-center">
          <div className="space-y-3">
            <motion.h2 
              className="text-3xl font-serif font-medium text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Silent Moment
            </motion.h2>
            {!isActive && timeLeft > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <p className="text-base text-muted-foreground font-serif leading-relaxed max-w-md mx-auto">
                  Take a pause from the world.<br/>
                  Find stillness. Breathe. Reflect.
                </p>
                <p className="text-sm text-muted-foreground/80">
                  {duration} {duration === 1 ? 'minute' : 'minutes'} of peaceful presence
                </p>
              </motion.div>
            ) : isActive ? (
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentPhase?.instruction}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl text-primary/90 font-serif font-medium"
                  >
                    {currentPhase?.instruction}
                  </motion.p>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={guidanceIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="text-sm text-muted-foreground/70 font-serif italic"
                  >
                    {guidanceMessages[guidanceIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            ) : null}
          </div>

          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative flex items-center justify-center w-full h-full"
                animate={
                  isActive && currentPhase
                    ? currentPhase.action === 'inhale'
                      ? { scale: [1, 1.2] }
                      : currentPhase.action === 'hold'
                      ? { scale: 1.2 }
                      : currentPhase.action === 'exhale'
                      ? { scale: [1.2, 1] }
                      : { scale: 1 }
                    : { scale: 1 }
                }
                transition={{
                  duration: currentPhase?.duration || 4,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="absolute w-48 h-48 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, oklch(0.70 0.15 70 / 0.15) 0%, transparent 70%)'
                  }}
                  animate={isActive ? { 
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 0.15, 0.4]
                  } : { scale: 1, opacity: 0.3 }}
                  transition={{ duration: BREATH_CYCLE, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute w-36 h-36 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, oklch(0.70 0.15 70 / 0.2) 0%, transparent 70%)'
                  }}
                  animate={isActive ? { 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0.2, 0.5]
                  } : { scale: 1, opacity: 0.4 }}
                  transition={{ duration: BREATH_CYCLE, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />
                <motion.div
                  className="absolute w-28 h-28 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, oklch(0.70 0.15 70 / 0.25) 0%, transparent 70%)'
                  }}
                  animate={isActive ? { 
                    scale: [1, 1.6, 1],
                    opacity: [0.6, 0.25, 0.6]
                  } : { scale: 1, opacity: 0.5 }}
                  transition={{ duration: BREATH_CYCLE, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                />
                
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <motion.div 
                    className="text-4xl font-light text-foreground/80 tabular-nums"
                    animate={isActive ? { opacity: [0.8, 0.5, 0.8] } : {}}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground/60 tracking-wide"
                    >
                      remaining
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {isActive && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3 px-12"
            >
              <div className="h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent/40 via-accent/60 to-accent/40 rounded-full shadow-lg shadow-accent/20"
                  animate={{ width: `${breathProgress * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}

          <div className="space-y-3 pt-4">
            {!isActive && timeLeft > 0 ? (
              <Button 
                onClick={() => setIsActive(true)} 
                className="px-12 py-6 text-base font-medium rounded-full"
                size="lg"
              >
                Begin Your Moment
              </Button>
            ) : isActive ? (
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => setIsActive(false)} 
                  variant="outline"
                  className="px-8 rounded-full"
                  size="lg"
                >
                  Pause
                </Button>
                <Button 
                  onClick={() => onOpenChange(false)} 
                  variant="ghost"
                  className="px-8 rounded-full"
                  size="lg"
                >
                  End Early
                </Button>
              </div>
            ) : null}
            
            {timeLeft === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="text-4xl">✨</div>
                  <p className="text-xl text-foreground font-serif font-medium">
                    Moment Complete
                  </p>
                  <p className="text-base text-muted-foreground font-serif">
                    May you carry this peace forward
                  </p>
                </div>
                <Button 
                  onClick={() => onOpenChange(false)} 
                  className="px-12 rounded-full"
                  size="lg"
                >
                  Return Refreshed
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
