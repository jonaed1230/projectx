import React from "react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Header from "../../../components/header";
import Styles from "../../../styles/Dashboard.module.css";

const index = ({ data: respData }) => {
  const router = useRouter();
  const { data, errors } = respData;

  if (!data && typeof window !== "undefined") {
    router.push("/login");
  }
  if (errors?.length) return <div>Failed to load</div>;

  return (
    <div>
      <Header user={data?.me} />
      <div className={Styles.tablebox}>
        <div className={Styles.tableboxinner}>
          <div className={Styles.caption}>Users</div>
          <table className={Styles.table}>
            <thead>
              <tr>
                <th className={Styles.tablehead}>Name</th>
                <th className={Styles.tablehead}>Email</th>
              </tr>
            </thead>
            <tbody>
              {data?.users?.map((user) => (
                <tr key={user?.id}>
                  <td className={Styles.tabledata}>{user?.name}</td>
                  <td className={Styles.tabledata}>{user?.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
      query: "{ me { id name email role } users { id name email } }",
    }),
  });
  const data = await res.json();

  return { props: { data } };
}

export default index;
