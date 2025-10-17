import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('id, data')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }
        
        let userData = user.data;
        if (typeof userData === 'string') {
            try {
                userData = JSON.parse(userData);
            } catch (e) {
                console.error('Failed to parse user data from DB for user:', email);
                return res.status(500).json({ error: 'Erro de dados do usuário.' });
            }
        }
        
        if (!userData || !userData.hashedPassword) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }

        const isPasswordValid = await bcrypt.compare(password, userData.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }

        const token = jwt.sign(
            { userId: user.id, email: email },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '7d' }
        );

        return res.status(200).json({ token });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}