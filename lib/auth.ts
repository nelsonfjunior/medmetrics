import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}

export function verifyToken(req: NextApiRequest): TokenPayload | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        return decoded as TokenPayload;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
