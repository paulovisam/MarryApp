import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function useAdminGifts() {
    const [gifts, setGifts] = useState([]);

    const fetchGifts = async () => {
        const { data } = await supabase.from('gifts').select('*').order('created_at');
        if (data) setGifts(data);
    };

    const addGift = async (gift) => {
        await supabase.from('gifts').insert([gift]);
        fetchGifts();
    };

    const updateGift = async (id, updates) => {
        await supabase.from('gifts').update(updates).eq('id', id);
        fetchGifts();
    };

    const deleteGift = async (id) => {
        await supabase.from('gifts').delete().eq('id', id);
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

    useEffect(() => { fetchRsvps(); }, []);
    return { rsvps, refresh: fetchRsvps };
}
