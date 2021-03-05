export interface Rate {
    [key: string]: number
}

export interface RateResponse {
    rates: Rate[]
}
export interface Currency {
    code: string
    rate: number
}
