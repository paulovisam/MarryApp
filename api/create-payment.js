
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

    try {
        const { giftId, giftTitle, giftDescription, customer, amount } = req.body;

        // Construct AbacatePay Payload
        const payload = {
            frequency: "ONE_TIME",
            methods: ["PIX", "CARD"],
            products: [
                {
                    externalId: giftId,
                    name: giftTitle || "Presente de Casamento",
                    description: giftDescription || `Contribuição para: ${giftTitle || giftId}`,
                    quantity: 1,
                    price: Math.round(parseFloat(amount) * 100) // Price in centavos
                }
            ],
            returnUrl: `${req.headers.origin || 'http://localhost:3000'}/presentes`,
            completionUrl: `${req.headers.origin || 'http://localhost:3000'}/presentes?status=success`,
            customer: {
                name: customer.name,
                email: customer.email,
                taxId: '',
                cellphone: customer.phone
            }
        };

        const response = await axios.post('https://api.abacatepay.com/v1/billing/create', payload, {
            headers: {
                'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('AbacatePay Response:', JSON.stringify(response.data));

        const billing = response.data.data;

        if (!billing) {
            throw new Error(response.data.error || 'Invalid response from AbacatePay: ' + JSON.stringify(response.data));
        }

        // Save to Database
        const { data: order, error: dbError } = await supabase
            .from('orders')
            .insert({
                gift_id: giftId,
                customer_name: customer.name,
                customer_cpf: '',
                customer_email: customer.email,
                amount: amount,
                status: 'PENDING',
                asaas_payment_id: billing.id, // Storing AbacatePay ID here
                payment_method: 'ABACATEPAY', // General method
                payment_url: billing.url,
                installments: 1
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database Error:', dbError);
            // Non-blocking error for payment, but important for records
        }

        res.status(200).json({
            orderId: order?.id,
            paymentUrl: billing.url
        });

    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create payment' });
    }
}
