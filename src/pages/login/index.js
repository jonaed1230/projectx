import React from "react";
import { useRouter } from "next/router";
import { getCookie, setCookies } from "cookies-next";
import Styles from "../../styles/Login.module.css";

const login = ({ data: respData }) => {
  const router = useRouter();
  const { data } = respData;

  if (data && typeof window !== "undefined") {
    router.push("/dashboard");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = e.target;
    const data = {
      email: email.value,
      password: password.value,
    };
    fetch("https://jonaed.live/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation LOGIN_MUTATION($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          message
        }
      }`,
        variables: data,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        router.push("/dashboard");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={Styles.loginbody}>
      <div className={Styles.loginmain}>
        <div className={Styles.login}>
          <form onSubmit={handleSubmit}>
            <label className={Styles.loginlabel}>Login</label>
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
            <button className={Styles.loginsubmit}>Login</button>
          </form>
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
    body: JSON.stringify({ query: "{ me { id } }" }),
  });
  const data = await res.json();
  return { props: { data } };
}

export default login;
