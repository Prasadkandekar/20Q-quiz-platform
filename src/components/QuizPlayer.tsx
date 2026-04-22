import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react"
import type { Quiz, QuizMeta } from "@/types/quiz"
import { cn } from "@/lib/utils"

interface QuizPlayerProps {
  quiz: Quiz
  meta: QuizMeta
  onComplete: (answers: string[]) => void
  onBack: () => void
}

export function QuizPlayer({ quiz, meta, onComplete, onBack }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(
    Array(quiz.questions.length).fill("")
  )
  const [timeLeft, setTimeLeft] = useState(meta.timeLimit)
  const [showConfirmQuit, setShowConfirmQuit] = useState(false)

  const answersRef = useRef(answers)
  answersRef.current = answers
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const currentQuestion = quiz.questions[currentIndex]
  const isLast = currentIndex === quiz.questions.length - 1
  const isFirst = currentIndex === 0
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100
  const answeredCount = answers.filter((a) => a !== "").length
  const isTimerWarning = timeLeft <= 60

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setTimeout(() => onCompleteRef.current(answersRef.current), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const selectOption = useCallback(
    (option: string) => {
      setAnswers((prev) => {
        const next = [...prev]
        next[currentIndex] = option
        return next
      })
    },
    [currentIndex]
  )

  const goNext = useCallback(() => {
    if (isLast) {
      onCompleteRef.current(answersRef.current)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }, [isLast])

  const goPrev = useCallback(() => {
    if (!isFirst) setCurrentIndex((i) => i - 1)
  }, [isFirst])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showConfirmQuit) {
        if (e.key === "Escape") setShowConfirmQuit(false)
        return
      }
      const opts = currentQuestion.options
      if (e.key === "1" && opts[0]) selectOption(opts[0])
      else if (e.key === "2" && opts[1]) selectOption(opts[1])
      else if (e.key === "3" && opts[2]) selectOption(opts[2])
      else if (e.key === "4" && opts[3]) selectOption(opts[3])
      else if (e.key === "ArrowLeft") goPrev()
      else if (e.key === "ArrowRight") {
        if (answers[currentIndex]) goNext()
      } else if (e.key === "Enter") {
        if (answers[currentIndex]) goNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, currentQuestion, answers, selectOption, goNext, goPrev, showConfirmQuit])

  const optionLetters = ["A", "B", "C", "D", "E", "F"]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setShowConfirmQuit(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
            Quit
          </button>

          <div className="text-sm font-medium text-muted-foreground truncate max-w-[200px] sm:max-w-none">
            {quiz.title}
          </div>

          <div
            className={cn(
              "flex items-center gap-2 text-sm font-mono font-semibold tabular-nums",
              isTimerWarning ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <Clock
              className={cn(
                "size-4",
                isTimerWarning && "animate-pulse"
              )}
            />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border">
        <Progress value={progress} className="h-0.5 rounded-none bg-muted" />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        {/* Question Meta */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
            Question {currentIndex + 1} / {quiz.questions.length}
          </span>
          <span className="text-xs text-muted-foreground">
            {answeredCount} of {quiz.questions.length} answered
          </span>
        </div>

        {/* Question */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-10">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[currentIndex] === option
            const letter = optionLetters[idx]

            return (
              <button
                key={`${currentIndex}-${option}`}
                onClick={() => selectOption(option)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-lg border text-left transition-all duration-150",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:border-foreground/40 hover:bg-muted/30"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center size-8 rounded border text-xs font-bold shrink-0 transition-colors",
                    isSelected
                      ? "border-background/40 text-background"
                      : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {letter}
                </span>
                <span className="text-sm leading-relaxed flex-1">{option}</span>
                <span
                  className={cn(
                    "text-xs font-mono shrink-0 hidden sm:block",
                    isSelected
                      ? "text-background/50"
                      : "text-muted-foreground/40"
                  )}
                >
                  {idx + 1}
                </span>
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={isFirst}
            className="gap-2"
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>

          {/* Dot Navigation */}
          <div className="hidden sm:flex items-center gap-1.5">
            {quiz.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                title={`Question ${idx + 1}`}
                className={cn(
                  "rounded-full transition-all duration-150",
                  idx === currentIndex
                    ? "size-2.5 bg-foreground"
                    : answers[idx]
                    ? "size-2 bg-foreground/50"
                    : "size-2 bg-border hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>

          <Button
            onClick={goNext}
            disabled={!answers[currentIndex]}
            className={cn(
              "gap-2",
              isLast && "font-semibold"
            )}
          >
            {isLast ? "Submit Quiz" : "Next"}
            {!isLast && <ChevronRight className="size-4" />}
          </Button>
        </div>
      </main>

      {/* Keyboard Hint */}
      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <p className="text-xs text-muted-foreground/60 text-center">
            Press{" "}
            <kbd className="px-1 py-0.5 rounded border border-border/60 font-mono text-[10px]">1</kbd>
            {" – "}
            <kbd className="px-1 py-0.5 rounded border border-border/60 font-mono text-[10px]">4</kbd>
            {" "}to select · {" "}
            <kbd className="px-1 py-0.5 rounded border border-border/60 font-mono text-[10px]">←</kbd>
            {" "}
            <kbd className="px-1 py-0.5 rounded border border-border/60 font-mono text-[10px]">→</kbd>
            {" "}to navigate · {" "}
            <kbd className="px-1 py-0.5 rounded border border-border/60 font-mono text-[10px]">Enter</kbd>
            {" "}to confirm
          </p>
        </div>
      </footer>

      {/* Quit Confirmation Overlay */}
      {showConfirmQuit && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-card border border-border rounded-xl p-8 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Quit this quiz?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your progress will be lost. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmQuit(false)}
              >
                Continue Quiz
              </Button>
              <Button
                className="flex-1"
                onClick={onBack}
              >
                Quit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
