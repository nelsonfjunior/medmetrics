import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../lib/auth';
import { supabase } from '../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const tokenData = verifyToken(req);
    if (!tokenData) {
        return res.status(401).json({ error: 'Acesso não autorizado.' });
    }

    try {
        if (req.method === 'GET') {
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
        }

        if (req.method === 'PATCH') {
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
        }

        return res.status(405).json({ error: 'Method Not Allowed' });
    } catch (error) {
        console.error('Data handling error:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}
