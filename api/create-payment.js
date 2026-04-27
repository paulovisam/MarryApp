import { getPaymentProvider } from '../src/lib/payment-provider.js';
import { createAbacatePayment } from './lib/create-abacate-payment.js';
import { createAsaasPayment } from './lib/create-asaas-payment.js';
import { createInfinitepayPayment } from './lib/create-infinitepay-payment.js';

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

    const body = req.body;
    if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'JSON inválido ou corpo vazio.' });
    }
    const { giftId, customer, amount } = body;
    if (giftId == null || giftId === '') {
        return res.status(400).json({ error: 'Presente (giftId) é obrigatório.' });
    }
    if (!customer || typeof customer !== 'object') {
        return res.status(400).json({ error: 'Dados do cliente são obrigatórios.' });
    }
    if (amount == null || amount === '' || Number.isNaN(parseFloat(amount))) {
        return res.status(400).json({ error: 'Valor (amount) inválido.' });
    }

    try {
        const provider = getPaymentProvider();
        let result;
        if (provider === 'asaas') {
            result = await createAsaasPayment(body, req);
        } else if (provider === 'infinitepay') {
            result = await createInfinitepayPayment(body, req);
        } else {
            result = await createAbacatePayment(body, req);
        }

        res.status(200).json({
            orderId: result.orderId,
            paymentUrl: result.paymentUrl,
            provider: result.provider,
        });
    } catch (error) {
        console.error('create-payment:', error);
        const msg =
            (error && error.message) || 'Falha ao criar pagamento.';
        const userInput =
            /obrigatório|mínimo|inválido|CPF|Celular|CNPJ|Resposta inválida ao criar/i.test(
                msg
            );
        const config =
            /não configurada|Variáveis Supabase|Não foi possível registrar o pedido/i.test(
                msg
            );
        const upstream =
            /AbacatePay|Asaas HTTP|Asaas \d|InfinitePay HTTP|HTTP \d{3}/i.test(
                msg
            );
        let status = 500;
        if (userInput) status = 400;
        else if (config) status = 503;
        else if (upstream) status = 502;
        res.status(status).json({ error: msg });
    }
}
