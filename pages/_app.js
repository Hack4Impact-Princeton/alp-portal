import '../css/style.css'
import '../css/form.css'
import Head from 'next/head'
import Link from 'next/link'
import Logo from '../components/Logo'
import { useEffect, useState } from 'react'
import useContentful from './useContentful'

function MyApp({ Component, pageProps }) {
  /* Hooks for Contentful logos */
  const [logos, setLogos] = useState([]);
  const { getLogos } = useContentful();
  /* Logos are rendered in the bottommost div in the return */

  /* Use this to see what getLogos outputs:
  getLogos().then((response) => console.log(response)); */

  useEffect(() => {
    getLogos().then((response) => setLogos(response));
  });

  return (
    <>
      <Head>
        <title>African Library Project Portal</title>
      </Head>

      <div className="grid wrapper">
        <Component {...pageProps} />
      </div>

      {/* <div>
        {logos.map((logo, index) => (
          <Logo key={index} logo={logo}/>
        ))}
      </div> */}
    </>
  )
}

export default MyApp
