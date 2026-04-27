
import React, { useEffect, useState } from 'react';
import { IoAdd, IoClose, IoLockClosed, IoRemove } from 'react-icons/io5';
import { getPaymentProvider } from '../lib/payment-provider.js';

const asaasMaxInstallments = (() => {
    const n = parseInt(import.meta.env.VITE_ASAAS_MAX_INSTALLMENT_COUNT || '12', 10);
    return Number.isFinite(n) && n > 0 ? n : 12;
})();

const maxQuotasPerOrderClient = (() => {
    const n = parseInt(import.meta.env.VITE_MAX_GIFT_QUOTAS_PER_ORDER || '50', 10);
    return Number.isFinite(n) && n > 0 ? Math.min(500, n) : 50;
})();

const CheckoutModal = ({ gift, onClose, onSuccess }) => {
    const [paymentProvider, setPaymentProvider] = useState(() =>
        getPaymentProvider()
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        fetch('/api/payment-config')
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((data) => {
                if (cancelled || !data?.provider) return;
                setPaymentProvider(String(data.provider).toLowerCase());
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    const isAsaas = paymentProvider === 'asaas';
    const isInfinitepay = paymentProvider === 'infinitepay';

    const unitPrice = Number(gift?.price) || 0;
    const purchasedQty = Math.max(0, Number(gift?.purchased_quantity) || 0);
    const totalQty = Math.max(0, Number(gift?.total_quantity) || 0);
    const maxSelectable =
        totalQty > 0
            ? Math.max(1, totalQty - purchasedQty)
            : maxQuotasPerOrderClient;

    const [quotaQty, setQuotaQty] = useState(1);

    useEffect(() => {
        setQuotaQty(1);
    }, [gift?.id]);

    useEffect(() => {
        setQuotaQty((q) =>
            Math.min(Math.max(1, q), Math.max(1, maxSelectable))
        );
    }, [maxSelectable, gift?.id]);

    // Customer Info
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        taxId: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async () => {
        if (!customer.name || !customer.email || !customer.phone) {
            setError('Por favor, preencha todos os dados pessoais.');
            return;
        }

        if (isAsaas) {
            const doc = String(customer.taxId || '').replace(/\D/g, '');
            if (doc.length !== 11 && doc.length !== 14) {
                setError('Informe um CPF ou CNPJ válido para o pagamento Asaas.');
                return;
            }
        }

        setLoading(true);
        setError('');

        try {
            const totalAmount =
                Math.round(unitPrice * quotaQty * 100) / 100;
            const payload = {
                giftId: gift.id,
                giftTitle: gift.title,
                giftDescription: gift.description,
                quantity: quotaQty,
                amount: String(totalAmount),
                customer: {
                    ...customer,
                    taxId: isAsaas
                        ? String(customer.taxId || '').replace(/\D/g, '')
                        : customer.taxId || '',
                },
            };

            const res = await fetch('/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao criar pagamento.');
            }

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                throw new Error('URL de pagamento não recebida.');
            }

        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <h3 className="font-serif text-xl text-burgundy-700 dark:text-burgundy-400">
                        Enviar Presente
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2">
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Summary */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6 flex gap-4 items-center">
                        <img src={gift.image_url} alt="" className="w-16 h-16 object-cover rounded-lg bg-white" />
                        <div className="min-w-0 flex-1">
                            <h4 className="font-sans font-semibold text-slate-900 dark:text-white">{gift.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {unitPrice.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}{' '}
                                por cota
                            </p>
                            <p className="mt-1 font-bold text-slate-900 dark:text-white">
                                {(unitPrice * quotaQty).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}{' '}
                                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                                    ({quotaQty} {quotaQty === 1 ? 'cota' : 'cotas'})
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="quota-qty"
                            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Quantidade de cotas
                        </label>
                        <div className="flex max-w-xs items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuotaQty((q) => Math.max(1, q - 1))
                                }
                                disabled={quotaQty <= 1 || loading}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                aria-label="Menos uma cota"
                            >
                                <IoRemove className="h-5 w-5" aria-hidden />
                            </button>
                            <input
                                id="quota-qty"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={maxSelectable}
                                value={quotaQty}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value, 10);
                                    if (Number.isNaN(v)) {
                                        setQuotaQty(1);
                                        return;
                                    }
                                    setQuotaQty(
                                        Math.min(
                                            Math.max(1, v),
                                            maxSelectable
                                        )
                                    );
                                }}
                                className="h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white py-2 text-center text-base font-semibold tabular-nums text-slate-900 focus:border-burgundy-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setQuotaQty((q) =>
                                        Math.min(maxSelectable, q + 1)
                                    )
                                }
                                disabled={quotaQty >= maxSelectable || loading}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                aria-label="Mais uma cota"
                            >
                                <IoAdd className="h-5 w-5" aria-hidden />
                            </button>
                        </div>
                        {totalQty > 0 ? (
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                Disponíveis: {maxSelectable} de {totalQty}{' '}
                                cotas.
                            </p>
                        ) : (
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                Até {maxSelectable} cotas por pedido.
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 animate-fadeIn">
                        <h4 className="font-sans text-slate-700 dark:text-slate-300 mb-2">Seus Dados</h4>
                        <input
                            name="name"
                            placeholder="Nome Completo"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-burgundy-500"
                            value={customer.name}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <input
                                name="email"
                                placeholder="Email"
                                type="email"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-burgundy-500"
                                value={customer.email}
                                onChange={handleInputChange}
                            />
                            <input
                                name="phone"
                                placeholder="Celular (DDD + número)"
                                inputMode="tel"
                                autoComplete="tel"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-burgundy-500"
                                value={customer.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        {isAsaas ? (
                            <input
                                name="taxId"
                                placeholder="CPF ou CNPJ (obrigatório)"
                                inputMode="numeric"
                                autoComplete="off"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-burgundy-500"
                                value={customer.taxId}
                                onChange={handleInputChange}
                            />
                        ) : null}

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={handlePayment}
                                disabled={loading}
                                aria-busy={loading}
                                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-burgundy-600 py-3 font-medium text-white transition-colors hover:bg-burgundy-700 disabled:cursor-wait disabled:hover:bg-burgundy-600"
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/25 border-t-white motion-reduce:animate-none motion-reduce:border-white/60"
                                            aria-hidden
                                        />
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <IoLockClosed className="shrink-0" aria-hidden />
                                        <span>Ir para Pagamento Seguro</span>
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-center text-slate-400 mt-2">
                                {isAsaas
                                    ? `Você será redirecionado para o link seguro do Asaas: Pix à vista ou cartão em até ${asaasMaxInstallments}x (conforme opções na página do Asaas).`
                                    : isInfinitepay
                                      ? 'Você será redirecionado para o checkout seguro da InfinitePay (Pix ou cartão, conforme opções na página).'
                                      : 'Você será redirecionado para a AbacatePay para concluir o pagamento via Pix ou Cartão.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
