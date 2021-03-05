<template>
  <section v-if="rates">
    <h1>Convert currencies including math operations</h1>
    <div class="currency-list">
      <div v-for="currency in currencies" :key="currency.code" class="currency">
        <div class="currency-code">{{ currency.code }}</div>
        <input
            type="text"
            :value="resolveAmount(currency.code)"
            @focus="setBaseCurrency(currency.code)"
            @input="handleChange"
        />
        <div class="remove" @click="removeCurrency(currency.code)">❌</div>
      </div>
    </div>

    <hr/>
    <h3>Available currencies</h3>
    <ul class="available-currencies">
      <li v-for="currency in availableCurrencies" :key="currency">
        <label>
          <input
              type="checkbox"
              :value="currency"
              :checked="selectedCurrencies.includes(currency)"
              @change="toggleCurrency"
          />
          {{ currency }}
        </label>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import {getRates} from "@/lib/api";
import {Currency, Rate} from "../../types";
import {Parser} from "expr-eval";
import {defineComponent} from "vue";

const fixed = (value: number): string => value.toFixed(2);

interface CurrencyListType {
  rates: Rate[];
  selectedCurrencies: string[];
  base: string;
  amount: number;
  rawAmount: string;
}

export default defineComponent({
  name: "CurrencyList",
  data() {
    const stored = localStorage.getItem('selectedCurrencies')
    const defaultCurrencies = stored ? JSON.parse(stored) : ["RUB", "USD", "EUR"]
    return {
      rates: [],
      selectedCurrencies: defaultCurrencies,
      base: "USD",
      amount: 100,
      rawAmount: "100"
    } as CurrencyListType;
  },
  computed: {
    currencies(): Currency[] {
      return this.selectedCurrencies.map((currency: string) => ({
        code: currency,
        rate: this.rates[currency]
      }));
    },
    availableCurrencies(): string[] {
      return Object.keys(this.rates).sort();
    },
    currentRate(): number {
      return this.rates[this.base];
    }
  },
  methods: {
    handleChange(e: any): void {
      const parser = new Parser();
      this.rawAmount = e.target.value;
      try {
        this.amount = parser.evaluate(this.rawAmount) / this.currentRate;
      } catch (e) {
        console.log('Hey', e)
      }
    },

    resolveAmount(currencyCode: string): string {
      if (currencyCode === this.base) {
        return this.rawAmount;
      } else {
        return fixed(this.amount * this.rates[currencyCode] || 0);
      }
    },
    setBaseCurrency(currencyCode: string): void {
      this.base = currencyCode;
      this.rawAmount = fixed(this.amount * this.currentRate);
    },
    toggleCurrency(e: any): void {
      const {checked, value} = e.target;
      if (checked) {
        this.selectedCurrencies.push(value);
      } else {
        this.removeCurrency(value);
      }
      localStorage.setItem('selectedCurrencies', JSON.stringify(this.selectedCurrencies))
    },

    removeCurrency(currencyCode: string): void {
      this.selectedCurrencies = this.selectedCurrencies.filter(
          (currency: string) => currency !== currencyCode
      );
    }
  },
  async mounted(): Promise<any> {
    const response = await getRates();
    this.rates = response.rates;
  }
});
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
