import { GetStaticProps, GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import { Header } from "../components";
import PaymentContent from "../components/payment";
import { Footer } from "../components/Footer/Footer";
import { useLocalData } from "../hooks/useLocalData";
import Skeleton from "react-loading-skeleton";

const Payment = (): JSX.Element => {
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
        <Header />
        {/* payment */}
        <>
          <div
            className="main-profile bg-white biling"
            style={{ minHeight: "unset", maxHeight: "unset" }}
          >
            <div className="profile-box-form">
              <div className="form-info-block">
                <div>
                  <p className="form-login-title green px20">
                    Purchase subscription
                  </p>
                  <p className="form-login-subtitle gray px12 mb-6px" />
                </div>
              </div>
              <div
                className="box-to-box "
                style={{ marginTop: "-20px", marginBottom: "10%" }}
              >
                <PaymentContent />
              </div>
            </div>
          </div>
        </>
        <Footer />
      </section>
    </>
  );
};

export default Payment;

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
