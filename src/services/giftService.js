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

export async function purchaseGift(giftId, quantityToBuy = 1) {
    // First, fetch the current state to ensure stock
    const { data: gift, error: fetchError } = await supabase
        .from('gifts')
        .select('purchased_quantity, total_quantity')
        .eq('id', giftId)
        .single()

    if (fetchError) throw fetchError

    if (gift.purchased_quantity + quantityToBuy > gift.total_quantity) {
        throw new Error('Estoque insuficiente para este item.')
    }

    // Update the purchased quantity
    const { data, error } = await supabase
        .from('gifts')
        .update({ purchased_quantity: gift.purchased_quantity + quantityToBuy })
        .eq('id', giftId)
        .select()

    if (error) throw error
    return data
}
