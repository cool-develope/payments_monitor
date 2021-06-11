import { readFileSync } from 'fs'
import { Transaction } from './types'

export const getAccounts = () => {
  const rawData = readFileSync('./init_data/accounts.txt', 'utf-8')
  return rawData.split('\n').map((line: string) => {
    const values = line.split(':')
    return [values[0].trim(), values[1].trim()];
  })
}

const transferTransaction = (tran: Transaction) : Transaction => {
    return {
        involvesWatchonly: tran.involvesWatchonly,
        account: tran.account,
        address: tran.address,
        category: tran.category,
        amount: tran.amount,
        label: tran.label,
        confirmations: tran.confirmations,
        blockhash: tran.blockhash,
        blockindex: tran.blockindex,
        blocktime: new Date(tran.blocktime).toDateString(),
        txid: tran.txid,
        vout: tran.vout,
        walletconflicts: JSON.stringify(tran.walletconflicts),
        time: new Date(tran.time).toDateString(),
        timereceived: new Date(tran.timereceived).toDateString(),
    }
}

export const getTransactions = () => {
    let res: Transaction[] = [];

    for (let i = 1; i <= 2; i++) {
        const rawData = readFileSync(`./init_data/transactions-${i}.json`, 'utf-8')
        const { transactions: trans } = JSON.parse(rawData)
        res.push(...(trans.map((tran: Transaction) => {
            return transferTransaction(tran)
        })))
    }
    const keys = Object.keys(res[0])
    
    return {keys:keys.join(', '), values:res.map((tran:Transaction) => Object.values(tran))}
}
