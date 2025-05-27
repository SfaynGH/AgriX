"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Loader2, Leaf, Upload, X } from "lucide-react";
import Container from "@/components/container";
import ReactMarkdown from "react-markdown";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QuickPrompt {
  text: string;
  icon: React.ReactNode;
}

export default function PlantAssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your plant monitoring assistant. How can I help with your plants today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts: QuickPrompt[] = [
    { text: "My plant leaves are turning yellow", icon: <Leaf size={16} /> },
    { text: "Best watering schedule for tomatoes", icon: <Leaf size={16} /> },
    { text: "How to test soil pH", icon: <Leaf size={16} /> },
    { text: "Optimal lighting for indoor plants", icon: <Leaf size={16} /> },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Hide quick prompts when there's more than one message
    if (messages.length > 1 && showQuickPrompts) {
      setShowQuickPrompts(false);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent, promptText?: string) => {
    e.preventDefault();
    const messageText = promptText || input;
    if (!messageText.trim()) return;

    let content = messageText;
    if (imagePreview) {
      content = `[Image of plant uploaded] ${messageText}`;
    }

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setImagePreview(null);
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        messages: [...messages, userMessage],
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.message },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className={`grid grid-cols-1 border-b border-border overflow-hidden transition-all duration-500 ease-in-out ${showQuickPrompts ? "max-h-96" : "max-h-0"}`}>
        <Container className="py-4">
          <div className="grid grid-cols-1 gap-3 laptop:grid-cols-2">
            {quickPrompts.map((prompt, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-muted transition-colors"
                onClick={(e) => handleSubmit(e, prompt.text)}
              >
                <CardContent className="flex items-center gap-2 p-4">
                  <span className="text-green-600">{prompt.icon}</span>
                  <span>{prompt.text}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>

      <div 
        className="flex-1 overflow-y-auto border-b border-border"
        style={{
          scrollbarWidth: "none",          /* Firefox */
          msOverflowStyle: "none",         /* IE and Edge */
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;                 /* Chrome, Safari, Opera */
          }
        `}</style>
        <Container className="py-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <Card
                key={index}
                className={`max-w-3xl ${
                  message.role === "user"
                    ? "ml-auto bg-blue-100"
                    : "bg-green-50"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-sm text-black">
                    {message.role === "user" ? "You" : "Plant Assistant"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-black">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            ))}
            {isLoading && (
              <Card className="max-w-3xl bg-green-50">
                <CardHeader>
                  <CardTitle className="text-sm">Plant Assistant</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center text-gray-500 gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Analyzing your plant question...</span>
                </CardContent>
              </Card>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Container>
      </div>

      <div className="border-t border-border">
        <Container className="py-4">
          {imagePreview && (
            <div className="mb-4">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Plant image upload preview"
                  className="h-20 w-auto rounded-md object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1"
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="text-green-600 hover:text-green-700 p-2"
              title="Upload plant image"
            >
              <Upload size={20} />
            </Button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your plants..."
              className="flex-1 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-green-600 text-white p-2 hover:bg-green-700 disabled:opacity-50"
            >
              <Send size={20} />
            </Button>
          </form>
        </Container>
      </div>
    </div>
  );
}
