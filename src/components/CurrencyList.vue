<template>
  <section>
    <h1>Convuerter helps convert currencies including</h1>
    <div
      v-for="currency in currencies"
      :key="currency.code"
      class="currency"
    >
      <div>{{ currency.code }}</div>
      <input
        type="text"
        :value="resolveAmount(currency.code)"
        @focus="setBaseCurrency(currency.code)"
        @input="handleChange"
      >
    </div>
    <div>Add new currency</div>
  </section>
</template>

<script>
  import { getRates } from '../lib/api'
  import { Parser } from 'expr-eval'

  export default {
    name: 'CurrencyList',
    data() {
      return {
        rates: {},
        selectedCurrencies: ['RUB', 'USD', 'EUR'],
        base: 'USD',
        amount: 0,
        rawAmount: '0',
      }
    },
    computed: {
      currencies() {
        return this.selectedCurrencies.map(currency => ({ code: currency, rate: this.rates[currency] }))
      },
      currentRate() {
        return this.rates[this.base]
      },
    },
    methods: {
      handleChange(e) {
        const parser = new Parser()
        this.rawAmount = e.target.value
        try {
          this.amount = parser.evaluate(this.rawAmount) / this.currentRate
        } catch (e) {
          //  ignoring wrong math expression
        }
      },
      resolveAmount(currencyCode) {
        return currencyCode === this.base
          ? this.rawAmount
          : this.amountFormat(this.amount * this.rates[currencyCode])
      },
      amountFormat(value) {
        return +value.toFixed(2)
      },
      setBaseCurrency(currencyCode) {
        this.base = currencyCode
        this.rawAmount = this.amountFormat(this.amount * this.currentRate)
      },
    },
    mounted() {
      getRates().then((response) => this.rates = response.rates)
    },
  }
</script>

<style scoped>
  section {
    max-width: 500px;
  }

  .currency {
    display: flex;
  }
  input {
    font-size: 20px;
    padding: 10px;
    flex: 1;
  }
</style>
