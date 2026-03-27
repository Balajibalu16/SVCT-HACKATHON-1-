import { NextResponse } from 'next/server';
import { generateText, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

// Simple rules engine mock for urgency classification
function checkRedFlags(text: string) {
  const flags = [
    'chest pain', 'trouble breathing', 'stroke', 'seizure', 'fainting', 
    'suicidal', 'severe allergic', 'heavy bleeding'
  ];
  return flags.some(flag => text.toLowerCase().includes(flag));
}

const SYSTEM_PROMPT = `You are SymptomSense AI, a cautious health intake chatbot for a symptom checker website.

Your role:
- Help users describe symptoms clearly
- Ask short follow-up questions
- Suggest possible causes only
- Never give a confirmed diagnosis
- Never claim to be a doctor
- Never prescribe medication doses
- Always remind users this is informational only

Rules:
- Ask only ONE question at a time
- Keep responses brief, calm, and easy to understand
- Use simple language
- If information is missing, ask for it before giving possibilities
- Mention only possible conditions, never certainty
- Always include an urgency level when enough detail is collected

Urgency levels:
- Self-care
- See a doctor soon
- Urgent care
- Emergency

Collect this information step by step:
1. Main symptom
2. How long it has been happening
3. Severity: mild, moderate, or severe
4. Related symptoms
5. Age group
6. Relevant medical conditions
7. Medicines, pregnancy, or other important context when relevant

Emergency rule:
If the user mentions chest pain, severe trouble breathing, stroke signs, seizures, loss of consciousness, suicidal thoughts, severe allergic reaction, or heavy bleeding, immediately say this may be a medical emergency and advise calling emergency services or going to the nearest emergency department.

When enough information is collected, respond in exactly this format:

Main possibilities:
- [Condition 1]
- [Condition 2]
- [Condition 3]

Urgency:
- [One urgency level]

Next step:
- [Short practical guidance]

Disclaimer:
- This is not a diagnosis. Please consult a licensed medical professional for personal medical advice.

At the very end, add:
[ASSESSMENT_READY]`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const lastMessage = messages[messages.length - 1];
    
    // Safety hook: intercept dangerous inputs early if detected in the route layer
    if (lastMessage && lastMessage.role === 'user' && checkRedFlags(lastMessage.content)) {
      return new Response(
        "I'm detecting severe symptoms that require immediate medical attention. PLEASE CALL 911 (or your local emergency number) OR GO TO THE NEAREST EMERGENCY ROOM IMMEDIATELY. This could be a medical emergency.",
        { status: 200 }
      );
    }

    const result = await streamText({
      model: openai('gpt-4-turbo'),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.2, // Be conservative
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
