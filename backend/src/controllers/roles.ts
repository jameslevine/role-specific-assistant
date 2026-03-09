import { Request, Response } from "express";
import { getAvailableRoles, getRoleConfig } from "../constants/roles";

import { HTTP_STATUS } from "../constants";

export const listRoles = async (_req: Request, res: Response) => {
  try {
    const roles = getAvailableRoles().map((role) => ({
      slug: role.slug,
      brandName: role.brandName,
      tagline: role.tagline,
      icon: role.icon,
      primaryColor: role.primaryColor,
      available: role.available,
    }));

    res.status(HTTP_STATUS.OK).json({ roles });
  } catch (error) {
    console.error("Error listing roles:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error listing roles" });
  }
};

export const getRoleBySlug = async (req: Request, res: Response) => {
  try {
    const { roleSlug } = req.params;
    const role = getRoleConfig(roleSlug);

    if (!role) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Role not found" });
    }

    // Don't expose system prompt to public endpoint
    const { systemPrompt, knowledgeBaseId, ...publicRole } = role;

    res.status(HTTP_STATUS.OK).json(publicRole);
  } catch (error) {
    console.error("Error fetching role:", error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching role" });
  }
};
