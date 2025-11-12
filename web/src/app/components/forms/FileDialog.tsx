import Image from "next/image"
import styles from "./FileDialog.module.scss"
import { asset } from "@/app/lib/asset"

type FileDialogProps = {
  name: string
  placeholder: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedFile?: string
}

const FileDialog = ({ name, placeholder, onChange, selectedFile }: FileDialogProps) => {
  return (
    <>
      <label className={`${styles.input} ${selectedFile && styles.active}`} htmlFor={name}>
        <Image height={24} width={24} alt="Upload File" src={asset("upload.svg")} />
        <span>{selectedFile || placeholder}</span>
      </label>
      <input type="file" className={styles.file} name={name} accept="image/*" id={name} placeholder={placeholder} onChange={onChange} />
    </>
  )
}

export default FileDialog
