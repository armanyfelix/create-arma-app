export const justNextWithTailwind = `export default function Home() {
  const cards = [
    {
      url: "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app",
      title: "Docs",
      description: "Find in-depth information about Next.js features and API.",
    },
    {
      url: "https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
      title: "Learn",
      description:
        "Learn about Next.js in an interactive course with quizzes!",
    },
    {
      url: "https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app",
      title: "Templates",
      description: "Explore the Next.js 13 playground.",
    },
    {
      url: "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app",
      title: "Deploy",
      description:
        "Instantly deploy your Next.js site to a shareable URL with Vercel.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly bg-gradient-to-br from-sky-200 to-orange-200 p-5 dark:from-sky-950 dark:to-orange-950">
      <div className="relative flex flex-col place-items-center justify-center">
        <h1 className="bg-gradient-to-br from-sky-600 to-orange-900 bg-clip-text text-4xl font-bold text-transparent dark:from-sky-600 dark:to-orange-400 sm:text-5xl md:text-7xl xl:text-9xl">
          Create Quick App
        </h1>
        <p className="mt-14 text-center font-semibold dark:text-gray-300 sm:text-lg md:text-2xl xl:text-3xl">
          This is your <span className="text-white">Next.js</span> app. Have fun
          coding!
        </p>
      </div>
      <div className="all grid text-center dark:text-white lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {cards.map((c, i) => (
          <a
            key={i}
            href={c.url}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-slate-400 hover:bg-slate-300/30 active:brightness-75 hover:dark:border-slate-600 hover:dark:bg-slate-500/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              {c.title}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              {c.description}
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}
`
