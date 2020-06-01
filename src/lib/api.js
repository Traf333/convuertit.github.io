const getRates = (base = 'USD') => fetch(`https://api.exchangeratesapi.io/latest?base=${base}`)
  .then((res) => res.json())

export { getRates }
