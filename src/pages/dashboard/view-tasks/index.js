import React from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

const index = ({ data: respData }) => {
  const router = useRouter();
  const { data, errors } = respData;

  if (errors?.length) return <div>Failed to load</div>;

  if (!data && typeof window !== 'undefined') {
    router.push('/login');
  }

  return (
    <div>
      Hello world
    </div>
  );
};

export async function getServerSideProps(context) {
  const res = await fetch("https://jonaed.live/api", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      authorization: getCookie("token", context),
    },
    body: JSON.stringify({ query: "{ me { id } }" }),
  });
  const data = await res.json();
  return { props: { data } };
}

export default index;