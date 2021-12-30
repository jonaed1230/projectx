import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

import Header from "../../components/header";
import Styles from "../../styles/Attendance.module.css";

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const index = ({ data: respData }) => {
  const [hasData, setHasData] = useState(
    respData?.data?.attendance?.length ? true : false
  );
  const router = useRouter();
  const { data, errors } = respData;

  if (!data && typeof window !== "undefined") {
    router.push("/login");
  }

  if (errors?.length) return <div>Failed to load</div>;

  const handleScan = (scanData) => {
    if (
      scanData ===
        `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}` &&
      !hasData
    ) {
      setHasData(true);
      fetch("https://jonaed.live/api", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: getCookie("token", router),
        },
        body: JSON.stringify({
          query: `
          mutation CREATE_ATTENDANCE_MUTATION($user_id: Int!) {
            createAttendance(user_id: $user_id) {
              message
            }
          }
        `,
          variables: { user_id: Number(data?.me?.id) },
        }),
      });
    }
  };
  return (
    <div>
      <Header user={data?.me} />
      <div className={Styles.container}>
        <div className={Styles.innercontainer}>
          {!hasData ? (
            <>
              <p className={Styles.header}>Scan the qr code from PC</p>
              <QrReader
                delay={300}
                onScan={handleScan}
                style={{ width: "100%" }}
              />
            </>
          ) : (
            <p>Your Attendance is counted!!</p>
          )}
        </div>
      </div>
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
    body: JSON.stringify({
      query: "{ me { id name email role } attendance { id } }",
    }),
  });
  const data = await res.json();
  return { props: { data } };
}

export default index;
