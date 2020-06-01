<template>
  <section v-if="rates">
    <h1>Convert currencies including math operations</h1>
    <div class="currency-list">
      <div
        v-for="currency in currencies"
        :key="currency.code"
        class="currency"
      >
        <div class="currency-code">{{ currency.code }}</div>
        <input
          type="text"
          :value="resolveAmount(currency.code)"
          @focus="setBaseCurrency(currency.code)"
          @input="handleChange"
        >
        <div class="remove" @click="removeCurrency(currency.code)">❌</div>
      </div>
    </div>

    <hr>
    <h3>Available currencies</h3>
    <ul class="available-currencies">
      <li
        v-for="currency in availableCurrencies"
        :key="currency"
      >
        <label>
          <input
            type="checkbox"
            :value="currency"
            :checked="selectedCurrencies.includes(currency)"
            @change="toggleCurrency"
          >
          {{ currency }}
        </label>
      </li>
    </ul>
  </section>
</template>

<script>
  import { getRates } from '../lib/api'
  import { Parser } from 'expr-eval'

  const fixed = (value) => +value.toFixed(2)

  export default {
    name: 'CurrencyList',
    data() {
      return {
        rates: null,
        selectedCurrencies: ['RUB', 'USD', 'EUR'],
        base: 'USD',
        amount: 100,
        rawAmount: '100',
      }
    },
    computed: {
      currencies() {
        return this.selectedCurrencies.map((currency) => ({ code: currency, rate: this.rates[currency] }))
      },
      availableCurrencies() {
        return Object.keys(this.rates).sort()
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
          : fixed(this.amount * this.rates[currencyCode])
      },
      setBaseCurrency(currencyCode) {
        this.base = currencyCode
        this.rawAmount = fixed(this.amount * this.currentRate)
      },
      toggleCurrency(e) {
        if (e.target.checked) this.selectedCurrencies.push(e.target.value)
        else this.removeCurrency(e.target.value)
      },
      removeCurrency(currencyCode) {
        this.selectedCurrencies = this.selectedCurrencies.filter(code => code !== currencyCode)
      },
    },
    mounted() {
      getRates().then((response) => this.rates = response.rates)
    },
  }
</script>

<style scoped>
  .currency-list {
    max-width: 500px;
    margin: 100px auto;
  }

  .currency {
    display: flex;
    align-items: center;
  }

  .currency-code {
    width: 100px;
  }

  input[type="text"] {
    font-size: 20px;
    padding: 10px;
    flex: 1;
  }

  .remove {
    padding-left: 15px;
    cursor: pointer;
  }

  .available-currencies {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
  }

  label {
    display: flex;
    align-items: baseline;
    width: 100px;
  }

  .available-currencies {
    padding: 100px;
  }
</style>
