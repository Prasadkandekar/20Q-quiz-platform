export interface QuizMeta {
  id: string
  title: string
  description: string
  questionCount: number
  timeLimit: number
  file: string
}

export interface Question {
  question: string
  options: string[]
  answer: string
}

export interface Quiz {
  title: string
  questions: Question[]
}

export type AppView = 'list' | 'quiz' | 'results'
