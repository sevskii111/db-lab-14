const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const express = require("express");

const app = express();
const db = new sqlite3.Database("./chinook.db");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});
app.get("/find", (req, res) => {
  const { artist_name } = req.query;
  let result = [];
  db.each(
    ` SELECT tracks.name 
      FROM artists 
      LEFT JOIN albums USING(ArtistId)
      LEFT JOIN tracks USING(AlbumId) 
      WHERE artists.name LIKE '%${artist_name}%'`,
    function (err, row) {
      result.push(row.Name);
    },
    function () {
      res.json(result);
    }
  );
});

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("App is running");
  }
});
