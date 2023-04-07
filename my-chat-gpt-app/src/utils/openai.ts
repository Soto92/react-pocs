import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function getAnswer(question: string): Promise<string | undefined> {
  if (!configuration.apiKey) {
    console.log(
      "OpenAI API key not configured, please follow instructions in README.md"
    );
    return ' ';
  }

  if (question.trim().length === 0) {
    console.log("Please enter a valid question");
    return ' ';
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      temperature: 0.6,
      max_tokens: 800
    });
    
    return completion.data.choices[0].text || ' ';
  } catch (error: any) {
    console.log(error?.message);
  }
}

function generatePrompt(question: string): string {
  return question;
}
