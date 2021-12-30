import React from "react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Header from "../../../components/header";
import Styles from "../../../styles/Login.module.css";

const index = ({ data: respData }) => {
  const router = useRouter();
  const { data, errors } = respData;

  if (!data && typeof window !== "undefined") {
    router.push("/login");
  }
  if (errors?.length) return <div>Failed to load</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { user_id, title, description } = e.target;
    const data = {
      user_id: Number(user_id.value),
      title: title.value,
      description: description.value,
    };
    fetch("http://localhost:3000/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: getCookie("token"),
      },
      body: JSON.stringify({
        query: `mutation CREATE_TASK_MUTATION($user_id: Int!, $title: String!, $description: String!) {
          createTask(user_id: $user_id, title: $title, description: $description) {
          message
        }
      }`,
        variables: data,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        router.push("/dashboard");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <Header user={data?.me} />
      <div className={Styles.loginbody}>
        <div className={Styles.loginmain}>
          <div className={Styles.login}>
            <form onSubmit={handleSubmit}>
              <label className={Styles.loginlabel}>Assign Tasks</label>
              <select
                name="user_id"
                className={Styles.logininput}
                defaultValue=""
              >
                <option disabled value="">
                  Select User
                </option>
                {data?.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <input
                className={Styles.logininput}
                type="text"
                name="title"
                placeholder="Title"
                required
              />
              <textarea
                className={Styles.logininput}
                name="description"
                placeholder="Description"
                required
              />
              <button className={Styles.loginsubmit}>Create</button>
            </form>
          </div>
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
    body: JSON.stringify({
      query: "{ me { id name email role } users { id name } }",
    }),
  });
  const data = await res.json();
  return { props: { data } };
}

export default index;
