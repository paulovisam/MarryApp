import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const PAID_EVENTS = new Set(['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED']);
const FAIL_EVENTS = new Set([
    'PAYMENT_OVERDUE',
    'PAYMENT_DELETED',
]);

/** Pedido gravado com id do link; webhook traz payment.id e payment.paymentLink. */
function orderMatchOrFilter(payment) {
    const payId = payment.id;
    const linkId = payment.paymentLink;
    if (linkId != null && linkId !== '') {
        return `asaas_payment_id.eq.${payId},asaas_payment_id.eq.${String(linkId)}`;
    }
    return `asaas_payment_id.eq.${payId}`;
}

function parseJsonBody(reqBody) {
    if (Buffer.isBuffer(reqBody)) {
        return JSON.parse(reqBody.toString('utf8'));
    }
    if (typeof reqBody === 'string') {
        return JSON.parse(reqBody);
    }
    if (typeof reqBody === 'object' && reqBody !== null) {
        return reqBody;
    }
    throw new Error('Invalid body');
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
        if (expectedToken != null && expectedToken !== '') {
            const token =
                req.headers['asaas-access-token'] ||
                req.headers['Asaas-Access-Token'];
            if (token !== expectedToken) {
                console.warn('Asaas webhook: token inválido');
                return res.status(401).json({ error: 'Unauthorized' });
            }
        }

        let payload;
        try {
            payload = parseJsonBody(req.body);
        } catch {
            return res.status(400).json({ error: 'Invalid JSON body' });
        }

        const event = payload.event;
        const payment = payload.payment;

        if (!event || !payment || typeof payment !== 'object') {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const paymentId = payment.id;
        if (!paymentId) {
            return res.status(400).json({ error: 'Missing payment id' });
        }

        const orFilter = orderMatchOrFilter(payment);

        if (PAID_EVENTS.has(event)) {
            const billingType = payment.billingType || 'ASAAS';
            const { data: updatedRows, error: orderError } = await supabase
                .from('orders')
                .update({
                    status: 'PAID',
                    payment_method: billingType,
                })
                .eq('status', 'PENDING')
                .or(orFilter)
                .select('id, gift_id');

            if (orderError) {
                console.error('Error updating order:', orderError);
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
        } else if (event === 'PAYMENT_REFUNDED') {
            const { error: orderError } = await supabase
                .from('orders')
                .update({ status: 'REFUNDED' })
                .or(orFilter);
            if (orderError) {
                console.error('Error updating order:', orderError);
            }
        } else if (FAIL_EVENTS.has(event)) {
            const { error: orderError } = await supabase
                .from('orders')
                .update({ status: 'FAILED' })
                .eq('status', 'PENDING')
                .or(orFilter);
            if (orderError) {
                console.error('Error updating order:', orderError);
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Asaas Webhook Error:', error);
        res.status(500).json({ error: error.message });
    }
}
