import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generatePixPayload } from '../lib/pixUtils';
import { purchaseGift } from '../services/giftService';
import { IoClose, IoCopyOutline, IoCheckmarkCircle } from 'react-icons/io5';

const CheckoutModal = ({ gift, onClose, onSuccess }) => {
    const [step, setStep] = useState('confirm'); // confirm, paying, success
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // NOTE: Replace with REAL Pix Key from User in production or env
    const pixKey = "12345678900";
    const pixPayload = generatePixPayload({
        key: pixKey,
        name: 'Sara e Paulo',
        city: 'Sao Paulo',
        amount: gift.price
    });

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        try {
            // Reserve/Purchase implementation
            // In a real app we might "reserve" first, then confirm payment. 
            // Here we assume clicking "Confirmar" means they will pay now.
            await purchaseGift(gift.id, 1);
            setStep('paying');
        } catch (err) {
            setError(err.message || 'Erro ao processar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPix = () => {
        navigator.clipboard.writeText(pixPayload);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleFinish = () => {
        onSuccess();
        onClose();
    };

    if (!gift) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-700">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <IoClose size={24} />
                </button>

                {step === 'confirm' && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white">Confirmar Presente</h3>

                        <div className="flex gap-4 items-center bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                            <img
                                src={gift.image_url}
                                alt={gift.title}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-gray-100">{gift.title}</h4>
                                <p className="text-burgundy-600 dark:text-burgundy-400 font-bold">
                                    R$ {Number(gift.price).toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Ao confirmar, este item será marcado como comprado para evitar duplicidade.
                            Em seguida, você verá o código Pix para realizar o pagamento.
                        </p>

                        {error && (
                            <p className="text-red-500 text-sm bg-red-100 dark:bg-red-900/20 p-2 rounded">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="w-full py-3 bg-burgundy-700 hover:bg-burgundy-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processando...' : 'Confirmar e Pagar'}
                        </button>
                    </div>
                )}

                {step === 'paying' && (
                    <div className="space-y-6 text-center">
                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white">Pagamento Pix</h3>

                        <div className="bg-white p-4 rounded-xl inline-block mx-auto border-4 border-slate-100">
                            <QRCodeSVG value={pixPayload} size={200} />
                        </div>

                        <div className="space-y-2">
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Escaneie o QR Code ou copie o código abaixo:
                            </p>

                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                <input
                                    type="text"
                                    readOnly
                                    value={pixPayload}
                                    className="bg-transparent text-xs text-slate-500 flex-1 outline-none truncate"
                                />
                                <button
                                    onClick={handleCopyPix}
                                    className="text-burgundy-600 hover:text-burgundy-700 p-2"
                                    title="Copiar"
                                >
                                    {isCopied ? <IoCheckmarkCircle size={20} /> : <IoCopyOutline size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleFinish}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                        >
                            Já realizei o pagamento
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
