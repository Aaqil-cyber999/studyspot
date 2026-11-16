import { getUserById } from "../db/queries.js";
import type { AuthRequest } from "../middleware/auth.js";

export type UniversityScope = { universityId?: string | null };

/**
 * University-admins are confined to their own university; super-admins are
 * not. `universityId` is omitted for super-admins (meaning: unrestricted) and
 * `null` for a university-admin with no linked university (meaning: no access
 * to any university-scoped data).
 */
export async function universityScopeFor(req: AuthRequest): Promise<UniversityScope> {
  if (req.user!.role === "university-admin") {
    const user = await getUserById(req.user!.userId, "university-admin");
    return { universityId: user && "universityId" in user ? user.universityId : null };
  }
  return {};
}
