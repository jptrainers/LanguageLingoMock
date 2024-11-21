import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const questions = pgTable("questions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: text("type").notNull(), // read-select, fill-blanks, read-aloud, etc.
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  options: jsonb("options").notNull(), // For read-select: multiple choice options, for speak-photo: [imageUrl, ...vocabulary]
  explanation: text("explanation"),
  difficulty: integer("difficulty").notNull(),
  language: text("language").notNull(),
  mediaUrl: text("media_url"), // For audio/image based questions
  mediaType: text("media_type"), // audio/image
  unit: text("unit").notNull().default('beginner')
});

export const userProgress = pgTable("user_progress", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  questionId: integer("question_id").notNull().references(() => questions.id),
  correct: integer("correct").notNull().default(0),
  attempts: integer("attempts").notNull().default(0),
  lastAttempt: timestamp("last_attempt").notNull().defaultNow()
});

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  currentStreak: integer("current_streak").notNull().default(0),
  totalScore: integer("total_score").notNull().default(0),
  lastActive: timestamp("last_active").notNull().defaultNow()
});

export const insertQuestionSchema = createInsertSchema(questions);
export const selectQuestionSchema = createSelectSchema(questions);
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = z.infer<typeof selectQuestionSchema>;

export const insertUserProgressSchema = createInsertSchema(userProgress);
export const selectUserProgressSchema = createSelectSchema(userProgress);
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = z.infer<typeof selectUserProgressSchema>;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
