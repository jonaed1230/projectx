import React from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import QRCode from 'qrcode.react';

import Header from '../../../components/header';
import Styles from '../../../styles/Attendance.module.css';

const index = ({ data: respData }) => {
  const router = useRouter();
  const { data, errors } = respData;

  if (!data && typeof window !== 'undefined') {
    router.push('/login');
  }

  if (errors?.length) return <div>Failed to load</div>;

  return (
    <div>
      <Header user={data?.me} />
      <div className={Styles.container}>
        <div className={Styles.innercontainer}>
        <p className={Styles.header}>Give Attendance Using Your Cellphone</p>
        <QRCode value={`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`} />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const res = await fetch("http://localhost:3000/api", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      authorization: getCookie("token", context),
    },
    body: JSON.stringify({ query: "{ me { id name email role } }" }),
  });
  const data = await res.json();
  return { props: { data } };
}

export default index;