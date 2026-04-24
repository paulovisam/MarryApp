import { supabase } from '../lib/supabaseClient'

function formatBrPhoneDisplay(digits) {
    if (!digits) return ''
    if (digits.length === 11) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    }
    if (digits.length === 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }
    return digits
}

export async function createRsvp(rsvpData) {
    const phoneDigits = (rsvpData.phone && String(rsvpData.phone).replace(/\D/g, '')) || ''
    const head = []
    if (phoneDigits) {
        head.push(`Telefone: ${formatBrPhoneDisplay(phoneDigits)}`)
    } else if (rsvpData.email) {
        head.push(`E-mail: ${rsvpData.email}`)
    }

    // Format message to include guest names if multiple
    let finalMessage = rsvpData.message || '';
    if (head.length) {
        finalMessage = [head.join('\n'), finalMessage].filter(Boolean).join('\n\n');
    }
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
                phone: phoneDigits || null
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
