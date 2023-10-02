import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";

import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingSpinner } from "~/components/loading";
dayjs.extend(relativeTime);

export default function Home() {
  return (
    <>
      <Head>
        <title>Next-Chat</title>
        <meta name="description" content="A chat post app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Next <span className="text-fuchsia-500">Chat</span> →
          </h1>
          <CreatePost />
          <Posts />
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function CreatePost() {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  if (!user) return null;

  console.log('User', user);

  return (
    <div className="flex gap-4">
      <img src={user.image || ""} alt="Profile image" className="w-16 h-16 rounded-full" />
      <input placeholder="What's on your mind?" className="bg-transparent " />
    </div>
  )
}

function Posts() {
  const { data: posts, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">
      {posts?.map((post) => (
        <div
          key={post.id}
          className="flex max-w-md gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
        >
          <img src={post.author.image || ""} alt="Profile image" className="w-12 h-12 rounded-full" />
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
              <span className="text-fuchsia-500">{`→${post.author.name}`}</span>
              <span>{`·`}</span>
              <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
            </div>
            <span>{post.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
