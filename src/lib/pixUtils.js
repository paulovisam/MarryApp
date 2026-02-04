/*
  Simple Pix Code Generator (Copy & Paste standard)
  Format: 00020126580014BR.GOV.BCB.PIX0136[KEY]52040000530398654[AMOUNT]5802BR59[NAME_LENGTH][NAME]60[CITY_LENGTH][CITY]62070503***6304[CRC]
*/

function crc16(buffer) {
    let crc = 0xffff;
    for (let i = 0; i < buffer.length; i++) {
        crc = ((crc >> 8) | (crc << 8)) & 0xffff;
        crc ^= (buffer.charCodeAt(i) & 0xff00) >> 8;
        crc ^= (crc & 0xff) >> 4;
        crc ^= (crc << 12) & 0xffff;
        crc ^= ((crc & 0xff) << 5) & 0xffff;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixPayload({
    key = '12345678900', // Default dummy Key
    name = 'Noivos',
    city = 'Cidade',
    amount = '0.00',
    txtId = '***'
}) {
    const amountStr = Number(amount).toFixed(2);

    const payloadKey = `0014BR.GOV.BCB.PIX01${key.length}${key}`;
    const payloadAmount = `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`;

    const merchantName = name.substring(0, 25);
    const payloadName = `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`;

    const merchantCity = city.substring(0, 15);
    const payloadCity = `60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`;

    const payloadTxtId = `05${txtId.length.toString().padStart(2, '0')}${txtId}`;
    const payloadDataField = `62${(payloadTxtId.length + 4).toString().padStart(2, '0')}${payloadTxtId}`; // +4 for sub-ID? Actually 62 is main ID, sub IDs follow. keeping simple.

    // Correction: Simplified Payload Construction
    // 00 - Format Indicator: 01
    // 26 - Merchant Account Information (GUI, Key, etc)
    // 52 - MCC: 0000
    // 53 - Currency: 986 (BRL)
    // 54 - Amount
    // 58 - Country Code: BR
    // 59 - Merchant Name
    // 60 - Merchant City
    // 62 - Additional Data Field
    // 63 - CRC16

    // Let's build strictly:
    const line00 = '000201';
    const line26 = `26${(payloadKey.length).toString().padStart(2, '0')}${payloadKey}`;
    const line52 = '52040000';
    const line53 = '5303986';
    const line54 = payloadAmount; // 54 + len + val
    const line58 = '5802BR';
    const line59 = payloadName;
    const line60 = payloadCity;
    const line62 = `62070503***`; // Simplified

    const payloadBase = `${line00}${line26}${line52}${line53}${line54}${line58}${line59}${line60}${line62}6304`;

    const crc = crc16(payloadBase);

    return `${payloadBase}${crc}`;
}
