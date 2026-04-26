import { supabase } from '../lib/supabaseClient'

export async function getGifts() {
    const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('active', true)
        .order('price', { ascending: true })

    if (error) {
        console.error('Error fetching gifts:', error)
        return []
    }
    return data
}
