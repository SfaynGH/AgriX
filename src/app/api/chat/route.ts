"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    // Get the Gemini Flash model (free and fast)
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });

    // Optional: add a system prompt at the beginning
    const systemPrompt = {
      role: "user",
      parts: [
        {
          text:
            "You are a helpful assistant specialized in plant monitoring and care. " +
            "Provide accurate advice about plant health, watering schedules, pest control, " +
            "nutrient deficiencies, and general plant care. Be concise but thorough in your responses. " +
            "If a user shares a plant image, acknowledge that you've seen it and provide relevant advice " +
            "based on what might be visible in such an image.",
        },
      ],
    };

    // Format all user/model messages
    const contents = [
      systemPrompt,
      ...messages.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    ];

    // Generate content using Gemini Flash
    const result = await model.generateContent({ contents });
    const response = result.response.text();

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
