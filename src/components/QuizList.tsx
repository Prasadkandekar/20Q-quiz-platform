import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Clock, FileQuestionMark as FileQuestion, ArrowRight } from "lucide-react"
import type { QuizMeta } from "@/types/quiz"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface QuizListProps {
  onSelectQuiz: (meta: QuizMeta) => Promise<void>
}

export function QuizList({ onSelectQuiz }: QuizListProps) {
  const [quizzes, setQuizzes] = useState<QuizMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmQuiz, setConfirmQuiz] = useState<QuizMeta | null>(null)

  useEffect(() => {
    fetch("/data/quizzes.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load quizzes")
        return r.json()
      })
      .then((data: QuizMeta[]) => {
        setQuizzes(data) 
        setLoading(false)
      })
      .catch(() => {
        setError("Could not load quiz list.")
        setLoading(false)
      })
  }, [])

  const handleSelect = (meta: QuizMeta) => {
    setConfirmQuiz(meta)
  }

  const handleStartConfirm = async () => {
    if (!confirmQuiz) return
    setStarting(confirmQuiz.id)
    await onSelectQuiz(confirmQuiz)
    setStarting(null)
    setConfirmQuiz(null)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    return `${m} min`
  }

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-8 rounded border border-border flex items-center justify-center">
              <FileQuestion className="size-4 text-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
              20Q Platform
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
            Welcome to 20Q
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Choose a quiz below. Each quiz is timed — read carefully and answer
            with confidence.
          </p>
        </div>

        <Separator className="mb-10" />

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {quizzes.map((quiz, index) => (
              <Card
                key={quiz.id}
                className="group border-border bg-card hover:border-foreground/30 transition-all duration-200 cursor-pointer"
                onClick={() => handleSelect(quiz)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground font-medium tracking-widest uppercase mb-2">
                        Quiz {String(index + 1).padStart(2, "0")}
                      </div>
                      <CardTitle className="text-xl text-foreground leading-tight">
                        {quiz.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground leading-relaxed pt-1">
                    {quiz.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-5 text-sm text-muted-foreground mb-5">
                    <span className="flex items-center gap-2">
                      <FileQuestion className="size-3.5" />
                      {quiz.questionCount} questions
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="size-3.5" />
                      {formatTime(quiz.timeLimit)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                    disabled={starting === quiz.id}
                  >
                    <span className="font-medium">
                      {starting === quiz.id ? "Loading..." : "Start Quiz"}
                    </span>
                    {starting === quiz.id ? (
                      <Spinner className="size-4" />
                    ) : (
                      <ArrowRight className="size-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Use keyboard shortcuts during a quiz — press{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-border font-mono">1</kbd>
            {" "}–{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-border font-mono">4</kbd>
            {" "}to select options,{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-border font-mono">←</kbd>
            {" "}
            <kbd className="px-1.5 py-0.5 rounded border border-border font-mono">→</kbd>
            {" "}to navigate
          </p>
        </div>
      </div>

      <AlertDialog open={!!confirmQuiz} onOpenChange={(open) => !open && setConfirmQuiz(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start "{confirmQuiz?.title}"? The timer will begin immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartConfirm}>
              {starting ? <Spinner className="mr-2 size-4" /> : null}
              Start Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
