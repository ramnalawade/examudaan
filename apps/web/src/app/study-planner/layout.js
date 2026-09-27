// app/study-planner/layout.js
export const metadata = {
  title: 'AI Smart Study Planner — Custom Exam Preparation Schedule | ExamUdaan',
  description: 'Generate a personalized, day-by-day study schedule for MPSC, Police Bharti, Talathi, SSC, and Banking exams. Features adaptive catch-up, PYQ targets, and daily checklist.',
  keywords: 'MPSC study planner, exam study timetable generator, police bharti study schedule, UPSC study plan, daily study checklist',
  alternates: {
    canonical: 'https://examudaan.in/study-planner',
  },
  openGraph: {
    title: 'AI Smart Study Planner — ExamUdaan.in',
    description: 'Personalized day-by-day exam preparation schedule with adaptive recalculation and daily targets.',
    url: 'https://examudaan.in/study-planner',
    type: 'website',
  },
}

export default function StudyPlannerLayout({ children }) {
  return children
}
