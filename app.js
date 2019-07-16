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
  pool.query("SELECT * FROM clients ORDER BY name_client", function (err, data) {
    if (err) return console.log(err);

    //меняем формат логического поля на человеческий
    data.forEach(function (element) {
      element.vip = element.vip ? "VIP" : "-";
    });

    res.render("clients.hbs", {
      clients: data
    });
  });
});

// получение списка мастеров
app.get("/masters", function (req, res) {
  pool.query("SELECT *, specializations.specialization FROM masters JOIN specializations on specializations.id_specialization=masters.id_specialization ORDER BY name_master", function (err, data) {
    if (err) return console.log(err);
    res.render("masters.hbs", {
      masters: data
    });
  });
});

// получение списка заказов

app.get("/orders", function (req, res) {
  pool.query("SELECT orders.id_order, orders.date_order, orders.name_device, orders.date_finish, orders.paid, orders.returned, orders.price_final, orders.comments, clients.name_client, services.name_service, masters.name_master FROM orders JOIN clients on clients.id_client=orders.id_client JOIN masters on masters.id_master=orders.id_master JOIN services on services.id_service=orders.id_service ORDER BY orders.id_order DESC", function (err, data) {
    if (err) return console.log(err);
    //console.log(data[0].date_order instanceof Date);
    // console.log(data[20]);


    // //////настройка вывода отображения данных //////////

    //меняем формат даты на человеческий
    data.forEach(function (element) {
      const dateOrder = new Date(element.date_order);
      const dateFin = new Date(element.date_finish);

      element.date_order = (("0" + dateOrder.getDate()).slice(-2)) + '.' + (("0" + (dateOrder.getMonth() + 1)).slice(-2)) + '.' + dateOrder.getFullYear();

      if (element.date_finish != null) {
        element.date_finish = (("0" + dateFin.getDate()).slice(-2)) + '.' + (("0" + (dateFin.getMonth() + 1)).slice(-2)) + '.' + dateFin.getFullYear();
      } else {
        element.date_finish = null;
      }

      //меняем формат логических полей на человеческий
      element.paid = element.paid ? "Да" : "Нет";
      element.returned = element.returned ? "Да" : "Нет";
    });

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
  if (req.body.vip === "") {
    var vip = 0;
  } else {
    vip = req.body.vip;
  }
  if (req.body.email === "") {
    var email = " ";
  } else {
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

  if (req.body.comments === "") {
    var comments = " ";
  } else {
    comments = req.body.comments;
  }

  pool.execute("INSERT INTO orders (date_order, name_device, comments, id_client, id_master, id_service) VALUES (?,?,?,?,?,?)", [date_order, name, comments, client, master, service], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/orders");
  });
});


// ///// Удаление записей //////

app.post("/delete_service/:id", function (req, res) {

  const id = req.params.id;
  pool.query("DELETE FROM services WHERE id_service=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/services");
  });
});

app.post("/delete_master/:id", function (req, res) {

  const id = req.params.id;
  pool.query("DELETE FROM masters WHERE id_master=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/masters");
  });
});

app.post("/delete_client/:id", function (req, res) {

  const id = req.params.id;
  pool.query("DELETE FROM clients WHERE id_client=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/clients");
  });
});

app.post("/delete_spec/:id", function (req, res) {

  const id = req.params.id;
  pool.query("DELETE FROM specializations WHERE id_specialization=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/specializations");
  });
});

app.post("/delete_order/:id", function (req, res) {

  const id = req.params.id;
  pool.query("DELETE FROM orders WHERE id_order=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/orders");
  });
});


// ////// Редактирование участков ///////

// получем id редактируемой специализации, получаем его из бд и отправлям с формой редактирования
app.get("/edit_spec/:id", function (req, res) {
  const id = req.params.id;
  pool.query("SELECT * FROM specializations WHERE id_specialization=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.render("edit_spec.hbs", {
      specializations: data[0]
    });
  });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/edit_spec/", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const id = req.body.id;

  pool.query("UPDATE specializations SET specialization=? WHERE id_specialization=?", [name, id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/specializations");
  });
});


// ////// Редактирование мастеров ///////

// получем id редактируемого мастера, получаем его из бд и отправлям с формой редактирования
app.get("/edit_master/:id", function (req, res) {
  const id = req.params.id;
  pool.query("SELECT * FROM masters WHERE id_master=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.render("edit_master.hbs", {
      masters: data[0]
    });
  });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/edit_master/", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const address = req.body.address;
  const phone = req.body.phone;
  const email = req.body.email;
  const specialization = req.body.specialization;
  const id = req.body.id;

  pool.query("UPDATE masters SET name_master=?, adress=?, phone=?, email=?, id_specialization=? WHERE id_master=?", [name, address, phone, email, specialization, id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/masters");
  });
});

// ////// Редактирование клиентов ///////

// получем id редактируемого клиента, получаем его из бд и отправлям с формой редактирования
app.get("/edit_client/:id", function (req, res) {
  const id = req.params.id;
  pool.query("SELECT * FROM clients WHERE id_client=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.render("edit_client.hbs", {
      clients: data[0]
    });
  });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/edit_client/", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const address = req.body.address;
  const phone = req.body.phone;
  const email = req.body.email;
  const vip = req.body.vip;
  const id = req.body.id;

  pool.query("UPDATE clients SET name_client=?, adress=?, phone=?, email=?, vip=? WHERE id_client=?", [name, address, phone, email, vip, id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/clients");
  });
});

// ////// Редактирование услуг ///////

// получем id редактируемой услуги, получаем его из бд и отправлям с формой редактирования
app.get("/edit_service/:id", function (req, res) {
  const id = req.params.id;
  pool.query("SELECT * FROM services WHERE id_service=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.render("edit_service.hbs", {
      services: data[0]
    });
  });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/edit_service/", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const price = req.body.price;
  const guarantee = req.body.guarantee;
  const id = req.body.id;

  pool.query("UPDATE services SET name_service=?, price=?, guarantee=? WHERE id_service=?", [name, price, guarantee, id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/services");
  });
});

// ////// Редактирование заказа ///////

// получем id редактируемого заказа, получаем его из бд и отправлям с формой редактирования
app.get("/edit_order/:id", function (req, res) {
  const id = req.params.id;
  pool.query("SELECT * FROM orders WHERE id_order=?", [id], function (err, data) {
    if (err) return console.log(err);

    //меняем формат даты на человеческий
    data.forEach(function (element) {

      const dateOrder = new Date(element.date_order);
      const dateFin = new Date(element.date_finish);

      element.date_order = dateOrder.getFullYear() + '.' + (("0" + (dateOrder.getMonth() + 1)).slice(-2)) + '.' + (("0" + dateOrder.getDate()).slice(-2));

      if (element.date_finish != null) {
        element.date_finish = dateFin.getFullYear() +  '.' + (("0" + (dateFin.getMonth() + 1)).slice(-2)) + '.' + (("0" + dateFin.getDate()).slice(-2));
      } else {
        element.date_finish = null;
      }
    });
    res.render("edit_order.hbs", {
      orders: data[0]
    });
  });
});

// получаем отредактированные данные и отправляем их в БД
app.post("/edit_order/", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const paid = req.body.paid;
  const returned = req.body.returned;
  const comments = req.body.comments;
  const client = req.body.client;
  const master = req.body.master;
  const service = req.body.service;
  const id = req.body.id;

  if (req.body.price === "") {
    var price = null;
  } else {
    price = req.body.price;
  }

  if (req.body.date_finish_calendar === "" && req.body.date_finish_string=== "") {
    var date_finish = null;
  }

  else if (req.body.date_finish_calendar === "" && req.body.date_finish_string !== "") {
    date_finish=req.body.date_finish_string;
  }
  else {
    date_finish = req.body.date_finish_calendar;
  }

     pool.query("UPDATE orders SET name_device=?, date_finish=?, paid=?, returned=?, price_final=?, comments=?, id_client=?, id_master=?, id_service=? WHERE id_order=?", [name, date_finish, paid, returned, price, comments, client, master, service, id], function (err, data) {
    if (err) return console.log(err);
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
