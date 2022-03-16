// libs
import {ToastContainer} from "react-toastify";
import type {AppProps} from "next/app";

// components
import {AppProvider} from "../context/app.context";

// assets
import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";

function ApplicationWrapper({Component, pageProps}: AppProps): JSX.Element {
  return (
    <AppProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </AppProvider>
  );
}

export default ApplicationWrapper;
