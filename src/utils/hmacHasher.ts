import crypto from "crypto";
import ENV from "../config/ENV";
export function hashToken(token: string) {
    return crypto
        .createHmac("sha256", ENV.SESSION_SECRET!)
        .update(token)
        .digest("hex");
}