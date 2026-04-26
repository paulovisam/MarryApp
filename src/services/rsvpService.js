import { supabase } from '../lib/supabaseClient'

export async function createRsvp(rsvpData) {
    const phoneDigits = (rsvpData.phone && String(rsvpData.phone).replace(/\D/g, '')) || ''
    let finalMessage = rsvpData.message || '';

    const { data, error } = await supabase
        .from('rsvps')
        .insert([
            {
                name: rsvpData.name,
                guests_count: rsvpData.guestsCount,
                is_present: rsvpData.isPresent,
                message: finalMessage,
                phone: phoneDigits || null
            }
        ])
        .select()

    if (error) throw error
    return data
}
