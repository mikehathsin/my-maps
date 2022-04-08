import axios from "axios";

export default function handler(req, res) {
  axios(
    "https://geolocation-db.com/json/0215bdd0-b516-11ec-b0a9-fdbfeccd28cf"
  ).then(({ data }) => {
    res.status(200).json(data);
  });
}
