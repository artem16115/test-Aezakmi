import { LoginForm } from '@/features/auth'
import { documentTitle } from '@/shared/lib/documentTitle'
import styles from './LoginPage.module.scss'

export function LoginPage() {
  return (
    <main className={styles.page}>
      <title>{documentTitle('Log in')}</title>
      <section className={styles.card} aria-labelledby="login-title">
        <header className={styles.header}>
          <h1 id="login-title" className={styles.title}>
            Log in
          </h1>
          <p className={styles.subtitle}>Welcome Back</p>
        </header>
        <LoginForm />
      </section>
    </main>
  )
}
