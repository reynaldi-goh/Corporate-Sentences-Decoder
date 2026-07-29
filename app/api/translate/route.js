import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { text, direction } = await req.json();

    if (!text || !direction) {
      return Response.json(
        { error: "Missing text or direction" },
        { status: 400 }
      );
    }

    const systemPrompt =
      direction === "toHuman"
        ? "You translate absurdly corporate, LinkedIn-influencer-style jargon into blunt, plain, everyday human language. Be concise — one or two short sentences max. Do not explain, just translate."
        : "You translate plain, blunt human sentences into the most unnecessarily corporate, LinkedIn-influencer-style jargon possible. Be over-the-top professional and buzzword-heavy but keep it to one or two sentences. Do not explain, just translate.";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    const result = completion.choices[0]?.message?.content?.trim() || "";

    return Response.json({ result });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}