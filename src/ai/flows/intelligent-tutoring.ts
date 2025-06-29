'use server';

/**
 * @fileOverview Provides AI-powered intelligent tutoring for math problems.
 *
 * - intelligentTutoring - A function that orchestrates the tutoring process.
 * - IntelligentTutoringInput - The input type for the intelligentTutoring function.
 * - IntelligentTutoringOutput - The return type for the intelligentTutoring function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentTutoringInputSchema = z.object({
  problem: z.string().describe('The math problem to be explained.'),
  gradeLevel: z.string().describe('The grade level of the student.'),
  topic: z.string().describe('The math topic the problem belongs to.'),
});
export type IntelligentTutoringInput = z.infer<typeof IntelligentTutoringInputSchema>;

const IntelligentTutoringOutputSchema = z.object({
  detailedExplanation: z
    .string()
    .describe(
      'A detailed explanation that includes a step-by-step solution, alternative methods, and real-life context examples. Use newlines to separate paragraphs and sections, and use headings like "### Step-by-Step Solution:".'
    ),
  videoExplanationUrl: z
    .string()
    .url()
    .describe(
      'A URL to a relevant YouTube video that explains the math concept visually. The video should be from a reputable educational channel.'
    )
    .optional(),
});
export type IntelligentTutoringOutput = z.infer<
  typeof IntelligentTutoringOutputSchema
>;

export async function intelligentTutoring(input: IntelligentTutoringInput): Promise<IntelligentTutoringOutput> {
  return intelligentTutoringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentTutoringPrompt',
  input: {schema: IntelligentTutoringInputSchema},
  output: {schema: IntelligentTutoringOutputSchema},
  prompt: `You are an expert and friendly math tutor. Your goal is to explain the solution to a math problem in a way that is easy for a student to understand, helping them learn the underlying concepts, not just get the answer.

You will provide a detailed, well-structured explanation that includes a step-by-step solution, alternative methods for solving the problem, and relatable real-life context examples.

Additionally, you MUST search for and provide a relevant, high-quality YouTube video that visually explains the math concept. The video should be from a reputable educational channel (like Khan Academy, Organic Chemistry Tutor, etc.). It is very important that you verify the URL is a valid, working YouTube link. If you cannot find a suitable and working video link, you MUST leave the 'videoExplanationUrl' field empty. Do not provide a broken or irrelevant link.

**Student Information:**
- Grade Level: {{{gradeLevel}}}
- Topic: {{{topic}}}

**Problem to Explain:**
{{{problem}}}

**Explanation Structure:**
Provide your entire formatted explanation within the 'detailedExplanation' field of the output schema. Use Markdown for formatting and structure your response with the following sections EXACTLY as specified below:

### Step-by-Step Solution
- Start with a clear statement of the goal.
- Break down the solution into a simple, numbered list of logical steps.
- Explain the "why" behind each step. For example, instead of just saying "find the common denominator," explain *why* a common denominator is needed.
- Clearly state the final answer at the end of the steps.

### Alternative Methods
- If applicable, briefly describe another valid way to approach the problem. This could be a different formula, a visual method, or a logical shortcut.
- Explain why this alternative method also works and when it might be useful.
- If no alternative method is practical or common for this type of problem, you can state "The step-by-step method is the most common and straightforward way to solve this problem."

### Real-Life Context
- Provide a simple, relatable real-world example where this math concept is used.
- The example should be easy for a student at the given grade level to understand. For instance, connect fractions to sharing a pizza, or percentages to a discount on a video game.
- Briefly explain how the math helps solve the real-life problem.
`,
});

const intelligentTutoringFlow = ai.defineFlow(
  {
    name: 'intelligentTutoringFlow',
    inputSchema: IntelligentTutoringInputSchema,
    outputSchema: IntelligentTutoringOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
        console.error("Intelligent Tutoring Error:", error);
        // Return a user-friendly error message within the expected schema.
        return {
            detailedExplanation: "I'm sorry, I'm currently unable to generate an explanation due to high demand. Please try again in a few moments.",
        };
    }
  }
);
