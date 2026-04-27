import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { normalizeBrazilPhone } from './asaas-client.js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const CHECKOUT_LINKS_URL =
    'https://api.infinitepay.io/invoices/public/checkout/links';

function normalizeHandle(raw) {
    let h = String(raw || '').trim();
    if (h.startsWith('$')) h = h.slice(1);
    return h;
}

function buildWebhookUrl() {
    const full = process.env.INFINITEPAY_WEBHOOK_URL?.trim();
    if (full) return full.replace(/\/$/, '');
    const base = process.env.INFINITEPAY_WEBHOOK_BASE_URL?.trim();
    if (base) {
        return `${base.replace(/\/$/, '')}/api/webhook/infinitepay`;
    }
    return null;
}

function extractCheckoutUrl(data) {
    if (!data || typeof data !== 'object') return null;
    return (
        data.link ||
        data.checkout_url ||
        data.url ||
        data.payment_url ||
        data.invoice_url ||
        null
    );
}

/**
 * @param {object} body - req.body
 * @param {import('http').IncomingMessage} req
 */
export async function createInfinitepayPayment(body, req) {
    const handle = normalizeHandle(process.env.INFINITEPAY_HANDLE);
    if (!handle) {
        throw new Error('INFINITEPAY_HANDLE não configurada no servidor.');
    }
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error(
            'Variáveis Supabase (VITE_SUPABASE_URL / ANON_KEY) ausentes.'
        );
    }

    const { giftId, giftTitle, giftDescription, customer, amount } = body;

    const origin =
        req.headers.origin ||
        req.headers.referer?.split('/').slice(0, 3).join('/') ||
        'http://localhost:3000';

    const priceCents = Math.round(parseFloat(amount) * 100);
    const price = Math.max(100, priceCents);

    const orderNsu = randomUUID();

    const payload = {
        handle,
        items: [
            {
                quantity: 1,
                price,
                description: String(
                    giftTitle || giftDescription || 'Presente de Casamento'
                ).slice(0, 500),
            },
        ],
        order_nsu: orderNsu,
        redirect_url: `${origin}/presentes?status=success`,
    };

    const webhookUrl = buildWebhookUrl();
    if (webhookUrl) {
        payload.webhook_url = webhookUrl;
    }

    const custName = customer?.name?.trim();
    const custEmail = customer?.email?.trim();
    if (custName && custEmail) {
        payload.customer = {
            name: custName,
            email: custEmail,
        };
        const phoneDigits = normalizeBrazilPhone(customer?.phone);
        if (phoneDigits && phoneDigits.length >= 10) {
            payload.customer.phone_number = `+55${phoneDigits}`;
        }
    }
    console.log('Link checkout para InfinitePay:', payload);
    const infRes = await fetch(CHECKOUT_LINKS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    let responseData = {};
    try {
        const text = await infRes.text();
        if (text.trim()) {
            responseData = JSON.parse(text);
        }
    } catch {
        responseData = {};
    }

    if (!infRes.ok) {
        console.error(
            'InfinitePay HTTP:',
            infRes.status,
            JSON.stringify(responseData)
        );
        throw new Error(
            responseData?.message ||
                responseData?.error ||
                `InfinitePay HTTP ${infRes.status}`
        );
    }

    const paymentUrl = extractCheckoutUrl(responseData);
    if (!paymentUrl) {
        throw new Error(
            'Resposta inválida da InfinitePay (sem link de checkout): ' +
                JSON.stringify(responseData)
        );
    }

    const { data: order, error: dbError } = await supabase
        .from('orders')
        .insert({
            gift_id: giftId,
            customer_name: customer.name,
            customer_cpf: String(customer.taxId || '').replace(/\D/g, ''),
            customer_email: customer.email,
            amount: amount,
            status: 'PENDING',
            asaas_payment_id: orderNsu,
            payment_method: 'INFINITEPAY',
            payment_url: paymentUrl,
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
        paymentUrl,
        provider: 'infinitepay',
    };
}
