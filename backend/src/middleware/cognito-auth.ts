import {
  AWS_REGION,
  COGNITO_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from "../constants";
import { NextFunction, Request, Response } from "express";

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { HTTP_STATUS } from "../constants";

const verifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: COGNITO_CLIENT_ID,
});

export const cognitoAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "No token provided", code: "UNAUTHORIZED" });
    }

    const payload = await verifier.verify(token);
    req.user = {
      sub: payload.sub,
      email: (payload as Record<string, unknown>).email as string,
      "cognito:username": payload["cognito:username"] as string,
      "cognito:groups": payload["cognito:groups"] as string[] | undefined,
      token_use: payload.token_use,
      auth_time: payload.auth_time,
      iss: payload.iss,
      exp: payload.exp,
      iat: payload.iat,
    };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: "Invalid token", code: "UNAUTHORIZED" });
  }
};
