/**
 * Provedor de pagamento ativo (partilhado cliente + servidor).
 *
 * Servidor (Node): PAYMENT_PROVIDER=abacatepay | asaas | infinitepay
 * Cliente (Vite): VITE_PAYMENT_PROVIDER (mesmo valor, exposto ao bundle)
 *
 * Mantido em src/lib para o Vite não confundir com o proxy /api → backend.
 */
export function getPaymentProvider() {
    let raw =
        (typeof process !== 'undefined' && process.env?.PAYMENT_PROVIDER) || '';
    if (
        !raw &&
        typeof import.meta !== 'undefined' &&
        import.meta.env &&
        import.meta.env.VITE_PAYMENT_PROVIDER
    ) {
        raw = import.meta.env.VITE_PAYMENT_PROVIDER;
    }
    if (!raw) raw = 'abacatepay';
    raw = String(raw).toLowerCase().trim();
    if (raw === 'asaas') return 'asaas';
    if (raw === 'infinitepay') return 'infinitepay';
    return 'abacatepay';
}
