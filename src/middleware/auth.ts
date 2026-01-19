import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IDecodedToken {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface AuthRequest extends Request {
  doctor?: {
    id: string;
    role: string;
  };
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthRequest;
  
  // Get token from header
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  // Check if token exists
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key') as IDecodedToken;
    
    // Add doctor info to request
    authReq.doctor = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
      return;
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
      return;
    }
    
    res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    
    if (!authReq.doctor) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
      return;
    }
    
    if (!roles.includes(authReq.doctor.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.'
      });
      return;
    }
    
    next();
  };
};

// Optional: Admin only middleware
export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthRequest;
  
  if (!authReq.doctor || authReq.doctor.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Admin access required.'
    });
    return;
  }
  
  next();
};

// Optional: Doctor only middleware (not admin)
export const doctorOnly = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthRequest;
  
  if (!authReq.doctor || authReq.doctor.role !== 'doctor') {
    res.status(403).json({
      success: false,
      message: 'Doctor access required.'
    });
    return;
  }
  
  next();
};

// Export for TypeScript
export type { AuthRequest };