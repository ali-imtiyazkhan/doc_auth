import express from "express";
import cors from "cors";
import { questions } from "./db/questions.js";
import { studyData } from "./db/studyData.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// In-memory store for user quiz history
interface QuizAttempt {
  id: string;
  timestamp: string;
  type: "quick" | "comprehensive" | "domain";
  domainId?: number;
  score: number;
  total: number;
  percentage: number;
  domainBreakdown: { [key: number]: { correct: number; total: number } };
}

const attemptsHistory: QuizAttempt[] = [];

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Endpoint: Health Check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Endpoint: GET /api/v1/domains
// Returns all domains, sections, study data
app.get("/api/v1/domains", (req, res) => {
  res.json(studyData);
});

// Endpoint: GET /api/v1/questions
// Query params:
// - domain: number (1-5)
// - section: string (e.g. "1.1")
// - limit: number (e.g. 10 or 30 for random selection)
app.get("/api/v1/questions", (req, res) => {
  const { domain, section, limit } = req.query;

  let filtered = [...questions];

  if (domain) {
    const domainNum = parseInt(domain as string, 10);
    if (!isNaN(domainNum)) {
      filtered = filtered.filter((q) => q.domain === domainNum);
    }
  }

  if (section) {
    filtered = filtered.filter((q) => q.section === section);
  }

  // Shuffle and limit if requested
  if (limit) {
    const limitNum = parseInt(limit as string, 10);
    if (!isNaN(limitNum)) {
      filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, limitNum);
    }
  }

  res.json(filtered);
});

// Endpoint: POST /api/v1/quiz/submit
// Payload: {
//   type: "quick" | "comprehensive" | "domain",
//   domainId?: number,
//   answers: { questionId: string; selectedOptionText: string }[]
// }
app.post("/api/v1/quiz/submit", (req, res) => {
  const { type, domainId, answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    res.status(400).json({ error: "Invalid payload: 'answers' must be an array" });
    return;
  }

  let correctCount = 0;
  const totalCount = answers.length;
  const gradedQuestions = [];

  const domainBreakdown: { [key: number]: { correct: number; total: number } } = {};

  // Initialize breakdown for domains
  for (let i = 1; i <= 5; i++) {
    domainBreakdown[i] = { correct: 0, total: 0 };
  }

  for (const ans of answers) {
    const q = questions.find((item) => item.id === ans.questionId);
    if (!q) continue;

    const selectedOption = q.options.find((opt) => opt.text === ans.selectedOptionText);
    const correctOption = q.options.find((opt) => opt.correct);

    const isCorrect = selectedOption ? selectedOption.correct : false;

    if (isCorrect) {
      correctCount++;
      domainBreakdown[q.domain]!.correct++;
    }
    domainBreakdown[q.domain]!.total++;

    gradedQuestions.push({
      questionId: q.id,
      domain: q.domain,
      section: q.section,
      scenario: q.scenario,
      question: q.question,
      selected: ans.selectedOptionText || "No Answer",
      isCorrect,
      correctAnswer: correctOption ? correctOption.text : "",
      options: q.options, // Return all options with explanations
    });
  }

  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const attempt: QuizAttempt = {
    id: `attempt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    type: type || "quick",
    domainId: domainId ? parseInt(domainId, 10) : undefined,
    score: correctCount,
    total: totalCount,
    percentage,
    domainBreakdown,
  };

  attemptsHistory.push(attempt);

  res.json({
    attemptId: attempt.id,
    timestamp: attempt.timestamp,
    score: correctCount,
    total: totalCount,
    percentage,
    domainBreakdown,
    gradedQuestions,
  });
});

// Endpoint: GET /api/v1/analytics
// Returns historical attempts, scores, weakest domains
app.get("/api/v1/analytics", (req, res) => {
  if (attemptsHistory.length === 0) {
    res.json({
      totalAttempts: 0,
      averagePercentage: 0,
      domainStats: {},
      weakestDomains: [],
      history: [],
    });
    return;
  }

  const totalAttempts = attemptsHistory.length;
  const sumPercentage = attemptsHistory.reduce((sum, item) => sum + item.percentage, 0);
  const averagePercentage = Math.round(sumPercentage / totalAttempts);

  // Cumulative domain statistics
  const cumulativeDomain: { [key: number]: { correct: number; total: number; pct: number } } = {};
  for (let i = 1; i <= 5; i++) {
    cumulativeDomain[i] = { correct: 0, total: 0, pct: 0 };
  }

  attemptsHistory.forEach((attempt) => {
    for (let i = 1; i <= 5; i++) {
      cumulativeDomain[i]!.correct += attempt.domainBreakdown[i]?.correct || 0;
      cumulativeDomain[i]!.total += attempt.domainBreakdown[i]?.total || 0;
    }
  });

  // Calculate percentages
  const weakDomainsList: { id: number; pct: number }[] = [];

  for (let i = 1; i <= 5; i++) {
    const d = cumulativeDomain[i]!;
    d.pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
    if (d.total > 0) {
      weakDomainsList.push({ id: i, pct: d.pct });
    }
  }

  // Sort domains by percentage to find the weakest (lowest score first)
  const weakestDomains = weakDomainsList
    .sort((a, b) => a.pct - b.pct)
    .map((item) => ({
      domainId: item.id,
      score: item.pct,
    }));

  res.json({
    totalAttempts,
    averagePercentage,
    domainStats: cumulativeDomain,
    weakestDomains,
    history: attemptsHistory.slice(-10), // Limit history to last 10 attempts
  });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 DocAuth Prep API listening on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Domains: http://localhost:${PORT}/api/v1/domains`);
  console.log(`=================================================`);
});
