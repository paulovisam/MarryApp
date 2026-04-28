/**
 * Infere quantas cotas foram compradas usando amount do pedido e preço unitário
 * do presente — alinha com resolve-gift-quota (valor = unit × qty) sem coluna quota_quantity.
 *
 * @param {unknown} orderAmount
 * @param {unknown} giftUnitPrice - gifts.price por cota
 * @returns {number} inteiro >= 1
 */
export function quotaDeltaFromAmountAndUnitPrice(orderAmount, giftUnitPrice) {
    const amt = Number(orderAmount);
    const unit = Number(giftUnitPrice);
    if (!Number.isFinite(amt) || !Number.isFinite(unit) || unit <= 0) {
        return 1;
    }
    const q = Math.round(amt / unit);
    return Math.max(1, q);
}
