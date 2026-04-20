
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const ABACATE_V1_BILLING_CREATE =
    'https://api.abacatepay.com/v1/billing/create';

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

        const priceCents = Math.round(parseFloat(amount) * 100);
        // OpenAPI v1: mínimo 100 centavos (R$ 1,00) por unidade
        const price = Math.max(100, priceCents);

        const payload = {
            frequency: 'ONE_TIME',
            methods: ['PIX', 'CARD'],
            products: [
                {
                    externalId: String(giftId),
                    name: giftTitle || 'Presente de Casamento',
                    description:
                        giftDescription ||
                        `Contribuição para: ${giftTitle || giftId}`,
                    quantity: 1,
                    price,
                },
            ],
            returnUrl: `${origin}/presentes`,
            completionUrl: `${origin}/presentes?status=success`,
            customer: {
                name: customer.name,
                email: customer.email,
                taxId: customer.taxId || '',
                cellphone: customer.phone || '',
            },
            metadata: { giftId: String(giftId) },
        };

        const response = await axios.post(ABACATE_V1_BILLING_CREATE, payload, {
            headers: {
                Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('AbacatePay v1:', JSON.stringify(response.data));

        if (response.data?.success === false && response.data?.error) {
            throw new Error(String(response.data.error));
        }

        const billing = response.data?.data;

        if (!billing?.id || !billing?.url) {
            throw new Error(
                response.data?.error ||
                    'Resposta inválida da AbacatePay v1: ' +
                        JSON.stringify(response.data)
            );
        }

        const { data: order, error: dbError } = await supabase
            .from('orders')
            .insert({
                gift_id: giftId,
                customer_name: customer.name,
                customer_cpf: customer.taxId || '',
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
        console.error('API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create payment' });
    }
}
