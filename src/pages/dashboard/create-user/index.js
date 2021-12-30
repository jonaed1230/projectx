import React from "react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import Header from "../../../components/header";
import Styles from "../../../styles/Login.module.css";

const index = ({ data: respData }) => {
  const router = useRouter();
  const { data, errors } = respData;

  if (errors?.length) return <div>Failed to load</div>;

  if (!data && typeof window !== "undefined") {
    router.push("/login");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { name, email, password } = e.target;
    const data = {
      name: name.value,
      email: email.value,
      password: password.value,
      role: "EMPLOYEE"
    };
    fetch("http://localhost:3000/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      authorization: getCookie("token"),
      },
      body: JSON.stringify({
        query: `mutation CREATE_USER_MUTATION($name: String!, $email: String!, $password: String!, $role: String!) {
          createUser(name: $name, email: $email, password: $password, role: $role) {
          message
        }
      }`,
        variables: data,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        router.push("/dashboard/users");
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
              <label className={Styles.loginlabel}>Create User</label>
              <input
                className={Styles.logininput}
                type="text"
                name="name"
                placeholder="Name"
                required
              />
              <input
                className={Styles.logininput}
                type="email"
                name="email"
                placeholder="Email"
                required
              />
              <input
                className={Styles.logininput}
                type="password"
                name="password"
                placeholder="Password"
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
    body: JSON.stringify({ query: "{ me { id name email role } }" }),
  });
  const data = await res.json();
  return { props: { data } };
}

export default index;
