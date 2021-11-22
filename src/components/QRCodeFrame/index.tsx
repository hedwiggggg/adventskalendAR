import styles from './styles.module.scss';

export default (
  function QRCode() {
    return (
      <svg
        className={styles.frame}

        width="100%"
        height="100%"

        viewBox="0 0 733 875"
        version="1.1"

        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"

        fillRule="evenodd"
        clipRule="evenodd"

        strokeLinejoin="round"
        strokeMiterlimit="2"
      >
        <path
          fill="black"
          d="M0,167.029c-0,-15.956 7.386,-31.015 20.003,-40.783c37.378,-28.938 116.943,-90.537 149.126,-115.452c9.038,-6.997 20.144,-10.794 31.574,-10.794l330.878,0c11.43,0 22.536,3.797 31.574,10.794c32.182,24.915 111.748,86.514 149.126,115.452c12.617,9.768 20.002,24.827 20.002,40.783c0,133.168 0,515.99 0,655.41c0,28.485 -23.091,51.577 -51.576,51.577l-629.13,-0c-28.485,-0 -51.577,-23.092 -51.577,-51.577l0,-655.41Zm11.811,0c0,-12.302 5.694,-23.912 15.422,-31.444c37.378,-28.937 116.944,-90.537 149.126,-115.452c6.968,-5.395 15.531,-8.322 24.344,-8.322l330.878,0c8.812,0 17.375,2.927 24.343,8.322c32.183,24.915 111.748,86.515 149.126,115.452c9.728,7.532 15.422,19.142 15.422,31.444c0,133.168 0,515.99 0,655.41c0,21.962 -17.803,39.766 -39.765,39.766c-134.473,-0 -494.657,-0 -629.13,-0c-21.962,-0 -39.766,-17.804 -39.766,-39.766l0,-655.41Zm354.331,-113.899c9.789,-0 17.736,7.947 17.736,17.736c0,9.789 -7.947,17.736 -17.736,17.736c-9.789,0 -17.737,-7.947 -17.737,-17.736c0,-9.789 7.948,-17.736 17.737,-17.736Z"
        />
      </svg>
    );
  }
);
