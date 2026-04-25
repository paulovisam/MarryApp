/**
 * Provedor de pagamento ativo (servidor).
 *
 * Variáveis (.env do Node / API):
 * - PAYMENT_PROVIDER=abacatepay | asaas  (padrão: abacatepay)
 * - Asaas: ASAAS_API_KEY, opcional ASAAS_API_URL (ex.: https://api-sandbox.asaas.com),
 *   ASAAS_WEBHOOK_TOKEN (header asaas-access-token),
 *   opcional ASAAS_MAX_INSTALLMENT_COUNT (padrão 12, máx. 21)
 * - AbacatePay: ABACATEPAY_API_KEY, ABACATEPAY_WEBHOOK_SECRET (query webhookSecret)
 *
 * Front (Vite): VITE_PAYMENT_PROVIDER=asaas para exigir CPF/CNPJ no checkout;
 *   opcional VITE_ASAAS_MAX_INSTALLMENT_COUNT só para o texto do modal (alinhar com ASAAS_MAX_INSTALLMENT_COUNT).
 */
export function getPaymentProvider() {
    const raw = (process.env.PAYMENT_PROVIDER || 'abacatepay')
        .toLowerCase()
        .trim();
    if (raw === 'asaas') return 'asaas';
    return 'abacatepay';
}
