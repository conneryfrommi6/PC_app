import {runServer} from "server";


export function getServices () {

runServer();

connection.query("SELECT * FROM services",
 function(err, results) {
   console.log(err);
   console.log(results); // собственно данные
 });


// закрытие подключения
connection.end(function(err) {
  if (err) {
    return console.log("Ошибка: " + err.message);
  }
  console.log("Подключение закрыто");
});
  }
