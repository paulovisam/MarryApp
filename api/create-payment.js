
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const ABACATE_BASE = 'https://api.abacatepay.com/v2';

function abacateHeaders() {
    return {
        Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
    };
}

/**
 * Produto no catálogo AbacatePay (v2) — checkout exige items[].id do produto.
 * externalId inclui preço em centavos para alinhar valor ao presente no app.
 */
async function resolveProductId({ giftId, giftTitle, giftDescription, amount }) {
    const priceCents = Math.round(parseFloat(amount) * 100);
    const externalId = `marryapp_gift_${giftId}_${priceCents}`;

    const listRes = await axios.get(`${ABACATE_BASE}/products/list`, {
        headers: abacateHeaders(),
        params: { externalId, limit: 1 },
    });

    const existing = listRes.data?.data?.[0];
    if (existing?.id) {
        return existing.id;
    }

    const createRes = await axios.post(
        `${ABACATE_BASE}/products/create`,
        {
            externalId,
            name: giftTitle || 'Presente de Casamento',
            price: priceCents,
            currency: 'BRL',
            description:
                giftDescription || `Contribuição para: ${giftTitle || giftId}`,
        },
        { headers: abacateHeaders() }
    );

    const product = createRes.data?.data;
    if (!product?.id) {
        throw new Error(
            createRes.data?.error ||
                'Resposta inválida ao criar produto na AbacatePay'
        );
    }
    return product.id;
}

async function resolveCustomerId(customer) {
    const createRes = await axios.post(
        `${ABACATE_BASE}/customers/create`,
        {
            email: customer.email,
            name: customer.name,
            cellphone: customer.phone || '',
        },
        { headers: abacateHeaders() }
    );

    const cust = createRes.data?.data;
    if (!cust?.id) {
        throw new Error(
            createRes.data?.error ||
                'Resposta inválida ao criar cliente na AbacatePay'
        );
    }
    return cust.id;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { giftId, giftTitle, giftDescription, customer, amount } = req.body;

        const origin =
            req.headers.origin ||
            req.headers.referer?.split('/').slice(0, 3).join('/') ||
            'http://localhost:3000';

        const productId = await resolveProductId({
            giftId,
            giftTitle,
            giftDescription,
            amount,
        });

        let customerId;
        try {
            customerId = await resolveCustomerId(customer);
        } catch (e) {
            console.warn('AbacatePay customer create (opcional):', e.message);
        }

        const checkoutBody = {
            items: [{ id: productId, quantity: 1 }],
            methods: ['PIX', 'CARD'],
            returnUrl: `${origin}/presentes`,
            completionUrl: `${origin}/presentes?status=success`,
            metadata: { giftId: String(giftId) },
        };
        if (customerId) {
            checkoutBody.customerId = customerId;
        }

        const checkoutRes = await axios.post(
            `${ABACATE_BASE}/checkouts/create`,
            checkoutBody,
            { headers: abacateHeaders() }
        );

        console.log('AbacatePay v2 checkout:', JSON.stringify(checkoutRes.data));

        const billing = checkoutRes.data?.data;

        if (!billing?.id || !billing?.url) {
            throw new Error(
                checkoutRes.data?.error ||
                    'Resposta inválida da AbacatePay: ' +
                        JSON.stringify(checkoutRes.data)
            );
        }

        const { data: order, error: dbError } = await supabase
            .from('orders')
            .insert({
                gift_id: giftId,
                customer_name: customer.name,
                customer_cpf: '',
                customer_email: customer.email,
                amount: amount,
                status: 'PENDING',
                asaas_payment_id: billing.id,
                payment_method: 'ABACATEPAY',
                payment_url: billing.url,
                installments: 1,
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database Error:', dbError);
        }

        res.status(200).json({
            orderId: order?.id,
            paymentUrl: billing.url,
        });
    } catch (error) {
        console.error(
            'API Error:',
            error.response?.data || error.message
        );
        res.status(500).json({ error: 'Failed to create payment' });
    }
}
