import { createClient } from '@supabase/supabase-js';
import { asaasPost, normalizeBrazilPhone, normalizeDigits } from './asaas-client.js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

/** Máximo de parcelas no cartão (limite prático 12 para todas as bandeiras; Visa/Master podem ir além no Asaas). */
function getMaxInstallmentCount() {
    const n = parseInt(process.env.ASAAS_MAX_INSTALLMENT_COUNT || '12', 10);
    if (!Number.isFinite(n)) return 12;
    return Math.min(21, Math.max(1, n));
}

/**
 * Pagamento via link: UNDEFINED permite Pix à vista; maxInstallmentCount habilita parcelamento no cartão na página do Asaas.
 * @param {object} body - req.body
 * @param {import('http').IncomingMessage} req
 */
export async function createAsaasPayment(body, req) {
    const { giftId, giftTitle, giftDescription, customer, amount } = body;

    if (!process.env.ASAAS_API_KEY?.trim()) {
        throw new Error('ASAAS_API_KEY não configurada no servidor.');
    }
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Variáveis Supabase (VITE_SUPABASE_URL / ANON_KEY) ausentes.');
    }

    const cpfCnpj = normalizeDigits(customer.taxId);
    if (!cpfCnpj || (cpfCnpj.length !== 11 && cpfCnpj.length !== 14)) {
        throw new Error(
            'CPF ou CNPJ válido é obrigatório para pagamento via Asaas.'
        );
    }

    const mobilePhone = normalizeBrazilPhone(customer.phone);
    if (!mobilePhone || mobilePhone.length < 10) {
        throw new Error(
            'Celular válido (DDD + número) é obrigatório para o Asaas.'
        );
    }

    const value = Math.round(parseFloat(amount) * 100) / 100;
    if (!Number.isFinite(value) || value < 1) {
        throw new Error('Valor mínimo para cobrança: R$ 1,00');
    }

    const origin =
        req.headers.origin ||
        req.headers.referer?.split('/').slice(0, 3).join('/') ||
        'http://localhost:3000';

    const maxInstallmentCount = getMaxInstallmentCount();
    const linkPayload = {
        name: `Presente: ${String(giftTitle || 'Casamento').slice(0, 80)}`,
        description: String(
            giftDescription || `Contribuição — ${giftTitle || giftId}`
        ).slice(0, 500),
        value,
        billingType: 'UNDEFINED',
        chargeType: 'DETACHED',
        maxInstallmentCount,
        dueDateLimitDays: 3,
        externalReference: String(giftId),
        notificationEnabled: false,
        // callback: {
        //     successUrl: `https://localhost:3000/presentes?status=success`,
        //     autoRedirect: true,
        // },
    };

    const link = await asaasPost('/v3/paymentLinks', linkPayload);
    const linkId = link?.id != null ? String(link.id) : null;
    const payUrl = link?.url;

    if (!linkId || !payUrl) {
        throw new Error(
            'Resposta inválida ao criar link de pagamento no Asaas (sem id ou url).'
        );
    }

    const { data: order, error: dbError } = await supabase
        .from('orders')
        .insert({
            gift_id: giftId,
            customer_name: customer.name,
            customer_cpf: cpfCnpj,
            customer_email: customer.email,
            amount: amount,
            status: 'PENDING',
            asaas_payment_id: linkId,
            payment_method: 'ASAAS',
            payment_url: payUrl,
            installments: maxInstallmentCount,
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
        paymentUrl: payUrl,
        provider: 'asaas',
    };
}
