import type { Express } from "express";
import { db } from "../db";
import { questions, users, userProgress } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Get questions for a lesson
  app.get("/api/questions", async (req, res) => {
    try {
      // First, get one random question from each distinct type
      const baseQuestions = await db.execute(sql`
        WITH RECURSIVE distinct_types AS (
          SELECT DISTINCT type FROM questions
        ),
        random_questions AS (
          SELECT DISTINCT ON (q.type) 
            q.id, q.type, q.question, q.correct_answer as "correctAnswer", 
            q.options, q.explanation, q.difficulty, q.language,
            q.media_url as "mediaUrl", q.media_type as "mediaType"
          FROM questions q
          ORDER BY q.type, RANDOM()
        )
        SELECT * FROM random_questions
        ORDER BY RANDOM()
        LIMIT 5
      `);

      // If we don't have enough questions from distinct types,
      // fill with random questions of any type
      if (baseQuestions.length < 5) {
        const remainingCount = 5 - baseQuestions.length;
        const additionalQuestions = await db.execute(sql`
          SELECT 
            id, type, question, correct_answer as "correctAnswer",
            options, explanation, difficulty, language,
            media_url as "mediaUrl", media_type as "mediaType"
          FROM questions 
          WHERE id NOT IN (${sql.join(baseQuestions.map(q => q.id))})
          ORDER BY RANDOM()
          LIMIT ${remainingCount}
        `);
        
        // Combine and shuffle all questions
        const allQuestions = [...baseQuestions, ...additionalQuestions]
          .sort(() => Math.random() - 0.5);
          
        res.json(allQuestions);
      } else {
        res.json(baseQuestions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Failed to fetch questions" });
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
      res.status(500).json({ error: "Failed to update progress" });
    }
  });
}
