import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getAIResponse = async (message) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a task management app called Cognifyz. Help users manage their tasks and productivity."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
    });
    return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (err) {
    console.error("Groq API error:", err.message);
    return "Sorry, AI is unavailable right now.";
  }
};