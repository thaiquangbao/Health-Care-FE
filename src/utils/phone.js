export const formatPhoneByFireBase = (phone) => {
    const cleanedNumber = phone.replace(/\D/g, '');
    return `+84 ${cleanedNumber.slice(1, 4)} ${cleanedNumber.slice(4, 7)} ${cleanedNumber.slice(7)}`;
}