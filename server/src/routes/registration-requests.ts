import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { createRegistrationRequest, getRegistrationRequests, updateRegistrationRequestStatus } from "../db/queries.js";

const router = Router();

// GET /registration-requests — admin only
router.get(
  "/",
  requireAuth,
  requireRole("super-admin", "university-admin"),
  async (_req, res) => {
    const requests = await getRegistrationRequests();
    res.json(requests);
  }
);

// POST /registration-requests — submit a new request
router.post(
  "/",
  async (req, res) => {
    const { university, email, applicant } = req.body as { university: string; email: string; applicant?: string };
    if (!university || !email) {
      return res.status(400).json({ error: "University and email are required" });
    }
    const reqData = { university, email, applicant };
    const registrationReq = await createRegistrationRequest(reqData);
    res.status(201).json(registrationReq);
  }
);

// PUT /registration-requests/:id/status — approve/reject
router.put(
  "/:id/status",
  requireAuth,
  requireRole("super-admin"),
  async (req, res) => {
    const { status } = req.body as { status: "Pending" | "Approved" | "Rejected" };
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const request = await updateRegistrationRequestStatus(req.params.id, status);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(request);
  }
);

export default router;
