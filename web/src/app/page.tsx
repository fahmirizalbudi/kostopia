import Image from "next/image";
import NavigationBar from "./components/layout/NavigationBar";
import Button from "./components/ui/Button";
import { menuNavigationBar } from "./menu/navigation-bar";
import styles from "./page.module.scss"
import { asset } from "./lib/asset";

export default function Home() {
  return (
    <main>
      <NavigationBar menu={menuNavigationBar} />
      <section className={styles.hero}>
        <span className={styles.motto}>
          Hunian Terjangkau
        </span>
        <p className={styles.description}>Kami memiliki lebih dari 5+ kost yang siap huni.</p>
        <h1 className={styles.display}>Temukan Hunian Impianmu</h1>
        <div className={styles.search}>
          <input type="text" className={styles.input} placeholder="Enter Name, Keywords ..." />
          <Button className={styles.handle}>
            <Image src={asset("search.svg")} alt="Search" width={20} height={20} />
          </Button>
        </div>
        <h2 className={styles.discover}>Jelajahi Kebutuhan Anda di Sini</h2>
        <div>
          <ul className={styles.params}>
            <li className={styles.menu}><a className={styles.anchor} href="#">Semua Hunian</a></li>
            <li className={styles.menu}><a className={styles.anchor} href="#">Terpopuler</a></li>
            <li className={styles.menu}><a className={styles.anchor} href="#">Unggulan</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
