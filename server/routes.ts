import type { Express } from "express";
import { db } from "../db";
import { questions, users, userProgress, type Question } from "@db/schema";
import { eq, sql } from "drizzle-orm";

interface QuestionResult {
  [key: string]: unknown;
  id: number;
  type: string;
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string | null;
  difficulty: number;
  language: string;
  mediaUrl: string | null;
  mediaType: string | null;
}

export function registerRoutes(app: Express) {
  // Get questions for a lesson
  app.get("/api/questions", async (req, res) => {
    try {
      const { unit } = req.query;
      const questions = await db.execute<QuestionResult>(sql`
        WITH RECURSIVE distinct_types AS (
          SELECT DISTINCT type FROM questions
          WHERE unit = ${unit || 'beginner'}
        ),
        random_questions AS (
          SELECT DISTINCT ON (q.type) 
            q.id, q.type, q.question, q.correct_answer as "correctAnswer", 
            q.options, q.explanation, q.difficulty, q.language,
            q.media_url as "mediaUrl", q.media_type as "mediaType",
            q.unit
          FROM questions q
          WHERE unit = ${unit || 'beginner'}
          ORDER BY q.type, RANDOM()
        )
        SELECT * FROM random_questions
        ORDER BY RANDOM()
      `);

      res.json(questions.rows);
    } catch (error) {
      console.error("Error fetching questions:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ 
        error: "Failed to fetch questions",
        details: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Update user progress
  app.post("/api/progress", async (req, res) => {
    const { userId, questionId, correct } = req.body;
    
    try {
      const progress = await db.query.userProgress.findFirst({
        where: eq(userProgress.questionId, questionId)
      });

      if (progress) {
        await db
          .update(userProgress)
          .set({
            attempts: progress.attempts + 1,
            correct: progress.correct + (correct ? 1 : 0),
            lastAttempt: new Date()
          })
          .where(eq(userProgress.id, progress.id));
      } else {
        await db.insert(userProgress).values({
          userId,
          questionId,
          attempts: 1,
          correct: correct ? 1 : 0,
          lastAttempt: new Date()
        });
      }

      res.json({ success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ 
        error: "Failed to update progress",
        details: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Create a new question
  app.post("/api/questions", async (req, res) => {
    try {
      const { type, question, correctAnswer, options, explanation, mediaUrl, difficulty, language } = req.body;

      // Validate required fields
      if (!type || !question || !correctAnswer || !options || !Array.isArray(options)) {
        return res.status(400).json({
          error: "Invalid input",
          details: "Required fields are missing or invalid",
          timestamp: new Date().toISOString()
        });
      }

      // Insert the question
      const result = await db.insert(questions).values({
        type,
        question,
        correctAnswer,
        options,
        explanation: explanation || null,
        mediaUrl: mediaUrl || null,
        mediaType: mediaUrl ? (mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'audio') : null,
        difficulty: difficulty || 1,
        language: language || 'en'
      }).returning();

      res.json(result[0]);
    } catch (error) {
      console.error("Error creating question:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({
        error: "Failed to create question",
        details: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  });
}