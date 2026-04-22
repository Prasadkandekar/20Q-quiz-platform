# 20Q

**20Q** is a fast, responsive, and minimalist Quiz Platform built with React, TypeScript, Vite, and Tailwind CSS. It is designed to offer a clean UI for taking timed multiple-choice assessments.

## Features

- 🧠 **Dynamic Quizzes:** Quizzes are fully data-driven. Simply drop a structured JSON file into the `/public/data/` folder and register it in `quizzes.json` to instantly host a new exam!
- 🌓 **Theming:** Full Light, Dark, and System theme support with a built-in navbar toggle.
- ⏱️ **Timed Assessments:** Each quiz has a customizable configured time limit.
- ⌨️ **Keyboard Navigation:** Navigate questions and select answers using seamless keyboard shortcuts (`1-4` for options, `←/→` for navigation).
- 📱 **Responsive Design:** Beautifully scaled components optimized for all screen sizes using shadcn/ui and Tailwind CSS.
- ✅ **Instant Results:** Immediate score feedback and correct/incorrect answer breakdowns upon completion.

## How to add a Quiz

1. Create a `your-quiz.json` file structured with a `title` and an array of `questions` (each containing `question`, `options`, and `answer`).
2. Add your JSON file to the `public/data/` directory.
3. Register your quiz in the `public/data/quizzes.json` registry with its ID, title, description, question count, and time limit.

## Tech Stack

- **Framework:** React 18 & Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS V4
- **Components:** shadcn/ui & Radix UI
- **Icons:** Lucide React

## Getting Started

1. Clone or download the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.
4. Open the browser to the local host port to begin using the platform.
