import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const generateToken = (payload: object, secret: string, expiresIn: any) => {
    const token = jwt.sign(payload, secret, { expiresIn })
    return token;
}




export const verifyToken = <T extends JwtPayload>(
    token: string,
    secret: string
): T => {
    try {
        return jwt.verify(token, secret) as T;
    } catch {
        throw new UnauthorizedError("Invalid or expired token");
    }
};