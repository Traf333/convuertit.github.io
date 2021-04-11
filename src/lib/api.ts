import { RateResponse } from "../../types";

const getRates = (base = "USD"): Promise<RateResponse> =>
  fetch(`http://api.exchangeratesapi.io/latest?base=${base}&access_key=63130c37bb3b50ae99edfcca6f8c43bd`).then(res =>
    res.json()
  );

export { getRates };
