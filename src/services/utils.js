export const currencyFormat = (num) => {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

console.log(currencyFormat(23453.32423));