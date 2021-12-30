import React from "react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

const logout = () => {
  const router = useRouter();
  fetch("https://jonaed.live/api", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      authorization: getCookie("token"),
    },
    body: JSON.stringify({
      query: `mutation LOGOUT_MUTATION {
          logout {
            message
          }
        }`,
    }),
  }).then((res) => {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
  });
  return <div>Logging out!</div>;
};

export default logout;
