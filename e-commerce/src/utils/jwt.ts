import * as jose from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const generateToken = async (payload: jose.JWTPayload) => 
  await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);

export const verifyToken = async (token: string) => 
  await jose.jwtVerify(token, secret);