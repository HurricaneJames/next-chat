import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "~/components/layout";
import { db } from "~/server/db";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import type { GetStaticProps } from "next";
import SuperJSON from "superjson";
import { LoadingSpinner } from "~/components/loading";
import CreatePost from "~/components/createPost";
import PostFeed from "~/components/PostFeed";

const POST_BATCH_SIZE = 5;

type PageProps = {
  alias: string;
};
export default function ProfilePage({ alias }: PageProps) {
  const { data: sessionData } = useSession();
  const { data: user, isLoading } = api.profile.getUserByAlias.useQuery({
    alias,
  });

  if (!isLoading && user == null) throw new Error("No Such User");

  return (
    <Layout>
      <Head>
        <title>{`Next-Chat: ${alias}`}</title>
      </Head>
      {sessionData?.user.id && isLoading && <LoadingSpinner />}
      {sessionData?.user.id && sessionData?.user.id === user?.id && (
        <CreatePost />
      )}
      <PostFeed authorAlias={alias} batchSize={POST_BATCH_SIZE} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const serverSideHelpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, session: null },
    transformer: SuperJSON,
  });

  const alias = context?.params?.alias;
  if (typeof alias !== "string") throw new Error("No user alias");

  await serverSideHelpers.profile.getUserByAlias.prefetch({ alias });
  await serverSideHelpers.post.infinitePosts.prefetchInfinite({
    authorAlias: alias,
    limit: POST_BATCH_SIZE,
  });

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
