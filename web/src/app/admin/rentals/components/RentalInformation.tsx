"use client"

import Action from "@/app/components/forms/Action"
import { asset } from "@/app/lib/asset"
import { Rental } from "@/app/types/rental"
import styles from "./RentalInformation.module.scss"
import { Modal } from "@/app/components/ui/Modal"
import { useEffect, useState } from "react"
import { findDormitory } from "@/app/data-access/dormitories"
import { Dormitory } from "@/app/types/dormitory"

const RentalInformation = (rental: Rental) => {
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const [dormitory, setDormitory] = useState<Dormitory>()

  useEffect(() => {
    const fetchDormitory = async () => {
      const dormitory = await findDormitory({
        where: Number(rental.room?.dormitory_id),
      })
      setDormitory(dormitory)
    }
    fetchDormitory()
  }, [])

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <>
      <Action icon={asset("info.svg")} size={18} as="Edit" onAction={toggleOpen} />
      {isOpen && (
        <Modal title="Rincian Sewa" isOpen={isOpen} onClose={toggleOpen}>
          <div className={styles.container}>
            <table className={styles.table}>
              <tbody>
                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Rental ID</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>{rental.id}</td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Penyewa</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>{rental.tenant?.name}</td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Kos</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>{dormitory?.name}</td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Nomor Kamar</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>{rental.room?.room_number}</td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Status</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>
                    <span
                      className={
                        rental.status === "pending"
                          ? styles.statusPending
                          : rental.status === "active" || rental.status === "finished"
                          ? styles.statusPaid
                          : rental.status === "cancelled"
                          ? styles.statusCanceled
                          : ""
                      }
                    >
                      {rental.status === "pending"
                        ? "Menunggu"
                        : rental.status === "active"
                        ? "Aktif"
                        : rental.status === "finished"
                        ? "Selesai"
                        : "Dibatalkan"}
                    </span>
                  </td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Tanggal Mulai</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>
                    {new Date(rental.start_date as string).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Durasi Sewa</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>{rental.duration_months} Bulan</td>
                </tr>

                <tr className={styles.row}>
                  <td className={`${styles.cell} ${styles.label}`}>Tanggal Selesai</td>
                  <td className={`${styles.cell} ${styles.divider}`}>:</td>
                  <td className={`${styles.cell} ${styles.value}`}>
                    {new Date(rental.end_date as string).toLocaleDateString("id-ID", {
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

export default RentalInformation
