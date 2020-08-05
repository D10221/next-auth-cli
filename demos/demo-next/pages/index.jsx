import Head from "next/head";
import styles from "styles/Home.module.css";
import { useSession, signOut } from "next-auth/client";
export default function Home() {
  const [session, sessionLoading] = useSession();
  const userName = (session && session.user && session.user.name) || "stranger";
  return (
    <div className={styles.container}>
      <Head>
        <title>Next Auth CLI - DEMO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome{" "}
          <span style={{ textTransform: "capitalize" }}>{userName}</span>!
        </h1>
        <p className={styles.description}>
          {!session && <a href="/api/auth/signin"> Please Signin </a>}
          {session && (
            <button
              style={{ textTransform: "uppercase" }}
              onClick={(e) => {
                signOut();
              }}
            >
              Signout
            </button>
          )}
        </p>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
