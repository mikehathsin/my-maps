import React, { useState, useEffect } from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore/lite";

import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("../components/map"), {
  ssr: false,
});

const Home = ({ firebase }) => {
  const [marks, setMarks] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore(firebase);
    async function getMarks() {
      const marksCol = collection(db, "marks");
      const markSnapshot = await getDocs(marksCol);
      const markList = markSnapshot.docs.map((doc) => doc.data());
      return markList;
    }
    async function addMark({ latitude, longitude, country, ip }) {
      try {
        const createdAt = Date.now();
        const docRef = await addDoc(collection(db, "marks"), {
          latitude,
          longitude,
          country,
          ip,
          createdAt,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    function success(pos) {
      var crd = pos.coords;
      setLatitude(crd.latitude);
      setLongitude(crd.longitude);
      addMark({ latitude: crd.latitude, longitude: crd.longitude }).then(() => {
        setLoading(false);
      });
    }
    function error(err) {
      console.warn("ERROR(" + err.code + "): " + err.message);
      fetch("/api/location")
        .then((res) => res.json())
        .then((data) => {
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          if (marks.some((mark) => mark.ip === data.IPv4)) {
            return;
          }
          addMark({
            latitude: data.latitude,
            longitude: data.longitude,
            country: data.country_name,
            ip: data.IPv4,
          }).then(() => {
            setLoading(false);
          });
        });
    }
    getMarks().then((marks) => {
      setMarks(marks);
      navigator.geolocation.getCurrentPosition(success, error, options);
    });
  }, []);

  if (loading) {
    return (
      <>
        <div className="content">
          <h1>Maps</h1>
          <h2>Cargando</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Home" />
      <div className="content">
        <h1>Maps</h1>
      </div>
      <div>
        <ul style={{ height: 200, overflow: "scroll" }}>
          {marks.map((mark) => {
            return (
              <li key={mark.createdAt}>
                <h2>Pais: {mark.country}</h2>
                <p>IP: {mark.ip}</p>
                <p>Conectado el: {new Date(mark.createdAt).toString()}</p>
                <p>Latitud: {mark.latitude}</p>
                <p>Longitud: {mark.longitude}</p>
              </li>
            );
          })}
        </ul>
        <MapWithNoSSR marks={marks} latitude={latitude} longitude={longitude} />
      </div>
    </>
  );
};

export default Home;
