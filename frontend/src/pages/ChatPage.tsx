import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { MAX_MESSAGE_LENGTH, ROLE_BRANDS } from "../constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useConversation,
  useConversations,
  useDeleteConversation,
  useSendMessage,
} from "../hooks/useChat";
import { useNavigate, useParams } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../hooks/useAuth";

const DRAWER_WIDTH = 280;

const ChatPage = () => {
  const { roleSlug = "", conversationId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [message, setMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(
    conversationId,
  );
  const [pendingMessages, setPendingMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string; citations?: unknown[] }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const brand = ROLE_BRANDS[roleSlug] || { name: "TradeAssist", icon: "🏗️", color: "#2563EB" };

  // Queries
  const { data: conversationsData, isLoading: loadingConversations } = useConversations(roleSlug);
  const { data: conversationData } = useConversation(roleSlug, activeConversationId || "");
  const sendMessage = useSendMessage(roleSlug);
  const deleteConversation = useDeleteConversation(roleSlug);

  // Derive messages from server data + pending optimistic messages
  const localMessages = useMemo(() => {
    if (conversationData?.messages) {
      return conversationData.messages.map((m) => ({
        role: m.role,
        content: m.content,
        citations: m.citations,
      }));
    }
    return pendingMessages;
  }, [conversationData, pendingMessages]);

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, scrollToBottom]);

  const handleSend = async () => {
    if (!message.trim() || sendMessage.isPending) return;

    const userMessage = message.trim();
    setMessage("");

    // Optimistically add user message
    setPendingMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await sendMessage.mutateAsync({
        message: userMessage,
        conversationId: activeConversationId,
      });

      // Add assistant response
      setPendingMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.response,
          citations: response.citations,
        },
      ]);

      // If new conversation, update the active ID
      if (!activeConversationId) {
        setActiveConversationId(response.conversationId);
        navigate(`/${roleSlug}/chat/${response.conversationId}`, { replace: true });
      }
    } catch {
      setPendingMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(undefined);
    setPendingMessages([]);
    navigate(`/${roleSlug}/chat`);
  };

  const handleSelectConversation = (convId: string) => {
    setActiveConversationId(convId);
    navigate(`/${roleSlug}/chat/${convId}`);
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteConversation.mutateAsync(convId);
    if (activeConversationId === convId) {
      handleNewConversation();
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ color: brand.color, fontWeight: 700 }}>
              {brand.icon} {brand.name}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleNewConversation}
            sx={{ mb: 2 }}
          >
            New Chat
          </Button>
        </Box>
        <Divider />
        <List sx={{ flex: 1, overflow: "auto", px: 1 }}>
          {loadingConversations ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            conversationsData?.conversations?.map((conv) => (
              <ListItemButton
                key={conv.conversationId}
                selected={activeConversationId === conv.conversationId}
                onClick={() => handleSelectConversation(conv.conversationId)}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemText
                  primary={conv.title}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontSize: "0.875rem",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteConversation(conv.conversationId, e)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            ))
          )}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={() => navigate(`/${roleSlug}/documents`)}
            sx={{ mb: 1 }}
          >
            My Documents
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" onClick={() => navigate("/")} startIcon={<ArrowBackIcon />}>
              Home
            </Button>
            <Button size="small" onClick={logout}>
              Sign Out
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar variant="dense">
            <IconButton edge="start" onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {brand.icon} {brand.name}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {localMessages.length === 0 && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="h3" sx={{ mb: 2 }}>
                {brand.icon}
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                How can I help you today?
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, maxWidth: 500, textAlign: "center" }}>
                Ask me anything about {roleSlug} regulations, best practices, or compliance in the
                UK.
              </Typography>
            </Box>
          )}

          {localMessages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "100%",
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: "75%",
                  bgcolor: msg.role === "user" ? brand.color : "background.paper",
                  color: msg.role === "user" ? "white" : "text.primary",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {msg.content}
                </Typography>
                {msg.citations &&
                  (msg.citations as Array<{ documentName: string; excerpt: string }>).length >
                    0 && (
                    <Box sx={{ mt: 1.5, pt: 1, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                      <Typography variant="caption" fontWeight={600}>
                        Sources:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                        {(msg.citations as Array<{ documentName: string; excerpt: string }>).map(
                          (citation, i) => (
                            <Tooltip key={i} title={citation.excerpt || ""} arrow>
                              <Chip
                                label={citation.documentName}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem" }}
                              />
                            </Tooltip>
                          ),
                        )}
                      </Box>
                    </Box>
                  )}
              </Paper>
            </Box>
          ))}

          {sendMessage.isPending && (
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Thinking...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={`Ask ${brand.name} a question...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
              disabled={sendMessage.isPending}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!message.trim() || sendMessage.isPending}
              sx={{
                bgcolor: brand.color,
                color: "white",
                "&:hover": { bgcolor: brand.color, opacity: 0.9 },
                "&:disabled": { bgcolor: "action.disabledBackground" },
                width: 48,
                height: 48,
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            {message.length}/{MAX_MESSAGE_LENGTH} characters
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
