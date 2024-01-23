declare namespace Express {
  export interface Request {
    auth?: { userid: string; iat: number; exp: number };
  }
}
