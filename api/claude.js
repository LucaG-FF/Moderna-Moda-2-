export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, system } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: system || "You are a fashion brand expert. Be concise, creative, bold.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return res.status(200).json({ text: data.content?.[0]?.text || "Error." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to call Claude API" });
  }
}