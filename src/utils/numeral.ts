import * as numeral from 'numeral';

const language = {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 't',
        million: 'mn',
        billion: 'md',
        trillion: 'bn'
    },
    ordinal: function (number) {
        var str = number.toString();
        var endsWith = str[str.length - 1];
        return (endsWith === '1' || endsWith === '2') ? ':a' : ':e';
    },
    currency: {
        symbol: 'SEK'
    }
};

numeral.register('locale', 'sv-se', language);
numeral.locale('sv-se');

export default numeral;