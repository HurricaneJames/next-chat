import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "~/components/layout";
import { db } from "~/server/db";
import { api } from "~/utils/api";

type PageProps = {
  alias: string;
};
export default function ProfilePage(props: PageProps) {
  const alias = props.alias;
  const router = useRouter();
  const { data: sessionData } = useSession();

  const { data: user, isLoading: isLoadingUser } =
    api.profile.getProfileWithPosts.useQuery({
      alias,
    });

  return (
    <Layout>
      <Head>
        <title>Next-Chat: {alias}</title>
      </Head>
      <p>User: {alias}</p>
    </Layout>
  );
}

import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { GetStaticProps } from "next";
import SuperJSON from "superjson";

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
