import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const ABACATE_V1_BILLING_CREATE =
    'https://api.abacatepay.com/v1/billing/create';

/**
 * @param {object} body - req.body
 * @param {import('http').IncomingMessage} req
 */
export async function createAbacatePayment(body, req) {
    const {
        giftId,
        giftTitle,
        giftDescription,
        customer,
        amount,
        quantity,
        unitPrice,
    } = body;
    const qty = Math.max(1, Math.floor(Number(quantity)) || 1);
    const unitCents = Math.round(parseFloat(unitPrice) * 100);
    const pricePerUnitCents = Math.max(1, unitCents);

    if (!process.env.ABACATEPAY_API_KEY?.trim()) {
        throw new Error('ABACATEPAY_API_KEY não configurada no servidor.');
    }
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Variáveis Supabase (VITE_SUPABASE_URL / ANON_KEY) ausentes.');
    }

    const origin =
        req.headers.origin ||
        req.headers.referer?.split('/').slice(0, 3).join('/') ||
        'http://localhost:3000';

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
                quantity: qty,
                price: pricePerUnitCents,
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
        metadata: { giftId: String(giftId), quotaQuantity: String(qty) },
    };

    const abacateRes = await fetch(ABACATE_V1_BILLING_CREATE, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    let responseData = {};
    try {
        const text = await abacateRes.text();
        if (text.trim()) {
            responseData = JSON.parse(text);
        }
    } catch {
        responseData = {};
    }

    if (!abacateRes.ok) {
        console.error(
            'AbacatePay HTTP:',
            abacateRes.status,
            JSON.stringify(responseData)
        );
        throw new Error(
            responseData?.error ||
                responseData?.message ||
                `AbacatePay ${abacateRes.status}`
        );
    }

    if (responseData?.success === false && responseData?.error) {
        throw new Error(String(responseData.error));
    }

    const billing = responseData?.data;

    if (!billing?.id || !billing?.url) {
        throw new Error(
            responseData?.error ||
                'Resposta inválida da AbacatePay v1: ' +
                    JSON.stringify(responseData)
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
        throw new Error(
            `Não foi possível registrar o pedido: ${dbError.message || 'erro Supabase'}`
        );
    }

    return {
        orderId: order?.id,
        paymentUrl: billing.url,
        provider: 'abacatepay',
    };
}
