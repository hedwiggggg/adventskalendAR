import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDays } from '~/utils/days-map';

import Head from 'next/head';
import QRCode from '~/components/QRCode';

import clsx from 'clsx';
import styles from './styles.module.scss';

import type { GetStaticProps } from 'next';
import type { Days } from '~/utils/days-map';

import 'paper-css/paper.min.css';

function getArrayChunks<T>(array: T[], perChunk: number) {
  return array.reduce(
    (resultArray: T[][], item, index) => {
      const chunkIndex = Math.floor(index / perChunk);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] as T[];
      }

      resultArray[chunkIndex]
        .push(item);

      return resultArray;
    },
    
    [],
  );
}

export default (
  function Page(props: PageProps) {
    const { days } = props;

    const chunkedDayHashes = useMemo(
      function getChunkedDayHashes() {
        const dayHashes = Object.keys(days);
        return getArrayChunks(dayHashes, 12)
      },

      [days],
    );

    useEffect(
      function onMount() {
        document.body.classList.add('A4');
      },

      [],
    );

    return (
      <>
        <Head>
          <style>{'@page { size: A5 }'}</style>
        </Head>

        {chunkedDayHashes.map((dayHashes, i) => (
          <section key={i} className={clsx('sheet', styles.sheet)}>
            {dayHashes.map((hash) => (
              <QRCode key={hash} hash={hash} />
            ))}
          </section>
        ))}
      </>
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
