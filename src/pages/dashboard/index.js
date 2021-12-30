/* eslint-disable */
import React from "react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Header from "../../components/header";
import Styles from "../../styles/Dashboard.module.css";

const index = ({ data: respData, users, tasks }) => {
  const router = useRouter();
  const { data, errors } = respData;

  if (!data && typeof window !== "undefined") {
    router.push("/login");
  }
  console.log(tasks);
  if (errors?.length) return <div>Failed to load</div>;

  return (
    <div>
      <Header user={data?.me} />
      {data?.me?.role === "ADMIN" ? (
        <div className={Styles.tablebox}>
          <div className={Styles.tableboxinner}>
            <div className={Styles.caption}>Today's Attendee</div>
            <table className={Styles.table}>
              <thead>
                <tr>
                  <th className={Styles.tablehead}>Name</th>
                  <th className={Styles.tablehead}>Email</th>
                </tr>
              </thead>
              <tbody>
                {users?.data?.attendances?.map((user) => (
                  <tr key={user?.id}>
                    <td className={Styles.tabledata}>{user?.name}</td>
                    <td className={Styles.tabledata}>{user?.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={Styles.tablebox}>
          <div className={Styles.tableboxinner}>
            <div className={Styles.caption}>Your tasks</div>
            <table className={Styles.table}>
              <thead>
                <tr>
                  <th className={Styles.tablehead}>Title</th>
                  <th className={Styles.tablehead}>Description</th>
                </tr>
              </thead>
              <tbody>
                {tasks?.data?.tasks?.map((task) => (
                  <tr key={task?.id}>
                    <td className={Styles.tabledata}>{task?.title}</td>
                    <td className={Styles.tabledata}>{task?.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
    body: JSON.stringify({ query: "{ me { id name email role } }" }),
  });
  const data = await res.json();
  if (data?.data?.me.role === "ADMIN") {
    const res2 = await fetch("https://jonaed.live/api", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: getCookie("token", context),
      },
      body: JSON.stringify({
        query: "{ attendances { id created_at email role name } }",
      }),
    });
    const data2 = await res2.json();
    return { props: { data, users: data2 } };
  }
  const res2 = await fetch("https://jonaed.live/api", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      authorization: getCookie("token", context)
    },
    body: JSON.stringify({
      query: "{ tasks { id title description } }",
    }),
  });
  const data2 = await res2.json();
  return { props: { data, tasks: data2 } };
}

export default index;
