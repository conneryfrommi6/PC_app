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

//для favicon
// const favicon = require('serve-favicon');
// const path = require('path');

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "pc-repair",
  password: ""
});


// // // тестирование подключения
// connection.connect(function (err) {
//   if (err) {
//     return console.error("Ошибка: " + err.message);
//   } else {
//     console.log("Подключение к серверу MySQL успешно установлено");
//   }
// });

app.set("view engine", "hbs");


// получение списка услуг для веб-сайта
app.get("/our_services", function(req, res){
  pool.query("SELECT * FROM services", function(err, data) {
    if(err) return console.log(err);
    res.render("services_website.hbs", {
      services: data
    });
  });
});

// получение списка услуг
app.get("/services", function(req, res){
  pool.query("SELECT * FROM services", function(err, data) {
    if(err) return console.log(err);
    res.render("services.hbs", {
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

// получение списка специализаций
app.get("/specializations", function(req, res){
  pool.query("SELECT * FROM specialization", function(err, data) {
    if(err) return console.log(err);
    res.render("specializations.hbs", {
      specialization: data
    });
  });
});


// получение списка для авторизации
app.get("/auth", function(req, res){
  pool.query("SELECT * FROM authorization", function(err, data) {
    if(err) return console.log(err);
    res.render("auth.hbs", {
      authorization: data
    });
  });
});

// переход на общую страницу для работы с базой
app.get("/", function(req, res){
      res.render("index.hbs")
});


// возвращаем форму для добавления данных
app.get("/create_master", function(req, res){
  res.render("create_master.hbs");
});


app.get("/create_master", function(req, res){
  pool.query("SELECT * FROM masters", function(err, data) {
    if(err) return console.log(err);
    res.render("create_master.hbs", {
      masters: data
    });
  });
});

// получаем отправленные данные и добавляем их в БД
app.post("/create_master", urlencodedParser, function (req, res) {

  if(!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const address = req.body.address;
  const phone = req.body.phone;
  const email = req.body.email;
  const specialization = req.body.specialization;

  pool.query("INSERT INTO masters (name_master, adress, phone, email, id_specialization) VALUES (?,?,?,?,?)", [name, address, phone, email, specialization], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/masters");
  });
});



app.listen(3000, "127.0.0.1");

app.use('/css', express.static('css'));
app.use( '/assets', express.static('assets'));
app.use( '/scripts', express.static('scripts'));
// app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
