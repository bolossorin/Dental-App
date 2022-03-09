import { GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import { Header } from "../components";
import { Footer } from "../components/Footer/Footer";
import Search from "../components/Search";
import { useLocalData } from "../hooks/useLocalData";
import Skeleton from "react-loading-skeleton";

const Home = (): JSX.Element => {
  const { loading } = useLocalData();
  return (
    <>
      <Head>
        <title>Dental App</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta property="og:locale" content="en_EN" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <section>
        {loading && <Skeleton width={"100vw"} height={"70px"} />}
        {!loading && <Header />}
        <Search />
        <Footer />
      </section>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const data = "data from pros";
  return {
    props: {
      data: {
        foo: "foo",
      },
    },
  };
};

// export const getServerSideProps: GetServerSideProps = async (context) => {try {
// 	console.log(process.env.GOOGLE_KEY)
// 	return {
// 		props: {
// 			data: {
// 				foo: 'foo'
// 			}
// 		}
// 	}
// 	} catch (err) {

// 	return {
// 		props: { error: 'Something went wrong' }}
// 	}
// }

interface HomeProps extends Record<string, unknown> {
  data: string;
}
