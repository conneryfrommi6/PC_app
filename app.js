// const mysql = require("mysql2");
//
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "pc-repair",
//   password: ""
// });
//
// // тестирование подключения
// connection.connect(function (err) {
//   if (err) {
//     return console.error("Ошибка: " + err.message);
//   } else {
//     console.log("Подключение к серверу MySQL успешно установлено");
//   }
// });
//
// connection.query("SELECT * FROM services",
//  function(err, results) {
//    const container = document.querySelector(".test");
//    const servicesList = document.createElement('p');
//    container.appendChild(servicesList);
//
//    servicesList.innerHTML=results;
//    // console.log(err);
//    // console.log(results); // собственно данные
//  });
//
//
// // закрытие подключения
// connection.end(function(err) {
//   if (err) {
//     return console.log("Ошибка: " + err.message);
//   }
//   console.log("Подключение закрыто");
// });



const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "pc-repair",
  password: ""
});

app.set("view engine", "hbs");

// получение списка услуг
app.get("/", function(req, res){
  pool.query("SELECT * FROM services", function(err, data) {
    if(err) return console.log(err);
    res.render("index.hbs", {
      services: data
    });
  });
});

// получение списка клиентов
app.get("/clients", function(req, res){
  pool.query("SELECT * FROM clients", function(err, data) {
    if(err) return console.log(err);
    res.render("clients.hbs", {
      clients: data
    });
  });
});

// получение списка мастеров
app.get("/masters", function(req, res){
  pool.query("SELECT * FROM masters", function(err, data) {
    if(err) return console.log(err);
    res.render("masters.hbs", {
      masters: data
    });
  });
});

// получение списка заказов
app.get("/orders", function(req, res){
  pool.query("SELECT * FROM orders", function(err, data) {
    if(err) return console.log(err);
    res.render("orders.hbs", {
      orders: data
    });
  });
});

app.listen(3000);

