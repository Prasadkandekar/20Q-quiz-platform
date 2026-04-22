import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CircleCheck as CheckCircle2, Circle as XCircle, CircleMinus as MinusCircle, RotateCcw, LayoutGrid } from "lucide-react"
import type { Quiz, QuizMeta } from "@/types/quiz"
import { cn } from "@/lib/utils"

interface QuizResultsProps {
  quiz: Quiz
  meta: QuizMeta
  answers: string[]
  onRestart: () => void
  onBack: () => void
}

export function QuizResults({
  quiz,
  answers,
  onRestart,
  onBack,
}: QuizResultsProps) {
  const total = quiz.questions.length
  const correct = quiz.questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
    0
  )
  const incorrect = quiz.questions.filter(
    (q, i) => answers[i] !== "" && answers[i] !== q.answer
  ).length
  const skipped = quiz.questions.filter((_, i) => answers[i] === "").length
  const percentage = Math.round((correct / total) * 100)

  const getGrade = () => {
    if (percentage >= 90) return "Excellent"
    if (percentage >= 75) return "Good"
    if (percentage >= 60) return "Pass"
    if (percentage >= 40) return "Needs Work"
    return "Try Again"
  }

  const optionLetters = ["A", "B", "C", "D", "E", "F"]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Score Hero */}
        <div className="text-center mb-12">
          <div className="text-xs font-medium text-muted-foreground tracking-widest uppercase mb-6">
            {quiz.title} — Results
          </div>

          <div className="text-8xl font-bold tracking-tight text-foreground mb-3 tabular-nums">
            {percentage}%
          </div>

          <div className="text-2xl font-semibold text-foreground mb-1">
            {getGrade()}
          </div>
          <p className="text-muted-foreground mb-8">
            {correct} correct out of {total} questions
          </p>

          {/* Score Bar */}
          <div className="max-w-xs mx-auto mb-8">
            <Progress
              value={percentage}
              className="h-1.5 bg-muted"
            />
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {correct}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
                <CheckCircle2 className="size-3" />
                Correct
              </div>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {incorrect}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
                <XCircle className="size-3" />
                Incorrect
              </div>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {skipped}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
                <MinusCircle className="size-3" />
                Skipped
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <Button onClick={onRestart} className="gap-2">
              <RotateCcw className="size-4" />
              Restart Quiz
            </Button>
            <Button variant="outline" onClick={onBack} className="gap-2">
              <LayoutGrid className="size-4" />
              All Quizzes
            </Button>
          </div>
        </div>

        <Separator className="mb-10" />

        {/* Review Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Answer Review
          </h2>

          <div className="space-y-4">
            {quiz.questions.map((q, i) => {
              const userAnswer = answers[i]
              const isCorrect = userAnswer === q.answer
              const isSkipped = userAnswer === ""

              return (
                <Card
                  key={i}
                  className={cn(
                    "border transition-none",
                    isCorrect
                      ? "border-border"
                      : isSkipped
                      ? "border-border"
                      : "border-border"
                  )}
                >
                  <CardContent className="pt-5 pb-5">
                    {/* Question Header */}
                    <div className="flex items-start gap-3 mb-5">
                      <div className="shrink-0 mt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="size-5 text-foreground" />
                        ) : isSkipped ? (
                          <MinusCircle className="size-5 text-muted-foreground/50" />
                        ) : (
                          <XCircle className="size-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground font-medium mb-1">
                          Question {i + 1}
                        </div>
                        <p className="text-sm font-medium text-foreground leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="pl-8 space-y-2">
                      {q.options.map((option, optIdx) => {
                        const isAnswer = option === q.answer
                        const isUserPick = option === userAnswer
                        const isWrongPick = isUserPick && !isAnswer

                        return (
                          <div
                            key={option}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                              isAnswer &&
                                "bg-foreground text-background",
                              isWrongPick &&
                                "bg-muted line-through text-muted-foreground",
                              !isAnswer &&
                                !isWrongPick &&
                                "text-muted-foreground/60"
                            )}
                          >
                            <span
                              className={cn(
                                "flex items-center justify-center size-5 rounded border text-xs font-bold shrink-0",
                                isAnswer
                                  ? "border-background/40 text-background"
                                  : "border-current/30"
                              )}
                            >
                              {optionLetters[optIdx]}
                            </span>
                            <span className="leading-snug">{option}</span>
                            {isAnswer && (
                              <span className="ml-auto text-xs text-background/70 shrink-0">
                                Correct
                              </span>
                            )}
                            {isWrongPick && (
                              <span className="ml-auto text-xs shrink-0">
                                Your answer
                              </span>
                            )}
                          </div>
                        )
                      })}
                      {isSkipped && (
                        <p className="text-xs text-muted-foreground/60 mt-1 pl-1">
                          Not answered
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-10 pt-8 border-t border-border flex items-center justify-center gap-3">
          <Button onClick={onRestart} variant="outline" className="gap-2">
            <RotateCcw className="size-4" />
            Restart Quiz
          </Button>
          <Button onClick={onBack} className="gap-2">
            <LayoutGrid className="size-4" />
            All Quizzes
          </Button>
        </div>
      </div>
    </div>
  )
}
