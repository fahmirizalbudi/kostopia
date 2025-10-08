"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import styles from "./RentalMonthChart.module.scss"

type LineChartProps = {
  data: any
}

export const RentalMonthChart = ({ data }: LineChartProps) => {
  return (
    <div className={styles.chartContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Jumlah Penyewa Bulanan</h3>
        <p className={styles.description}>Rekap jumlah orang yang melakukan rental setiap bulan.</p>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5.9% 90%)" vertical={false} />
            <XAxis dataKey="name" stroke="hsl(240 3.8% 46.1%)" interval="preserveStartEnd" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="hsl(240 3.8% 46.1%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              dx={-45}
              tickFormatter={(value) => `${value.toLocaleString("id-ID")} `}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 100%)",
                border: "1px solid hsl(240 5.9% 90%)",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value.toLocaleString("id-ID")} orang`, "Jumlah Penyewa"]}
            />
            <Line
              type="monotone"
              dataKey="renters"
              stroke="hsl(142.1 70.6% 45.3%)"
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
