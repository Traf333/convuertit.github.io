import { RateResponse } from "../../types";

const getRates = (base = "USD"): Promise<RateResponse> =>
  fetch(`https://api.exchangeratesapi.io/latest?base=${base}`).then(res =>
    res.json()
  );

export { getRates };
