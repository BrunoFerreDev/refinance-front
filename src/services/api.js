import { isAuthenticated, currentUser } from "./client.js";
import * as auth from "./auth.js";
import * as transactions from "./transactions.js";
import * as loans from "./loans.js";
import * as referees from "./referees.js";
import * as caja from "./caja.js";
import * as canchas from "./canchas.js";

// Re-export named reactive variables/states
export { isAuthenticated, currentUser };

// Combine all methods for the default export
export default {
  ...auth,
  ...transactions,
  ...loans,
  ...referees,
  ...caja,
  ...canchas,
};
