import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import type { PgTable } from "drizzle-orm/pg-core";

export const units = pgTable("units", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  difficulty: integer("difficulty").notNull(),
  language: text("language").notNull(),
  order: integer("order").notNull(),
  prerequisiteId: integer("prerequisite_id").references(() => units.id),
});

export const questions = pgTable("questions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  type: text("type").notNull(),
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  options: jsonb("options").notNull(),
  explanation: text("explanation"),
  difficulty: integer("difficulty").notNull(),
  language: text("language").notNull(),
  mediaUrl: text("media_url"),
  mediaType: text("media_type")
});

export const questionUnits = pgTable("question_units", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  questionId: integer("question_id").notNull().references(() => questions.id),
  unitId: integer("unit_id").notNull().references(() => units.id),
});

export const userProgress = pgTable("user_progress", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  questionId: integer("question_id").notNull().references(() => questions.id),
  correct: integer("correct").notNull().default(0),
  attempts: integer("attempts").notNull().default(0),
  lastAttempt: timestamp("last_attempt").notNull().defaultNow()
});

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
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

export const insertUnitSchema = createInsertSchema(units);
export const selectUnitSchema = createSelectSchema(units);
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type Unit = z.infer<typeof selectUnitSchema>;

export const insertQuestionUnitSchema = createInsertSchema(questionUnits);
export const selectQuestionUnitSchema = createSelectSchema(questionUnits);
export type InsertQuestionUnit = z.infer<typeof insertQuestionUnitSchema>;
export type QuestionUnit = z.infer<typeof selectQuestionUnitSchema>;
