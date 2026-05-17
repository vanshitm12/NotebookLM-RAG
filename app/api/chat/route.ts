import { NextRequest, NextResponse } from "next/server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { CHAT_MODEL, getEmbeddings, getQdrantConfig } from "@/lib/rag";

export const runtime = "nodejs";
export const maxDuration = 60;

type RetrievedChunk = {
  index: number;
  pageNumber: number | null;
  content: string;
};

async function gradeChunk(
  question: string,
  content: string,
  llm: ChatGoogleGenerativeAI,
): Promise<"relevant" | "irrelevant"> {
  const response = await llm.invoke([
    {
      role: "system",
      content: `You are a relevance grader. Given a question and a document chunk, respond with ONLY the word "relevant" or "irrelevant". No other text.`,
    },
    {
      role: "user",
      content: `Question: ${question}\n\nDocument chunk:\n${content}`,
    },
  ]);
  const text =
    typeof response.content === "string"
      ? response.content.trim().toLowerCase()
      : "";
  return text.includes("irrelevant") ? "irrelevant" : "relevant";
}

export async function POST(req: NextRequest) {
  try {
    const { docId, question } = (await req.json()) as {
      docId?: string;
      question?: string;
    };

    if (!docId || !question?.trim()) {
      return NextResponse.json(
        { error: "docId and question are required" },
        { status: 400 },
      );
    }

    const store = await QdrantVectorStore.fromExistingCollection(
      getEmbeddings(),
      { ...getQdrantConfig(), collectionName: docId },
    );

    const retriever = store.asRetriever({ k: 4 });
    const docs = await retriever.invoke(question);

    const llm = new ChatGoogleGenerativeAI({
      model: CHAT_MODEL,
      temperature: 0,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const gradingResults = await Promise.all(
      docs.map((d) => gradeChunk(question, d.pageContent, llm)),
    );

    const filteredDocs = docs.filter((_, i) => gradingResults[i] === "relevant");

    if (filteredDocs.length === 0) {
      return NextResponse.json({
        answer:
          "I couldn't find relevant information in the document to answer your question.",
        sources: [],
      });
    }

    const context: RetrievedChunk[] = filteredDocs.map((d, i) => ({
      index: i + 1,
      pageNumber:
        (d.metadata?.loc as { pageNumber?: number } | undefined)?.pageNumber ??
        (d.metadata?.page as number | undefined) ??
        null,
      content: d.pageContent,
    }));

    const systemPrompt = `You are an AI assistant that answers user questions based STRICTLY on the provided context from a single document.
Rules:
- Answer ONLY using the provided context. Do NOT use outside knowledge.
- If the answer is not in the context, reply: "I couldn't find this in the document."
- When you use information from a chunk that has a pageNumber, cite it like "(page 3)".
- Be concise and direct.
Context (JSON array of chunks):
${JSON.stringify(context, null, 2)}`;

    const response = await llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ]);

    const answer =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    return NextResponse.json({
      answer,
      sources: context.map((c) => ({
        pageNumber: c.pageNumber,
        snippet: c.content.slice(0, 240),
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Chat failed";
    console.error("[chat]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
