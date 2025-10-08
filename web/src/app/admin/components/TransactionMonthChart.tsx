"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import styles from "./TransactionMonthChart.module.scss"

type LineChartProps = {
  data: any
}

export const TransactionMonthChart = ({ data }: LineChartProps) => {
  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Transaksi Bulanan</h3>
        <p className={styles.description}>Rekap jumlah transaksi sukses setiap bulan. (Rp)</p>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5.9% 90%)" vertical={false} />
            <XAxis dataKey="name" stroke="hsl(240 3.8% 46.1%)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(240 3.8% 46.1%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString("id-ID")}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 100%)",
                border: "1px solid hsl(240 5.9% 90%)",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(221.2 83.2% 53.3%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
