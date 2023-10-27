import Head from "next/head";
import styles from "../styles/Home.module.css";

import dynamic from "next/dynamic";

const Form = dynamic(() => import("../components/Form"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ESGWIZE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Form />
    </div>
  );
}
