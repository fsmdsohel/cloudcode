export interface TokenPayload {
  id: string;
  email: string;
}

// Add strict type checking
export interface UserForToken {
  id: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type TokenType = "access" | "refresh";

export interface TokenError {
  code:
    | "TOKEN_EXPIRED"
    | "TOKEN_INVALID"
    | "TOKEN_MISSING"
    | "TOKEN_BLACKLISTED";
  message: string;
}
