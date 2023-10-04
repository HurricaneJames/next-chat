import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "~/components/layout";
import { db } from "~/server/db";
import { api } from "~/utils/api";

type PageProps = {
  alias: string;
};
export default function ProfilePage({ alias }: PageProps) {
  const { data: sessionData } = useSession();
  const { data: user, isLoading } = api.profile.getProfileWithPosts.useQuery({
    alias,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <Layout>
      <Head>
        <title>Next-Chat: {alias}</title>
      </Head>
      {sessionData?.user.id === user?.id && <CreatePost />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">
        {user?.posts.map((post) => (
          <PostView key={post.id} post={post} author={user} />
        ))}
      </div>
    </Layout>
  );
}

import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { GetStaticProps } from "next";
import SuperJSON from "superjson";
import { LoadingSpinner } from "~/components/loading";
import PostView from "~/components/postView";
import CreatePost from "~/components/createPost";

export const getStaticProps: GetStaticProps = async (context) => {
  const serverSideHelpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, session: null },
    transformer: SuperJSON,
  });

  const alias = context?.params?.alias;
  if (typeof alias !== "string") throw new Error("No user alis");

  await serverSideHelpers.profile.getProfileWithPosts.prefetch({ alias });

  return {
    props: {
      trpcState: serverSideHelpers.dehydrate(),
      alias,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
