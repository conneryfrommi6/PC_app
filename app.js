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

// import {runServer} from "/scripts/server";
// import * as app from "express";
// runServer();

// import {createSpecialization} from "/scripts/specialization_create";
// createSpecialization();
//
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

app.set("view engine", "hbs");


// // задание формата даты
// app.get("/orders", function (req, res) {
//   pool.query("SELECT DATE_FORMAT(\"2008-11-19\",'%d.%m.%Y')", function (err) {
//     if (err) {return console.log(err);}
// console.log('Date format is Russian');
//   });
// });


// получение списка услуг для веб-сайта
app.get("/our_services", function (req, res) {
  pool.query("SELECT * FROM services", function (err, data) {
    if (err) return console.log(err);
    res.render("services_website.hbs", {
      services: data
    });
  });
});

// получение списка услуг
app.get("/services", function (req, res) {
  pool.query("SELECT * FROM services", function (err, data) {
    if (err) return console.log(err);
    res.render("services.hbs", {
      services: data
    });
  });
});

// получение списка клиентов
app.get("/clients", function (req, res) {
  pool.query("SELECT * FROM clients", function (err, data) {
    if (err) return console.log(err);
    res.render("clients.hbs", {
      clients: data
    });
  });
});

// получение списка мастеров
app.get("/masters", function (req, res) {
  pool.query("SELECT * FROM masters", function (err, data) {
    if (err) return console.log(err);
    res.render("masters.hbs", {
      masters: data
    });
  });
});

// получение списка заказов

// pool.query("SELECT id_order, DATE_FORMAT(date_order,'%d.%m.%Y'), name_device, date_finish, paid, returned, price_final, comments, id_client, id_master, id_service FROM orders", function (err, data) {
app.set ('/ru', function(req, res){
  console.log('Russian now');
});

app.get("/orders", function (req, res) {
  pool.query("SELECT * FROM orders", function (err, data) {
    if (err) return console.log(err);
    res.render("orders.hbs", {
      orders: data
    });
  });
});

// получение списка специализаций
app.get("/specializations", function (req, res) {
  pool.query("SELECT * FROM specializations", function (err, data) {
    if (err) return console.log(err);
    res.render("specializations.hbs", {
      specializations: data
    });
  });
});


// получение списка для авторизации
app.get("/auth", function (req, res) {
  pool.query("SELECT * FROM authorization", function (err, data) {
    if (err) return console.log(err);
    res.render("auth.hbs", {
      authorization: data
    });
  });
});

// переход на общую страницу для работы с базой
app.get("/", function (req, res) {
  res.render("index.hbs")
});


// ////// Добавление мастера ////////////////

// возвращаем форму для добавления данных
app.get("/create_master", function (req, res) {
  res.render("create_master.hbs");
});

app.get("/create_master", function (req, res) {
  pool.query("SELECT * FROM masters", function (err, data) {
    if (err) return console.log(err);
    res.render("create_master.hbs", {
      masters: data
    });
  });
});

// получаем отправленные данные и добавляем их в БД
app.post("/create_master", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const address = req.body.address;
  const phone = req.body.phone;
  const email = req.body.email;
  const specialization = req.body.specialization;

  pool.query("INSERT INTO masters (name_master, adress, phone, email, id_specialization) VALUES (?,?,?,?,?)", [name, address, phone, email, specialization], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/masters");
  });
});

// ////// Добавление специализации ////////////////

// возвращаем форму для добавления данных
app.get("/create_specialization", function (req, res) {
  res.render("create_spec.hbs");
});

app.get("/create_specialization", function (req, res) {
  pool.query("SELECT * FROM specializations", function (err, data) {
    if (err) return console.log(err);
    res.render("create_spec.hbs", {
      specializations: data
    });
  });
});

// получаем отправленные данные и добавляем их в БД
app.post("/create_specialization", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;

  pool.query("INSERT INTO specializations (specialization) VALUES (?)", [name], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/specializations");
  });
});


// ////// Добавление клиента ////////////////

// возвращаем форму для добавления данных
app.get("/create_client", function (req, res) {
  res.render("create_client.hbs");
});

app.get("/create_client", function (req, res) {
  pool.query("SELECT * FROM clients", function (err, data) {
    if (err) return console.log(err);
    res.render("create_client.hbs", {
      clients: data
    });
  });
});

// получаем отправленные данные и добавляем их в БД
app.post("/create_client", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);

  const name = req.body.name;
  const address = req.body.address;
  const phone = req.body.phone;
   if (req.body.vip==="") {
   var vip=0;
  }
   else {
     vip = req.body.vip;
   }
  if (req.body.email==="") {
    var email=" ";
  }
  else {
    email = req.body.email;
  }


  pool.query("INSERT INTO clients (name_client, adress, phone, email, vip) VALUES (?,?,?,?,?)", [name, address, phone, email, vip], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/clients");
  });
});

// ////// Добавление услуги ////////////////

// возвращаем форму для добавления данных
app.get("/create_service", function (req, res) {
  res.render("create_service.hbs");
});

app.get("/create_service", function (req, res) {
  pool.query("SELECT * FROM services", function (err, data) {
    if (err) return console.log(err);
    res.render("create_service.hbs", {
      services: data
    });
  });
});

// получаем отправленные данные и добавляем их в БД
app.post("/create_service", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const price = req.body.price;
  const guarantee = req.body.guarantee;

  pool.execute("INSERT INTO services (name_service, price, guarantee) VALUES (?,?,?)", [name, price, guarantee], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/services");
  });
});

/ ////// Добавление заказа ////////////////

// возвращаем форму для добавления данных
app.get("/create_order", function (req, res) {
  res.render("create_order.hbs");
});

app.get("/create_order", function (req, res) {
  pool.query("SELECT * FROM orders", function (err, data) {
    if (err) return console.log(err);
    res.render("create_order.hbs", {
      orders: data
    });
  });
});

// получаем отправленные данные и добавляем их в БД
app.post("/create_order", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  const date_order = req.body.date_order;
  const name = req.body.name;
  const client = req.body.client;
  const master = req.body.master;
  const service = req.body.service;

  if (req.body.comments==="") {
    var comments=" ";
  }
  else {
    comments = req.body.comments;
  }

  pool.execute("INSERT INTO orders (date_order, name_device, comments, id_client, id_master, id_service) VALUES (?,?,?,?,?,?)", [date_order, name, comments, client, master, service], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/orders");
  });
});


// ///// Удаление записей //////

app.post("/delete_service/:id", function(req, res){

  const id = req.params.id;
  pool.query("DELETE FROM services WHERE id_service=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/services");
  });
});

app.post("/delete_master/:id", function(req, res){

  const id = req.params.id;
  pool.query("DELETE FROM masters WHERE id_master=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/masters");
  });
});

app.post("/delete_client/:id", function(req, res){

  const id = req.params.id;
  pool.query("DELETE FROM clients WHERE id_client=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/clients");
  });
});

app.post("/delete_spec/:id", function(req, res){

  const id = req.params.id;
  pool.query("DELETE FROM specializations WHERE id_specialization=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/specializations");
  });
});

app.post("/delete_order/:id", function(req, res){

  const id = req.params.id;
  pool.query("DELETE FROM orders WHERE id_order=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/orders");
  });
});





// pool.end(function(err) {
//   if (err) {
//     return console.log(err.message);
//   }
//   console.log("Pool closed");
// });





app.listen(3000, "127.0.0.1");

app.use('/css', express.static('css'));
app.use('/assets', express.static('assets'));
app.use('/scripts', express.static('scripts'));
// app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
