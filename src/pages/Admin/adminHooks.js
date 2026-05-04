import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function useAdminGifts() {
    const [gifts, setGifts] = useState([]);

    const fetchGifts = async () => {
        const { data } = await supabase.from('gifts').select('*').order('created_at');
        if (data) setGifts(data);
    };

    const addGift = async (gift) => {
        const { error } = await supabase.from('gifts').insert([gift]);
        if (error) {
            console.error('Error adding gift:', error);
            alert('Erro ao adicionar presente: ' + error.message);
        } else {
            fetchGifts();
        }
    };

    const updateGift = async (id, updates) => {
        const { error } = await supabase.from('gifts').update(updates).eq('id', id);
        if (error) {
            console.error('Error updating gift:', error);
            alert('Erro ao atualizar presente: ' + error.message);
        } else {
            fetchGifts();
        }
    };

    const deleteGift = async (id) => {
        // Com migração ON DELETE SET NULL (ver supabase/migrations), basta apagar o gift:
        // o Postgres coloca orders.gift_id a NULL nos pedidos existentes.
        const { error } = await supabase.from('gifts').delete().eq('id', id);
        if (error) {
            console.error('Error deleting gift:', error);
            const hint =
                /foreign key|23503/i.test(String(error.message || error.code || ''))
                    ? '\n\nSe o erro citar foreign key: no Supabase SQL Editor, rode o script em supabase/migrations que define gift_id como opcional e ON DELETE SET NULL em orders. As políticas RLS em orders podem também bloquear exclusões pelo cliente anon — nesse caso ajuste políticas ou use desassociação via SQL.'
                    : '';
            alert('Erro ao excluir presente: ' + error.message + hint);
            return;
        }
        fetchGifts();
    };

    useEffect(() => { fetchGifts(); }, []);

    return { gifts, addGift, updateGift, deleteGift, refresh: fetchGifts };
}

export function useAdminRsvps() {
    const [rsvps, setRsvps] = useState([]);

    const fetchRsvps = async () => {
        const { data } = await supabase.from('rsvps').select('*').order('created_at', { ascending: false });
        if (data) setRsvps(data);
    };

    const updateRsvp = async (id, updates) => {
        const { error } = await supabase.from('rsvps').update(updates).eq('id', id);
        if (error) {
            console.error('Error updating rsvp:', error);
            alert('Erro ao atualizar convidado: ' + error.message);
            return false;
        }
        fetchRsvps();
        return true;
    };

    useEffect(() => { fetchRsvps(); }, []);
    return { rsvps, refresh: fetchRsvps, updateRsvp };
}
