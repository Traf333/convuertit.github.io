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

<script lang="coffee">
  import { getRates } from '../lib/api'
  import { Parser } from 'expr-eval'

  fixed = (value) -> +value.toFixed 2

  export default
    name: 'CurrencyList'
    data: ->
      rates: null
      selectedCurrencies: ['RUB', 'USD', 'EUR']
      base: 'USD'
      amount: 100
      rawAmount: '100'

    computed:
      currencies: ->
        { code: currency, rate: @rates[currency] } for currency in @selectedCurrencies
      availableCurrencies: -> Object.keys(@rates).sort()
      currentRate: -> @rates[@base]

    methods:
      handleChange: (e) ->
        parser = new Parser()
        @rawAmount = e.target.value
        try
          @amount = parser.evaluate(@rawAmount) / @currentRate
      resolveAmount: (currencyCode) ->
        if currencyCode is @base
          @rawAmount
        else
          fixed @amount * @rates[currencyCode]

      setBaseCurrency: (currencyCode) ->
        @base = currencyCode
        @rawAmount = fixed @amount * @currentRate

      toggleCurrency: (e) ->
        { checked, value } = e.target
        if checked
          @selectedCurrencies.push(value)
        else
          @removeCurrency(value)

      removeCurrency: (currencyCode) ->
        @selectedCurrencies = (code for code in @selectedCurrencies when code isnt currencyCode)

    mounted: ->
      response = await getRates()
      @rates = response.rates
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
