import styles from './styles.module.scss';

type QRCodeImageProps = {
  src?: string;
};

export default (
  function QRCodeImage(props: QRCodeImageProps) {
    const { src } = props;

    return (
      <img
        src={src}
        className={styles.image}
      />
    );
  }
);
