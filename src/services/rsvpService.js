import { supabase } from '../lib/supabaseClient'

export async function createRsvp(rsvpData) {
    // Format message to include guest names if multiple
    let finalMessage = rsvpData.message || '';
    if (rsvpData.guestNames && rsvpData.guestNames.length > 0) {
        const namesList = rsvpData.guestNames.map(n => `- ${n}`).join('\n');
        finalMessage = `Convidados:\n${namesList}\n\nMensagem:\n${finalMessage}`;
    }

    const { data, error } = await supabase
        .from('rsvps')
        .insert([
            {
                name: rsvpData.name,
                guests_count: rsvpData.guestsCount,
                is_present: rsvpData.isPresent,
                message: finalMessage,
                phone: rsvpData.phone
            }
        ])
        .select()

    if (error) throw error
    return data
}

export async function getRsvps() {
    const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching RSVPs:', error)
        return []
    }
    return data
}
