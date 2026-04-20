
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

function timingSafeEqualBase64(a, b) {
    const ba = Buffer.from(a, 'utf8');
    const bb = Buffer.from(b, 'utf8');
    if (ba.length !== bb.length) {
        return false;
    }
    return crypto.timingSafeEqual(ba, bb);
}

function verifyWebhookHmac(rawBody, signatureHeader, secret) {
    if (!secret || !signatureHeader) {
        return false;
    }
    const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody, 'utf8')
        .digest('base64');
    return timingSafeEqualBase64(expected, signatureHeader);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const webhookSecret = req.query.webhookSecret;
        if (webhookSecret !== process.env.ABACATEPAY_WEBHOOK_SECRET) {
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

        const sig =
            req.headers['x-webhook-signature'] ||
            req.headers['X-Webhook-Signature'];
        if (
            process.env.ABACATEPAY_WEBHOOK_SECRET &&
            sig &&
            !verifyWebhookHmac(
                rawBody,
                sig,
                process.env.ABACATEPAY_WEBHOOK_SECRET
            )
        ) {
            return res.status(401).json({ error: 'Invalid webhook signature' });
        }

        let payload;
        try {
            payload = JSON.parse(rawBody);
        } catch {
            return res.status(400).json({ error: 'Invalid JSON body' });
        }

        const { event, data } = payload;

        if (!event || !data) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const checkout = data.checkout;
        const transparent = data.transparent;
        const entityId = checkout?.id ?? transparent?.id;

        let orderStatus = null;
        if (
            event === 'checkout.completed' ||
            event === 'transparent.completed'
        ) {
            orderStatus = 'PAID';
        } else if (
            event === 'checkout.refunded' ||
            event === 'transparent.refunded'
        ) {
            orderStatus = 'REFUNDED';
        } else if (
            event === 'checkout.disputed' ||
            event === 'checkout.lost' ||
            event === 'transparent.disputed' ||
            event === 'transparent.lost'
        ) {
            orderStatus = 'FAILED';
        }

        const paymentMethod =
            data.payerInformation?.method ??
            checkout?.methods?.[0] ??
            transparent?.methods?.[0] ??
            null;

        if (orderStatus && entityId) {
            const updatePayload = { status: orderStatus };
            if (paymentMethod) {
                updatePayload.payment_method = paymentMethod;
            }

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .update(updatePayload)
                .eq('asaas_payment_id', entityId)
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

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: error.message });
    }
}
