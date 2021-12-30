/* eslint-disable */
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

const index = ({ data }) => {
  const router = useRouter();
  const { data: userData, errors } = data;

  if (errors?.length) return <div>Failed to load</div>

  if (userData.me && typeof window !== 'undefined') {
    router.push('/dashboard');
  } else if (typeof window !== 'undefined') {
    router.push('/login');
  }
  return (
    <div>
      {JSON.stringify(userData)}
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch('https://jonaed.live/api', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      authorization: getCookie("token", context),
      },
    body: JSON.stringify({ query: '{ me { id } }' }),
  });
  const data = await res.json();
  return { props: { data } };
}

export default index;