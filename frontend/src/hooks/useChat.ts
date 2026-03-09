import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../services/apiClient";

interface Citation {
  documentId: string;
  documentName: string;
  excerpt: string;
  pageNumber?: number;
  source: "shared" | "private";
}

interface Message {
  messageId: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  createdAt: string;
}

interface Conversation {
  conversationId: string;
  title: string;
  roleSlug: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

interface ConversationDetail extends Conversation {
  messages: Message[];
}

interface ChatResponse {
  conversationId: string;
  messageId: string;
  response: string;
  citations: Citation[];
  usage: {
    questionsUsedToday: number;
    questionsRemainingToday: number | null;
    tier: string;
  };
}

interface ConversationsResponse {
  conversations: Conversation[];
  lastEvaluatedKey?: string;
}

const CONVERSATIONS_KEY = "conversations";
const CONVERSATION_KEY = "conversation";

export const useConversations = (roleSlug: string) => {
  return useQuery({
    queryKey: [CONVERSATIONS_KEY, roleSlug],
    queryFn: async () => {
      const response = await apiClient.get<ConversationsResponse>(`/${roleSlug}/conversations`);
      return response;
    },
    enabled: !!roleSlug,
  });
};

export const useConversation = (roleSlug: string, conversationId: string) => {
  return useQuery({
    queryKey: [CONVERSATION_KEY, roleSlug, conversationId],
    queryFn: async () => {
      const response = await apiClient.get<ConversationDetail>(
        `/${roleSlug}/conversations/${conversationId}`,
      );
      return response;
    },
    enabled: !!roleSlug && !!conversationId,
  });
};

export const useSendMessage = (roleSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      conversationId,
    }: {
      message: string;
      conversationId?: string;
    }) => {
      const response = await apiClient.post<ChatResponse>(`/${roleSlug}/chat`, {
        message,
        conversationId,
        includePrivateDocs: true,
      });
      return response;
    },
    onSuccess: (data) => {
      // Invalidate conversations list to show new/updated conversation
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY, roleSlug] });
      // Invalidate specific conversation to refresh messages
      queryClient.invalidateQueries({
        queryKey: [CONVERSATION_KEY, roleSlug, data.conversationId],
      });
    },
  });
};

export const useDeleteConversation = (roleSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      await apiClient.delete(`/${roleSlug}/conversations/${conversationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_KEY, roleSlug] });
    },
  });
};
