const { Client } = require("pg");
const client = new Client();

client.connect();

client.query(
  'SELECT * FROM cases WHERE collect_date = "2021-05-01"',
  (err, res) => {
    if (!err) {
      console.log(res.rows[1]);
    } else {
      console.log(err.message);
    }
    client.end;
  }
);
