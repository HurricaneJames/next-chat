import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "~/components/layout";
import { api } from "~/utils/api";

export default function Alias() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const alias = router.query.alias;

  return (
    <Layout>
      <Head>
        <title>Next-Chat: {alias}</title>
      </Head>
      <p>User: {alias}</p>
    </Layout>
  );
}
