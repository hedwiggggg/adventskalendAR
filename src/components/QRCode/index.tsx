import { useEffect, useState } from 'react';

import QRCodeFrame from '~/components/QRCodeFrame';
import QRCodeImage from '~/components/QRCodeImage';

import styles from './styles.module.scss';

type QRCodeProps = {
  hash: string;
};

type ImageObject = {
  src: string;
};

export default (
  function QRCode(props: QRCodeProps) {
    const { hash } = props;
    const [qrCode, setQRCode] = useState<ImageObject>();

    useEffect(
      function loadQrCode() {
        import('~/__generated/' + hash + '.png')
          .then(({ default: image }) => setQRCode(image));
      },

      [hash],
    );

    return (
      <div className={styles.qrcode}>
        <QRCodeFrame />
        <QRCodeImage src={qrCode?.src} />
      </div>
    );
  }
);
