import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

function mapCaptureMethod(m) {
    const s = String(m || '').toLowerCase().replace(/-/g, '_');
    if (s === 'pix') return 'PIX';
    if (s === 'credit_card') return 'CREDIT_CARD';
    return m ? String(m).toUpperCase() : 'INFINITEPAY';
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let payload = req.body;
        if (typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            } catch {
                return res.status(400).json({ error: 'Invalid JSON body' });
            }
        }
        if (!payload || typeof payload !== 'object' || Buffer.isBuffer(payload)) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const orderNsu = payload.order_nsu;
        if (orderNsu == null || String(orderNsu).trim() === '') {
            return res.status(400).json({ error: 'Missing order_nsu' });
        }

        const paymentMethod = mapCaptureMethod(payload.capture_method);

        const { data: updatedRows, error: orderError } = await supabase
            .from('orders')
            .update({
                status: 'PAID',
                payment_method: paymentMethod,
            })
            .eq('asaas_payment_id', String(orderNsu))
            .eq('status', 'PENDING')
            .select('id, gift_id');

        if (orderError) {
            console.error('InfinitePay webhook: order update', orderError);
        } else if (updatedRows?.length) {
            const order = updatedRows[0];
            const { data: gift } = await supabase
                .from('gifts')
                .select('purchased_quantity')
                .eq('id', order.gift_id)
                .single();

            if (gift) {
                await supabase
                    .from('gifts')
                    .update({
                        purchased_quantity: gift.purchased_quantity + 1,
                    })
                    .eq('id', order.gift_id);
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('InfinitePay Webhook Error:', error);
        res.status(500).json({ error: error.message });
    }
}
