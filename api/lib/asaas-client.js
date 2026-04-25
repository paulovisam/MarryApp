
export function getAsaasBaseUrl() {
    const env = process.env.ASAAS_ENV || 'sandbox';
    if (env === 'sandbox' || env === 'hml') {
        return 'https://api-sandbox.asaas.com';
    } else if (env === 'production' || env === 'prod') {
        return 'https://api.asaas.com';
    } else {
        throw new Error('ASAAS_ENV inválido');
    }
}

function asaasHeaders() {
    const token = process.env.ASAAS_API_KEY;
    if (!token) {
        throw new Error('ASAAS_API_KEY não configurada');
    }
    return {
        access_token: token,
        'Content-Type': 'application/json',
    };
}

export async function asaasPost(path, body) {
    const base = getAsaasBaseUrl();
    const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: asaasHeaders(),
        body: JSON.stringify(body),
    });
    let data = {};
    try {
        const text = await res.text();
        if (text.trim()) data = JSON.parse(text);
    } catch {
        data = {};
    }
    if (!res.ok) {
        const msg =
            data?.errors?.[0]?.description ||
            data?.message ||
            `Asaas HTTP ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.asaasBody = data;
        throw err;
    }
    return data;
}

/** Apenas dígitos; telefone BR sem +55 */
export function normalizeDigits(s) {
    return String(s || '').replace(/\D/g, '');
}

export function normalizeBrazilPhone(phone) {
    let d = normalizeDigits(phone);
    if (d.length >= 12 && d.startsWith('55')) d = d.slice(2);
    return d;
}

export function dueDateDaysFromNow(days = 7) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}
