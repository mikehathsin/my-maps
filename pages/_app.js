import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDDAbzY6g9l1Dsr6Nofw9Odwtae0DZ6_TU",
  authDomain: "maps-7f8a7.firebaseapp.com",
  projectId: "maps-7f8a7",
  storageBucket: "maps-7f8a7.appspot.com",
  messagingSenderId: "295831629478",
  appId: "1:295831629478:web:1aba029c82f73ed2554e67",
};

const app = initializeApp(firebaseConfig);

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} firebase={app} />;
}

export default MyApp;
