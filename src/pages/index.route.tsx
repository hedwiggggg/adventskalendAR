import { useCallback } from 'react';
import { getDays } from '~/utils/days-map';

import useScanner from '~/hooks/use-scanner';
import styles from './styles.module.scss';

import loadingGif from '~/assets/loading.gif';

import type { GetStaticProps } from 'next';
import type { Days } from '~/utils/days-map';

export default (
  function Page(props: PageProps) {
    const { days } = props;
    const scanner = useScanner({
      onReady: useCallback(
        () => console.log('onReady', props),
        [days],
      ),

      onScanStart: useCallback(
        (hash) => {
          if (scanner.refs.video.current)
            scanner.refs.video.current.src = '';

          if (hash in days) {
            console.log('match', hash);

            import('~/__generated/' + hash + '.mp4')
              .then(({ default: video }) => {
                console.log(video);

                if (scanner.refs.video.current) {
                  scanner.refs.video.current.src = video;
                  scanner.refs.video.current.autoplay = true;
                  scanner.refs.video.current.muted = true;
                  scanner.refs.video.current.loop = true;
                }
              })
          }
        },

        [days],
      ),

      onScanEnd: useCallback(
        () => {},
        [],
      ),
    });

    return (
      <div className={styles.container}>
        <video
          ref={scanner.refs.video}
          className={styles.video}

          style={{
            backgroundImage: `url(${loadingGif.src})`,
          }}
        
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