// @ts-ignore
import { Pool } from 'pg'
// @ts-ignore
const format = require('pg-format')

import { getTransactions, getAccounts } from './utils'

// @ts-ignore
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 25432,
})

pool.query('DROP TABLE IF EXISTS account', (err: any, res: any) => {
  pool.query(
    'CREATE TABLE account( \
      id serial primary key, \
      name varchar(255) NOT NULL, \
      address varchar(255) NOT NULL)',
    (err: any, res: any) => {
      pool.query(
        format('INSERT INTO account(name, address) VALUES %L', getAccounts()),
        (err: any, res: any) => {
          
        },
      )
    },
  )
})

pool.query('DROP TABLE IF EXISTS transaction', (err: any, res: any) => {
  pool.query(
    'CREATE TABLE transaction( \
        id serial primary key, \
        involvesWatchonly boolean, \
        account varchar(255) not null, \
        address varchar(255) not null, \
        category varchar(255), \
        amount decimal, \
        label varchar(255), \
        confirmations integer, \
        blockhash varchar(255) not null, \
        blockindex integer, \
        blocktime timestamp, \
        txid varchar(255), \
        vout integer, \
        walletconflicts text, \
        time timestamp, \
        timereceived timestamp)',
    (err: any, res: any) => {
      console.log(err, res);
      const { keys, values } = getTransactions()
      pool.query(
        format(`INSERT INTO transaction(${keys}) VALUES %L`, values),
        (err: any, res: any) => {
          pool.end()
        },
      )
    },
  )
})
