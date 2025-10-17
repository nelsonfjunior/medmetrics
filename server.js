import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

console.log('🔧 Configuração Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Configurada' : 'Não configurada');

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.error('❌ Supabase não configurado! Configure as variáveis de ambiente.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para verificar token
const verifyToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        return decoded;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

// Função para criar dados iniciais do usuário
const createInitialDate = (daysToAdd) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysToAdd);
    return futureDate.toISOString().split('T')[0];
};

const defaultUserData = (email, name, gender = 'other') => {
    let photoUrl = 'https://avatar.iran.liara.run/public';
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

// Rota de login
app.post('/api/auth/login', async (req, res) => {
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
});

// Rota de registro
app.post('/api/auth/register', async (req, res) => {
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
});

// Rota para obter dados do usuário
app.get('/api/data', async (req, res) => {
    const tokenData = verifyToken(req);
    if (!tokenData) {
        return res.status(401).json({ error: 'Acesso não autorizado.' });
    }

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('data')
            .eq('id', tokenData.userId)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const userData = user.data;
        // Security: Never send the password hash to the client
        delete userData.hashedPassword;
        return res.status(200).json(userData);

    } catch (error) {
        console.error('Data handling error:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Rota para atualizar dados do usuário
app.patch('/api/data', async (req, res) => {
    const tokenData = verifyToken(req);
    if (!tokenData) {
        return res.status(401).json({ error: 'Acesso não autorizado.' });
    }

    try {
        const dataToUpdate = req.body;

        if (!dataToUpdate || typeof dataToUpdate !== 'object' || Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ error: 'Dados para atualização inválidos.' });
        }

        // Security: Prevent password from being updated through this endpoint
        delete dataToUpdate.hashedPassword;

        // Fetch current data
        const { data: currentUser, error: fetchError } = await supabase
            .from('users')
            .select('data')
            .eq('id', tokenData.userId)
            .single();

        if (fetchError || !currentUser) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const currentData = currentUser.data || {};
        // Merge data
        const newData = { ...currentData, ...dataToUpdate };
        
        const { error: updateError } = await supabase
            .from('users')
            .update({ 
                data: newData,
                updated_at: new Date().toISOString()
            })
            .eq('id', tokenData.userId);
        
        if (updateError) {
            console.error('Update error:', updateError);
            return res.status(500).json({ error: 'Erro ao atualizar dados.' });
        }
        
        return res.status(200).json({ message: 'Dados atualizados com sucesso.' });

    } catch (error) {
        console.error('Data handling error:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📡 APIs disponíveis:`);
    console.log(`   POST /api/auth/login`);
    console.log(`   POST /api/auth/register`);
    console.log(`   GET  /api/data`);
    console.log(`   PATCH /api/data`);
});
