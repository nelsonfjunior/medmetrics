import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../../lib/supabase';

const createInitialDate = (daysToAdd: number) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysToAdd);
    return futureDate.toISOString().split('T')[0];
};

const defaultUserData = (email: string, name: string, gender: 'male' | 'female') => {
    let photoUrl = 'https://avatar.iran.liara.run/public'; // Default/other
    if (gender === 'male') {
        photoUrl = 'https://avatar.iran.liara.run/public/boy';
    } else if (gender === 'female') {
        photoUrl = 'https://avatar.iran.liara.run/public/girl';
    }

    return {
        profile: {
            name: name,
            email: email,
            photoUrl: photoUrl,
            studyGoal: "Alcançar 85% de acertos em Ginecologia.",
            residencyLocation: "Hospital das Clínicas - USP"
        },
        sessions: [],
        goals: [
            { name: 'Hospital Sírio-Libanês', date: createInitialDate(90) },
            { name: 'Hospital Israelita Albert Einstein', date: createInitialDate(105) },
            { name: 'Hospital das Clínicas da FMUSP', date: createInitialDate(120) },
        ],
        events: [],
        decks: [],
        flashcards: [],
        focusSessions: [],
        portfolioItems: [],
        studyPlanRotation: { subject: null },
        studyPlanProgress: {},
    };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, password, gender } = req.body;

        if (!name || !email || !password || !gender) {
            return res.status(400).json({ error: 'Nome, e-mail, senha e avatar são obrigatórios.' });
        }

        // Check if user already exists
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email);

        if (checkError) {
            console.error('Error checking existing user:', checkError);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }

        if (existingUsers && existingUsers.length > 0) {
            return res.status(409).json({ error: 'Este e-mail já está em uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const initialData = {
            ...defaultUserData(email, name, gender),
            hashedPassword: hashedPassword
        };

        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
                email: email,
                data: initialData
            })
            .select('id')
            .single();

        if (insertError || !newUser) {
            console.error('Error creating user:', insertError);
            return res.status(500).json({ error: 'Erro ao criar usuário.' });
        }

        const token = jwt.sign(
            { userId: newUser.id, email: email },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '7d' }
        );
        
        return res.status(201).json({ token });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}
