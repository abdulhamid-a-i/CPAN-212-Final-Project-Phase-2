import { verifyKeycloakAccessToken } from "../services/keycloakService.js";
import { findOrProvisionUserFromKeycloak } from "../services/userProvisioningService.js";

function getRoleNames(roles) {
  return (roles || []).map((role) => {
    if (typeof role === "string") {
      return role;
    }

    if (role && typeof role === "object" && role.name) {
      return role.name;
    }

    return String(role);
  });
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return "";
  }
  return header.slice("Bearer ".length).trim();
}

export async function authenticateWithKeycloak(req) {
  const token = getBearerToken(req);

  if (!token) {
    return null;
  }

  const identity = await verifyKeycloakAccessToken(token);
  const localUser = await findOrProvisionUserFromKeycloak(identity);

  const normalizedUser =
    typeof localUser.toObject === "function"
      ? localUser.toObject()
      : localUser;

  return {
    ...normalizedUser,
    _id: String(localUser._id),
    roles: getRoleNames(localUser.roles),
    authSource: "KEYCLOAK",
    keycloakSub: identity.sub
  };
}