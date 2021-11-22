import '~/styles/globals.scss';

import type { AppProps } from 'next/app';

export default (
  function AventsKalendarApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
  }
);
