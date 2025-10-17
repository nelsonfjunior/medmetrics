import { supabase } from './supabase-client';

// Função simples para gerar hash (apenas para desenvolvimento)
const simpleHash = (password: string): string => {
    return btoa(password + 'salt'); // Muito básico, apenas para demo
};

// Função simples para verificar hash
const verifyHash = (password: string, hash: string): boolean => {
    return simpleHash(password) === hash;
};

// Função simples para gerar JWT (apenas para desenvolvimento)
const simpleJWT = (payload: any): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const data = btoa(JSON.stringify(payload));
    const signature = btoa('signature');
    return `${header}.${data}.${signature}`;
};

// Função para criar dados iniciais do usuário
const createInitialDate = (daysToAdd: number) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysToAdd);
    return futureDate.toISOString().split('T')[0];
};

const defaultUserData = (email: string, name: string, gender: 'male' | 'female' | 'other' = 'other') => {
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

// Função de login
export const loginUser = async (email: string, password: string) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, data')
            .eq('email', email)
            .single();

        if (error || !user) {
            throw new Error('Usuário ou senha inválidos.');
        }
        
        let userData = user.data;
        if (typeof userData === 'string') {
            try {
                userData = JSON.parse(userData);
            } catch (e) {
                throw new Error('Erro de dados do usuário.');
            }
        }
        
        if (!userData || !userData.hashedPassword) {
            throw new Error('Usuário ou senha inválidos.');
        }

        const isPasswordValid = verifyHash(password, userData.hashedPassword);
        if (!isPasswordValid) {
            throw new Error('Usuário ou senha inválidos.');
        }

        const token = simpleJWT({ userId: user.id, email: email });

        return { token, userData };
    } catch (error) {
        throw error;
    }
};

// Função de registro
export const registerUser = async (name: string, email: string, password: string, gender: 'male' | 'female' | 'other' = 'other') => {
    try {
        // Check if user already exists
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email);

        if (checkError) {
            throw new Error('Erro interno do servidor.');
        }

        if (existingUsers && existingUsers.length > 0) {
            throw new Error('Este e-mail já está em uso.');
        }

        const hashedPassword = simpleHash(password);
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
            throw new Error('Erro ao criar usuário.');
        }

        const token = simpleJWT({ userId: newUser.id, email: email });
        
        return { token, userData: initialData };
    } catch (error) {
        throw error;
    }
};

// Função para obter dados do usuário
export const getUserData = async (userId: string) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('data')
            .eq('id', userId)
            .single();

        if (error || !user) {
            throw new Error('Usuário não encontrado.');
        }

        const userData = user.data;
        // Security: Never send the password hash to the client
        delete userData.hashedPassword;
        return userData;
    } catch (error) {
        throw error;
    }
};

// Função para atualizar dados do usuário
export const updateUserData = async (userId: string, updates: any) => {
    try {
        // Fetch current data
        const { data: currentUser, error: fetchError } = await supabase
            .from('users')
            .select('data')
            .eq('id', userId)
            .single();

        if (fetchError || !currentUser) {
            throw new Error('Usuário não encontrado.');
        }

        const currentData = currentUser.data || {};
        // Merge data
        const newData = { ...currentData, ...updates };
        
        const { error: updateError } = await supabase
            .from('users')
            .update({ 
                data: newData,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        
        if (updateError) {
            throw new Error('Erro ao atualizar dados.');
        }
        
        return newData;
    } catch (error) {
        throw error;
    }
};
