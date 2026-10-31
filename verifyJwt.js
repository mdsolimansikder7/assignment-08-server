
import { createRemoteJWKSet, jwtVerify } from "jose";


const JWKS = createRemoteJWKSet(new URL(process.env.JWKS_URL));


export async function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Please log in to continue." });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);

    const email = payload.email;
    const name = payload.name;

    if (!email) {
      return res.status(401).json({ success: false, message: "Please log in to continue." });
    }

    req.user = { email, name: name || "" };
    next();
  } catch (error) {
    if (error && error.code === "ERR_JWT_EXPIRED") {
      return res.status(401).json({ success: false, message: "Your session has expired." });
    }
    return res.status(401).json({ success: false, message: "Please log in to continue." });
  }
}

export function notFound(req, res) {
  res.status(404).json({ success: false, message: "Route not found." });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong on the server." });
}