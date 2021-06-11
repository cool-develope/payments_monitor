import { getAccounts } from './utils'

// @ts-ignore
const { Pool } = require('pg')

// @ts-ignore
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
})

pool.query(
  'SELECT acc.name, COUNT(tran.id), SUM(tran.amount) \
    FROM transaction tran \
    LEFT JOIN account as acc ON tran.address = acc.address \
    WHERE tran.confirmations > 5 \
    GROUP BY acc.name, acc.id\
    ORDER BY acc.id',
  (err: any, res: any) => {
    console.log(err, res);
    res.rows.map((row: { name: string; count: number; sum: number }) => {
      const sum = parseFloat(row.sum.toString()).toFixed(8)
      row.name == null
        ? console.log(
            `Deposited without reference: count=${row.count} sum=${sum}`,
          )
        : console.log(
            `Deposited for ${row.name}: count=${row.count} sum=${sum}`,
          )
    })
    pool.query(
      'SELECT MIN(amount), MAX(amount) \
        FROM transaction \
        WHERE confirmations > 5',
      (err: any, res: any) => {
        const min = parseFloat(res.rows[0].min).toFixed(8)
        const max = parseFloat(res.rows[0].max).toFixed(8)
        console.log(`Smallest valid deposit: ${min}`)
        console.log(`Largest valid deposit: ${max}`)
        pool.end()
      },
    )
  },
)

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
  console.log("you entered: [" + 
      d.toString().trim() + "]");
});