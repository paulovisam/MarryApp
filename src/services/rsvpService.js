import { supabase } from '../lib/supabaseClient'

export async function createRsvp(rsvpData) {
    const { data, error } = await supabase
        .from('rsvps')
        .insert([
            {
                name: rsvpData.name,
                guests_count: rsvpData.guestsCount,
                is_present: rsvpData.isPresent,
                message: rsvpData.message,
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
