import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectTo = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.slug !== undefined) {
      const { slug } = router.query;
      window.location.assign(`https://${slug}`);
    }
  }, [router]);

  return <></>;
};

export default RedirectTo;
