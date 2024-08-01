// currencyUtils.js
export const formatCurrencyVND = (amountString) => {
    const amount = parseFloat(amountString);
    if (isNaN(amount)) {
        return '';
    }

    return amount.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
};
