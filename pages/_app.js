import '../css/stylesheet.css'
import Head from 'next/head'
import Link from 'next/link'
import Logo from '../components/Logo'
import { useEffect, useState } from 'react'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps }) {
  // /* Hooks for Contentful logos */
  // const [logos, setLogos] = useState([]);
  // const { getLogos } = useContentful();
  // /* Logos are rendered in the bottommost div in the return */

  // /* Use this to see what getLogos outputs:
  // getLogos().then((response) => console.log(response)); */

  // useEffect(() => {
  //   getLogos().then((response) => setLogos(response));
  // });

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Head>
          <title>African Library Project Portal</title>
        </Head>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp
