
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;
        const webhookSecret = req.query.webhookSecret;
        if (
            expectedSecret != null &&
            expectedSecret !== '' &&
            webhookSecret !== expectedSecret
        ) {
            console.log('Invalid webhook secret', expectedSecret, webhookSecret);
            return res.status(401).json({ error: 'Invalid webhook secret' });
        }

        let rawBody;
        if (Buffer.isBuffer(req.body)) {
            rawBody = req.body.toString('utf8');
        } else if (typeof req.body === 'string') {
            rawBody = req.body;
        } else {
            rawBody = JSON.stringify(req.body);
        }

        let payload;
        try {
            payload = JSON.parse(rawBody);
        } catch {
            return res.status(400).json({ error: 'Invalid JSON body' });
        }

        const { event, data } = payload;

        if (!event || !data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const billingId = data.billing.id;
        console.log('data', data);
        if (!billingId) {
            return res.status(400).json({ error: 'Missing billing id' });
        }

        let orderStatus = null;
        if (event === 'billing.paid') {
            orderStatus = 'PAID';
        } else if (
            event === 'billing.failed' ||
            event === 'billing.cancelled' ||
            event === 'billing.canceled'
        ) {
            orderStatus = 'FAILED';
        } else if (event === 'billing.refunded') {
            orderStatus = 'REFUNDED';
        }

        const paymentMethod = data.payment?.method ?? null;

        if (orderStatus) {
            const updatePayload = { status: orderStatus };
            if (paymentMethod) {
                updatePayload.payment_method = paymentMethod;
            }

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .update(updatePayload)
                .eq('asaas_payment_id', billingId)
                .select()
                .single();

            if (orderError) {
                console.error('Error updating order:', orderError);
            } else if (orderStatus === 'PAID' && order) {
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
        }
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: error.message });
    }
}
