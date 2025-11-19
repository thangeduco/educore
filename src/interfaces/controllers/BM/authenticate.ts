import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Thiếu token' });

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).userId = decoded.sub;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
