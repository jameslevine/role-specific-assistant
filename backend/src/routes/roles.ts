import { getRoleBySlug, listRoles } from "../controllers/roles";

import express from "express";

export const router = express.Router();

router.get("/", listRoles);
router.get("/:roleSlug", getRoleBySlug);
