var Client = require("pg");
// const testdd = require("http");
// import http from "http";
// const { Client } = require(["pg"]);

// client.query("SELECT * FROM cases", (err, res) => {
//   if (!err) {
//     console.log(res.rows[1]);
//   } else {
//     console.log(err.message);
//   }
//   client.end;
// });
export default function res() {
  const client = new Client({
    host: "covidData",
    user: "postgres",
    port: 5432,
    password: "password",
    database: "covid19",
  });

  client.connect();
  return client.query("SELECT * FROM cases");
}
