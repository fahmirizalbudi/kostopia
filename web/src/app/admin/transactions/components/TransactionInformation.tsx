"use client"

import Action from "@/app/components/forms/Action"
import { Modal } from "@/app/components/ui/Modal"
import { asset } from "@/app/lib/asset"
import { Transaction } from "@/app/types/transaction"
import { useState } from "react"
import styles from "./TransactionInformation.module.scss"

const TransactionInformation = (transaction: Transaction) => {
  const [isOpen, setIsOpen] = useState<Boolean>(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <>
      <Action icon={asset("info.svg")} size={18} as="Edit" onAction={toggleOpen} />
      {isOpen && (
        <Modal title="Rincian Transaksi" isOpen={isOpen} onClose={toggleOpen}>
          <div className={styles.container}>
            <table className={styles.table}>
              <tbody>
                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Kode Transaksi</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>{transaction.id}</td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Penyewa</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>{transaction.rental?.tenant?.name}</td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Metode</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>
                    <span className={styles.paymentMethod}>
                      {transaction.method === "ewallet" ? "E-Wallet" : transaction.method === "transfer" ? "Transfer" : "Cash"}
                    </span>
                  </td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Status</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>
                    <span
                      className={
                        transaction.status === "pending"
                          ? styles.statusPending
                          : transaction.status === "success"
                          ? styles.statusPaid
                          : transaction.status === "rejected"
                          ? styles.statusCanceled
                          : ""
                      }
                    >
                      {transaction.status === "no_transaction"
                        ? "-"
                        : transaction.status === "success"
                        ? "Lunas"
                        : transaction.status === "rejected"
                        ? "Ditolak"
                        : "Menunggu"}
                    </span>
                  </td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Keperluan</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>
                    <span className={styles.purpose}>{transaction.purpose === "new" ? "Sewa Baru" : "Perpanjang Sewa"}</span>
                  </td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Jumlah Bayar</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>{transaction.amount?.toLocaleString("id-ID")}</td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Tanggal</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>
                    {new Date(transaction.created_at as string).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </>
  )
}

export default TransactionInformation
