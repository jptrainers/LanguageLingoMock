import type { Express } from "express";
import { db } from "../db";
import { questions, users, userProgress } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Get questions for a lesson
  app.get("/api/questions", async (req, res) => {
    try {
      const allQuestions = await db.query.questions.findMany({
        limit: 5,
        orderBy: () => sql`RANDOM()`
      });
      res.json(allQuestions);
    } catch (error) {
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
