import { useState } from "react"
import { QuizList } from "@/components/QuizList"
import { QuizPlayer } from "@/components/QuizPlayer"
import { QuizResults } from "@/components/QuizResults"
import { Navbar } from "@/components/Navbar"
import type { AppView, Quiz, QuizMeta } from "@/types/quiz"

export default function App() {
  const [view, setView] = useState<AppView>("list")
  const [selectedMeta, setSelectedMeta] = useState<QuizMeta | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<string[]>([])

  const handleSelectQuiz = async (meta: QuizMeta) => {
    const response = await fetch(meta.file)
    const data: Quiz = await response.json()
    setSelectedMeta(meta)
    setQuiz(data)
    setAnswers([])
    setView("quiz")
  }

  const handleComplete = (userAnswers: string[]) => {
    setAnswers(userAnswers)
    setView("results")
  }

  const handleRestart = () => {
    setAnswers([])
    setView("quiz")
  }

  const handleBackToList = () => {
    setView("list")
    setSelectedMeta(null)
    setQuiz(null)
    setAnswers([])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full flex flex-col">
        {view === "list" && <QuizList onSelectQuiz={handleSelectQuiz} />}

        {view === "quiz" && quiz && selectedMeta && (
          <QuizPlayer
            key={`${selectedMeta.id}-${Date.now()}`}
            quiz={quiz}
            meta={selectedMeta}
            onComplete={handleComplete}
            onBack={handleBackToList}
          />
        )}

        {view === "results" && quiz && selectedMeta && (
          <QuizResults
            quiz={quiz}
            meta={selectedMeta}
            answers={answers}
            onRestart={handleRestart}
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  )
}
