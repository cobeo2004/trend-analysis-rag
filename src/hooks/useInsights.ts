import { useChat } from "@ai-sdk/react";
import { WorkflowChatTransport } from "@workflow/ai";
import type { UIMessage } from "ai";
import { useCallback, useEffect, useState } from "react";

import type { TrendsFilters } from "@/lib/types";

const STORAGE_KEY = "insights-chat-history";

function loadStoredMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const useInsights = (filters?: TrendsFilters) => {
  const [initialMessages] = useState<UIMessage[]>(loadStoredMessages);

  const transport = new WorkflowChatTransport({
    api: "/api/insights",
    prepareSendMessagesRequest: ({ messages, api, trigger, messageId }) => ({
      api,
      body: { messages, filters },
      trigger,
      messageId,
    }),
  });

  const chat = useChat({ transport, messages: initialMessages });

  useEffect(() => {
    if (chat.messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chat.messages));
      } catch {
        // Storage full or unavailable
      }
    }
  }, [chat.messages]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    chat.setMessages([]);
  }, [chat.setMessages]);

  return { ...chat, clearHistory };
};
