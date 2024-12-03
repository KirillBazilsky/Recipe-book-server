export interface ICookieOptions  {
    httpOnly: boolean,
    secure: boolean
    sameSite: "lax" | "strict" | "none",
    maxAge: number, 
}