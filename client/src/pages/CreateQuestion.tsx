import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const questionTypes = {
  "read-select": "Read and Select",
  "fill-blanks": "Fill in the Blanks",
  "read-complete": "Read and Complete",
  "complete-sentence": "Complete the Sentence",
  "highlight-answer": "Highlight the Answer",
  "read-aloud": "Read Aloud",
  "listen-type": "Listen and Type",
  "interactive-reading": "Interactive Reading",
  "write-photo": "Write About Photo",
  "interactive-writing": "Interactive Writing",
  "listen-speak": "Listen and Speak",
  "speak-photo": "Speak About Photo",
  "read-speak": "Read and Speak",
  "identify-idea": "Identify the Main Idea",
  "title-passage": "Title the Passage",
  "complete-passage": "Complete the Passage",
  "interactive-listening": "Interactive Listening",
  "listen-respond": "Listen and Respond",
  "summarize-conversation": "Summarize the Conversation"
};

const getOptionsHelp = (type: string) => {
  switch(type) {
    case "read-select":
    case "read-complete":
    case "identify-idea":
      return "Enter multiple choice options separated by commas";
    case "fill-blanks":
      return "Enter the word or phrase to fill in the blank";
    case "write-photo":
    case "speak-photo":
      return "Enter image URL followed by vocabulary words, separated by commas";
    case "listen-type":
    case "listen-speak":
      return "Enter audio text followed by key phrases, separated by commas";
    case "highlight-answer":
      return "Enter text to highlight";
    case "interactive-writing":
    case "summarize-conversation":
      return "Enter key points separated by commas";
    default:
      return "Enter options separated by commas";
  }
};

const getCorrectAnswerLabel = (type: string) => {
  switch(type) {
    case "write-photo":
    case "speak-photo":
    case "interactive-writing":
    case "summarize-conversation":
      return "Sample Answer";
    default:
      return "Correct Answer";
  }
};

interface Unit {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  language: string;
  order: number;
  prerequisiteId: number | null;
}

const formSchema = z.object({
  unitId: z.coerce.number().min(1, "Unit is required"),
  type: z.string().min(1, "Question type is required"),
  question: z.string().min(1, "Question text is required"),
  correctAnswer: z.string().optional().transform(val => val || ""),
  options: z.string().refine((val) => {
    const options = val.split(",").map(opt => opt.trim());
    return options.length >= 2;
  }, "At least two options are required"),
  explanation: z.string().optional(),
  mediaUrl: z.string().optional(),
  difficulty: z.coerce.number().min(1).max(5),
  language: z.string().min(1, "Language is required")
}).refine((data) => {
  if (["write-photo", "speak-photo"].includes(data.type)) {
    return !!data.mediaUrl;
  }
  return true;
}, {
  message: "Media URL is required for photo-based questions",
  path: ["mediaUrl"]
});

export default function CreateQuestion() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    fetch("/api/units")
      .then(res => res.json())
      .then(data => setUnits(data))
      .catch(() => toast({
        title: "Error",
        description: "Failed to load units",
        variant: "destructive",
      }));
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      question: "",
      correctAnswer: "",
      options: "",
      explanation: "",
      mediaUrl: "",
      difficulty: 1,
      language: "en"
    },
  });

  const selectedType = form.watch("type");
  const needsMediaUrl = ["write-photo", "speak-photo"].includes(selectedType);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          options: values.options.split(",").map(opt => opt.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to create question");

      toast({
        title: "Success",
        description: "Question created successfully",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create Question</h1>
          <p className="text-muted-foreground">
            Add a new question to the learning platform
          </p>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(questionTypes).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the question text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Options</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={getOptionsHelp(selectedType)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="correctAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getCorrectAnswerLabel(selectedType)}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter the ${getCorrectAnswerLabel(selectedType).toLowerCase()}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explanation (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter an explanation for the answer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {needsMediaUrl && (
                <FormField
                  control={form.control}
                  name="mediaUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter URL for photo/audio"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty (1-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Question"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation("/")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
