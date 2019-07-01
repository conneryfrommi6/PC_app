export function runServer () {

  const mysql = require("mysql2");

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "pc-repair",
    password: ""
  });

// тестирование подключения
  connection.connect(function (err) {
    if (err) {
      return console.error("Ошибка: " + err.message);
    } else {
      console.log("Подключение к серверу MySQL успешно установлено");
    }
  });

}
