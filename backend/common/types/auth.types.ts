// Global Express Request interface extension
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
        permissions: string[];
      };
    }
  }
}

// Export for explicit imports
export interface AuthenticatedRequest extends Express.Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    permissions: string[];
  };
}
