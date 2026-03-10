import { router as chatRouter } from "./routes/chat";
import { router as conversationsRouter } from "./routes/conversations";
import cors from "cors";
import { router as documentsRouter } from "./routes/documents";
import { errorHandler } from "./middleware/error-handler";
import express from "express";
import { router as rolesRouter } from "./routes/roles";
import serverless from "serverless-http";
import { router as subscriptionsRouter } from "./routes/subscriptions";
import { router as usersRouter } from "./routes/users";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Amz-Date",
      "X-Api-Key",
      "X-Amz-Security-Token",
    ],
    maxAge: 300,
  }),
);

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// Public routes (no auth required)
app.use("/v1/roles", rolesRouter);

// Authenticated routes
app.use("/v1/subscriptions", subscriptionsRouter);
app.use("/v1/users", usersRouter);
app.use("/v1/:roleSlug/chat", chatRouter);
app.use("/v1/:roleSlug/conversations", conversationsRouter);
app.use("/v1/:roleSlug/documents", documentsRouter);

app.use(errorHandler);

export const handler = serverless(app);
