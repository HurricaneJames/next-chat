import type { GetStaticProps } from "next";
import SuperJSON from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import CreatePost from "~/components/createPost";
import Layout from "~/components/layout";
import PostFeed from "~/components/PostFeed";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";

const POST_BATCH_SIZE = 10;

export default function Home() {
  return (
    <Layout>
      <CreatePost />
      <PostFeed batchSize={POST_BATCH_SIZE} />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const serverSideHelpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, session: null },
    transformer: SuperJSON,
  });

  await serverSideHelpers.post.infinitePosts.prefetchInfinite({
    limit: POST_BATCH_SIZE,
  });

  return {
    props: {
      trpcState: serverSideHelpers.dehydrate(),
    },
  };
};
