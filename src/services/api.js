import { isAuthenticated, currentUser, isGlobalLoading } from "./client.js";
import * as auth from "./auth.js";
import * as transactions from "./transactions.js";
import * as loans from "./loans.js";
import * as referees from "./referees.js";
import * as caja from "./caja.js";
import * as canchas from "./canchas.js";

// Re-export named reactive variables/states and role helpers
export { isAuthenticated, currentUser, isGlobalLoading };
export { ALLOWED_ROLES, isAuthorizedRole, parseJwtPayload } from "./auth.js";

// Combine all methods for the default export
export default {
  ...auth,
  ...transactions,
  ...loans,
  ...referees,
  ...caja,
  ...canchas,
};
