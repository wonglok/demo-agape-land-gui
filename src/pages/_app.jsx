import '../css/global.css'
// import Head from 'next/head'
// import { HeadMeta } from '_app/HeadMeta'
export default function Page({ Component, pageProps }) {
  return (
    <>
      {/* <Head></Head> */}
      <Component {...pageProps}></Component>
    </>
  )
}
