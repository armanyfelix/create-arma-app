import styles from './page.module.css'
export default function Home() {
  const cards = [
    {
      url: 'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app',
      title: 'Docs',
      description: 'Find in-depth information about Next.js features and API.',
    },
    {
      url: 'https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app',
      title: 'Learn',
      description: 'Learn about Next.js in an interactive course with quizzes!',
    },
    {
      url: 'https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app',
      title: 'Templates',
      description: 'Explore the Next.js 13 playground.',
    },
    {
      url: 'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app',
      title: 'Deploy',
      description: 'Instantly deploy your Next.js site to a shareable URL with Vercel.',
    },
  ]

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1>Create Quick App</h1>
        <p>
          This is your <span style={{ color: 'rgb(226, 226, 226)' }}>Next.js</span> app.
          Have fun coding!
        </p>
      </div>

      <div className={styles.grid}>
        {cards.map((c, i) => (
          <a
            key={i}
            href={c.url}
            className={styles.card}
            target='_blank'
            rel='noopener noreferrer'
          >
            <h2>
              {c.title} <span className={styles.arrow}>-&gt;</span>
            </h2>
            <p>{c.description}</p>
          </a>
        ))}
      </div>
    </main>
  )
}
