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
        const { error } = await supabase.from('gifts').delete().eq('id', id);
        if (error) {
            console.error('Error deleting gift:', error);
            alert('Erro ao excluir presente: ' + error.message);
        } else {
            fetchGifts();
        }
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

    useEffect(() => { fetchRsvps(); }, []);
    return { rsvps, refresh: fetchRsvps };
}
