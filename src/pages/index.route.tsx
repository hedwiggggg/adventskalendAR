import { useCallback } from 'react';
import { getDays } from '~/utils/days-map';

import useScanner from '~/hooks/use-scanner';
import styles from './styles.module.scss';

import Head from 'next/head';
import loadingGif from '~/assets/loading.gif';

import type { GetStaticProps } from 'next';
import type { Days } from '~/utils/days-map';

const overlayStyles = {
  backgroundImage: `url(${loadingGif.src})`,
};

export default (
  function Page(props: PageProps) {
    const { days } = props;
    const scanner = useScanner({
      onScanStart: useCallback(
        (hash, overlayVideo) => {
          overlayVideo.src = '';

          if (hash in days) {
            import('~/__generated/' + hash + '.mp4')
              .then(({ default: video }) => {
                overlayVideo.src = video;
                overlayVideo.autoplay = true;
                overlayVideo.muted = true;
                overlayVideo.loop = true;
              })
          }
        },

        [days],
      ),
    });

    return (
      <div className={styles.container}>
        <Head>
          <link rel="preload" as="image" href={loadingGif.src} />
        </Head>

        <video
          ref={scanner.refs.video}
          className={styles.video}
          style={overlayStyles}
        
          disableRemotePlayback
          autoPlay
          muted
          loop
        />

        <canvas
          ref={scanner.refs.canvas}
          className={styles.canvas}
        />
      </div>
    );
  }
);

type PageProps = {
  days: Days;
};

export const getStaticProps: GetStaticProps<PageProps> = (
  async function getStaticProps() {
    return {
      props: {
        days: await getDays(),
      },
    };
  }
);