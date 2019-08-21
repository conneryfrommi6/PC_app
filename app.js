const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');



const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "pc-repair",
  password: ""
});

const SESSION_TIME = 60 * 60 * 1000;
const SESSION_SECRET = 'DrCox';

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(session({ 
  secret: SESSION_SECRET, 
  resave : false,
  saveUninitialized : true, 
  cookie: { maxAge: SESSION_TIME }
}));



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

// получение списка он-лайн заказов

app.get("/orders_online_list", function (req, res) {
  pool.query("SELECT * FROM online_orders", function (err, data) {
    if (err) return console.log(err);

    //меняем формат даты на человеческий
    data.forEach(function (element) {
      const dateOrder = new Date(element.date);
      element.date = (("0" + dateOrder.getDate()).slice(-2)) + '.' + (("0" + (dateOrder.getMonth() + 1)).slice(-2)) + '.' + dateOrder.getFullYear();
    });

    res.render("orders_online_list.hbs", {
      online_orders: data
    });
  });

});

// получение списка для авторизации
app.get("/auth", function (req, res) {
  // pool.query("SELECT * FROM authorization", function (err, data) {
  //   if (err) return console.log(err);
  //   console.log(data);
    res.render("auth.hbs", {
      // authorization: data
    });
  // });
});


const isSessionEmpty = (req) => { return req.session.userId ? true : false };

// if(!isSessionEmpty) {
//   res.render("auth.hbs", {msg: 'неверный логин или пароль'});
//   return;
//  }


// получение списка для авторизации
app.post("/login", function (req, res) {
  if(isSessionEmpty(req)) {
    res.redirect("/");
  return;
  }
 pool.query("select id_user, login, password from authorization where login=? and password=?", [req.query.user, req.query.pass],  (err, data) => {
    if (err) return console.log(err);
    if(!data.length) {
      res.render("auth.hbs", {msg: 'неверный логин или пароль'});
      return;
    } else {
      req.session.userId = data[0].id_user;
      req.session.save(function() {
        res.render("auth.hbs");   
      });
    }
  })
});
 


// // переход на общую страницу для работы с базой
// app.get("/", function (req, res) {
//   res.render("index.hbs")
// });


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

// ////// Добавление он-лайн заказа ////////////////

// возвращаем форму для добавления данных
app.get("/order_online", function (req, res) {
  res.render("order_online.hbs");
});

app.get("/order_online", function (req, res) {
  pool.query("SELECT * FROM online_orders", function (err, data) {
    if (err) return console.log(err);
    res.render("order_online.hbs", {
      online_orders: data
    });
  });
});

// получаем отправленные данные и добавляем их в БД
app.post("/order_online", urlencodedParser, function (req, res) {

  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const title = req.body.title;
  const message = req.body.message;

  pool.query("INSERT INTO online_orders (name_client_online, email, phone, title, comments) VALUES (?,?,?,?,?)", [name, email, phone, title, message], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/order_online");
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

app.post("/delete_online_order/:id", function (req, res) {

  const id = req.params.id;
  pool.query("DELETE FROM online_orders WHERE number=?", [id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/orders_online_list");
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
        element.date_finish = dateFin.getFullYear() + '.' + (("0" + (dateFin.getMonth() + 1)).slice(-2)) + '.' + (("0" + dateFin.getDate()).slice(-2));
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

  if (req.body.date_finish_calendar === "" && req.body.date_finish_string === "") {
    var date_finish = null;
  } else if (req.body.date_finish_calendar === "" && req.body.date_finish_string !== "") {
    date_finish = req.body.date_finish_string;
  } else {
    date_finish = req.body.date_finish_calendar;
  }

  pool.query("UPDATE orders SET name_device=?, date_finish=?, paid=?, returned=?, price_final=?, comments=?, id_client=?, id_master=?, id_service=? WHERE id_order=?", [name, date_finish, paid, returned, price, comments, client, master, service, id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/orders");
  });

});


// ///////////////////////ОТЧЕТЫ ////////////////////////////////////

// Неоплаченные заказы

app.get("/report_not_paid", function (req, res) {
  pool.query("SELECT id_order, date_order, name_device, date_finish, price_final, clients.name_client, clients.phone," +
   "services.name_service, comments, masters.name_master FROM orders JOIN clients " +
   "on clients.id_client=orders.id_client JOIN masters on masters.id_master=orders.id_master " +
   "JOIN services on services.id_service=orders.id_service WHERE `paid` = 0 AND `returned` = 0 AND `date_finish` IS NOT NULL ORDER BY orders.id_order", function (err, data) {
    if (err) return console.log(err);
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

    });

    res.render("report_not_paid.hbs", {
      orders: data
    });
  });

});


// Невыполненные заказы

app.get("/report_not_finished", function (req, res) {
  pool.query("SELECT orders.id_order, orders.date_order, orders.name_device, orders.paid, orders.price_final, orders.comments, clients.name_client, services.name_service, masters.name_master FROM orders JOIN clients on clients.id_client=orders.id_client JOIN masters on masters.id_master=orders.id_master JOIN services on services.id_service=orders.id_service \n" +
   "WHERE `returned` = 0 AND `date_finish` IS NULL\n" +
   "ORDER BY orders.id_order", function (err, data) {
    if (err) return console.log(err);
    // //////настройка вывода отображения данных //////////

    //меняем формат даты на человеческий
    data.forEach(function (element) {
      const dateOrder = new Date(element.date_order);
      element.date_order = (("0" + dateOrder.getDate()).slice(-2)) + '.' + (("0" + (dateOrder.getMonth() + 1)).slice(-2)) + '.' + dateOrder.getFullYear();

      // меняем формат логических полей на человеческий
      element.paid = element.paid ? "Да" : "Нет";
    });

    res.render("report_not_finished.hbs", {
      orders: data
    });
  });

});

// Прайс-лист

app.get("/report_price", function (req, res) {
  pool.query("SELECT * FROM services", function (err, data) {
    if (err) return console.log(err);
    res.render("report_price.hbs", {
      services: data
    });
  });

});


// Вип-клиенты

app.get("/report_clients_vip", function (req, res) {
  pool.query("SELECT * FROM clients WHERE `vip` = 1", function (err, data) {
    if (err) return console.log(err);
    res.render("report_clients_vip.hbs", {
      clients: data
    });
  });

});


// Скидки

app.get("/report_discount_sum", function (req, res) {
  pool.query("SELECT  SUM (services.price-price_final) FROM orders JOIN services on services.id_service=orders.id_service WHERE price_final-services.price IS NOT null AND price_final-services.price != 0", function (err, data) {
    if (err) return console.log(err);
      res.render("report_discount_sum.hbs", {
      orders: data,
    });
  });

});


app.get("/report_discount", function (req, res) {
  pool.query("SELECT id_order, date_order, services.name_service, paid, services.price, price_final, price_final-services.price, comments FROM orders JOIN services on services.id_service=orders.id_service WHERE price_final-services.price IS NOT null AND price_final-services.price != 0 AND `price_final` IS NOT null ORDER BY price_final-services.price", function (err, data) {
    if (err) return console.log(err);
    // //////настройка вывода отображения данных //////////

    //меняем формат даты на человеческий
    data.forEach(function (element) {
      const dateOrder = new Date(element.date_order);
      element.date_order = (("0" + dateOrder.getDate()).slice(-2)) + '.' + (("0" + (dateOrder.getMonth() + 1)).slice(-2)) + '.' + dateOrder.getFullYear();

      // меняем формат логических полей на человеческий
      element.paid = element.paid ? "Да" : "Нет";
    });
    res.render("report_discount.hbs", {
      orders: data,
    });
  });

});

// Скидки

app.get("/report_discount_sum", function (req, res) {
  pool.query("SELECT  SUM (services.price-price_final) FROM orders JOIN services on services.id_service=orders.id_service WHERE price_final-services.price IS NOT null AND price_final-services.price != 0", function (err, data) {
    if (err) return console.log(err);
    // console.log(data);
    res.render("report_discount_sum.hbs", {
      orders: data,
    });
  });

});


// Популярность услуг

app.get("/report_services_popular", function (req, res) {
  pool.query("SELECT services.name_service, COUNT(id_order), SUM(price_final) FROM orders JOIN services on services.id_service=orders.id_service GROUP BY services.name_service ORDER BY COUNT(id_order) DESC", function (err, data) {
    if (err) return console.log(err);
    res.render("report_services_popular.hbs", {
      orders: data,
    });
  });

});

// Загруженность участков

app.get("/report_spec_total", function (req, res) {
  pool.query("SELECT specializations.specialization, COUNT(id_order), SUM(price_final) FROM orders JOIN masters on masters.id_master=orders.id_master JOIN specializations on specializations.id_specialization=masters.id_specialization GROUP BY specializations.specialization ORDER BY COUNT(id_order) DESC", function (err, data) {
    if (err) return console.log(err);
    res.render("report_spec_total.hbs", {
      orders: data,
    });
  });

});

// Загруженность мастеров

app.get("/report_masters_busy", function (req, res) {
  pool.query("SELECT masters.name_master, COUNT(id_order) FROM orders JOIN masters on masters.id_master=orders.id_master WHERE orders.date_finish IS NULL GROUP BY masters.name_master ORDER BY masters.name_master", function (err, data) {
    if (err) return console.log(err);
    res.render("report_masters_busy.hbs", {
      orders: data,
    });
  });

});

app.listen(3000, "127.0.0.1",() =>{console.log('app start')});

app.use('/css', express.static('css'));
app.use('/assets', express.static('assets'));
app.use('/scripts', express.static('scripts'));
// app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
