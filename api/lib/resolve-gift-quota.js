import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

function maxQuotasPerOrder() {
    const n = parseInt(process.env.MAX_GIFT_QUOTAS_PER_ORDER || '50', 10);
    if (!Number.isFinite(n) || n < 1) return 50;
    return Math.min(500, n);
}

/**
 * Valida presente ativo, cotas disponíveis e devolve quantidade + valor total (servidor).
 *
 * @param {string|number} giftId
 * @param {unknown} requestedQuantity - corpo JSON (opcional, default 1)
 * @returns {Promise<{ quantity: number, unitPrice: number, amount: number }>}
 */
export async function resolveGiftQuotaOrder(giftId, requestedQuantity) {
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error(
            'Variáveis Supabase (VITE_SUPABASE_URL / ANON_KEY) ausentes.'
        );
    }

    const { data: gift, error } = await supabase
        .from('gifts')
        .select('id, price, total_quantity, purchased_quantity, active')
        .eq('id', giftId)
        .single();

    if (error || !gift) {
        throw new Error('Presente não encontrado.');
    }
    if (!gift.active) {
        throw new Error('Este presente não está disponível.');
    }

    const unitPrice = Number(gift.price);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        throw new Error('Preço do presente inválido.');
    }

    let qty = Math.floor(Number(requestedQuantity));
    if (!Number.isFinite(qty) || qty < 1) {
        qty = 1;
    }

    const totalSlots = Math.max(0, Number(gift.total_quantity) || 0);
    const purchased = Math.max(0, Number(gift.purchased_quantity) || 0);

    if (totalSlots > 0) {
        const available = totalSlots - purchased;
        if (available <= 0) {
            throw new Error('Este presente não tem mais cotas disponíveis.');
        }
        if (qty > available) {
            throw new Error(
                available === 1
                    ? 'Só resta 1 cota disponível.'
                    : `Só restam ${available} cotas disponíveis.`
            );
        }
    } else {
        const cap = maxQuotasPerOrder();
        if (qty > cap) {
            throw new Error(`Quantidade máxima por pedido: ${cap} cotas.`);
        }
    }

    const amount = Math.round(unitPrice * qty * 100) / 100;
    if (!Number.isFinite(amount) || amount < 1) {
        throw new Error('Valor mínimo para cobrança: R$ 1,00');
    }

    return { quantity: qty, unitPrice, amount };
}
