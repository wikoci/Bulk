import { Mistral } from "@mistralai/mistralai";
import { Agent } from "@mastra/core/agent";
import { createMistral } from "@ai-sdk/mistral";
import { extractHtmlContent, getMailContent } from "./utils";
const apiKey = process.env.MISTRAL_API_KEY;
import { consola } from "consola";
const client = new Mistral({ apiKey: apiKey });

// mastra
const mistralModel = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const memoryLetter = [];
async function MistralAgentLetter(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let controller = new AbortController();
    let timeout = setTimeout(() => {
      controller.abort(); // Annule la requête si trop longue
    }, 10000);
    try {
      const letter = await getMailContent();
      const chatResponse = await client.chat.complete(
        {
          model: "mistral-small-latest",
          messages: [
            {
              role: "system",
              content: `
               You are a helpful assistant to generate HTML content based on user request. .
               Your capabilities :
               - Generate html content based on user request
               - Your answer must be html content without additional comment
                E.g: 
                <html>
                    <body>
                    </body>
                </html>
             `,
            },
            {
              role: "user",
              content: `
            ${process.env.LETTER_PROMPT}
            Ma lettre :
            ${letter}
          `,
            },
          ],
        },
        {
          timeoutMs: 10000,
        }
      );
      let c = chatResponse?.choices[0]?.message?.content || "";
      // console.log(c);
      c = extractHtmlContent(c);
      clearTimeout(timeout);
      // consola.success("> auto-letter generated OK ✅");
      return resolve(c);
    } catch (err: any) {
      consola.error(err?.message);
      reject(err);
    }
  });
}
async function MastraAgentLetter() {
  let controller = new AbortController();
  const myAgent = new Agent({
    name: "Agent letter",
    instructions:
      "You are a helpful assistant to generate HTML content based on user request.",
    model: mistralModel("mistral-small-latest"),
  });
  const contentHtmlBase = await getMailContent();

  var c = await myAgent.generate(
    [
      {
        role: "user",
        content: String(process.env.LETTER_PROMPT || ""),
      },
    ],
    {
      abortSignal: controller.signal,
    }
  );
  let content = extractHtmlContent(c?.text || "");
  return content;
}

export { MistralAgentLetter, MastraAgentLetter };
