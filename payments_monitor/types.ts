export interface Account {
  name: string
  address: string
}

export interface Transaction {
  involvesWatchonly: boolean
  account: string
  address: string
  category: string
  amount: number
  label: string
  confirmations: number
  blockhash: string
  blockindex: number
  blocktime: string
  txid: string
  vout: number
  walletconflicts: string[] | string
  time: string
  timereceived: string
}
