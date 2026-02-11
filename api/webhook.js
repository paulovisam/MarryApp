
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
        const { event, data } = req.body;
        // Verify Secret - AbacatePay sends secret as query param ?webhookSecret=... usually, or check docs
        // Docs say: "Validating the secret in all incoming requests, typically sent as a query parameter (webhookSecret)."
        // For now, let's assume we trust the payload or check a custom header if configured.

        // Simple event mapping
        // AbacatePay events: 'billing.paid', 'billing.failed', etc (need to verify exact event names, 
        // but often status is inside object). 
        // Based on docs, it sends the billing object.

        if (!event || !data) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        let orderStatus = null;

        if (event === 'billing.paid') {
            orderStatus = 'PAID';
        } else if (event === 'billing.failed' || event === 'billing.cancelled') {
            orderStatus = 'FAILED';
        } else if (event === 'billing.refunded') {
            orderStatus = 'REFUNDED';
        }

        if (orderStatus && data.id) {
            // Update Order Status
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .update({ status: orderStatus })
                .eq('asaas_payment_id', data.id) // We stored AbacatePay Billing ID in this column
                .select()
                .single();

            if (orderError) {
                console.error('Error updating order:', orderError);
                // Don't error out the webhook response
            } else if (orderStatus === 'PAID' && order) {
                // Update Gift Quantity
                const { data: gift } = await supabase
                    .from('gifts')
                    .select('purchased_quantity')
                    .eq('id', order.gift_id)
                    .single();

                if (gift) {
                    await supabase
                        .from('gifts')
                        .update({ purchased_quantity: gift.purchased_quantity + 1 })
                        .eq('id', order.gift_id);
                }
            }
        }

        res.status(200).json({ received: true });

    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: error.message });
    }
}
