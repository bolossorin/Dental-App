import {useEffect} from "react";

// libs
import Router, {useRouter} from "next/router";

// components
import {routes} from "../utils/routes";
import Skeleton from "react-loading-skeleton";

const Page404 = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.asPath === '/admin') Router.push(routes.dashboard);
    if (router.asPath === '/dentist') Router.push(routes.profile);
  }, [])
  return (<Skeleton height={'100vh'} />)
}

export default Page404;
