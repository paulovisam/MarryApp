
import React, { useState } from 'react';
import { IoClose, IoLockClosed } from 'react-icons/io5';

const CheckoutModal = ({ gift, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Customer Info
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: ''
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

        setLoading(true);
        setError('');

        try {
            const payload = {
                giftId: gift.id,
                giftTitle: gift.title,
                giftDescription: gift.description,
                amount: gift.price,
                customer
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

            // Redirect to AbacatePay
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
                        <div>
                            <h4 className="font-sans font-semibold text-slate-900 dark:text-white">{gift.title}</h4>
                            <p className="text-600 font-bold">R$ {gift.price}</p>
                        </div>
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
                        <div className="grid grid-cols-2 gap-4">
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
                                placeholder="Celular"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-burgundy-500"
                                value={customer.phone}
                                onChange={handleInputChange}
                            />
                        </div>

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
                                Você será redirecionado para a AbacatePay para concluir o pagamento via Pix ou Cartão.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
