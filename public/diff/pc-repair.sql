-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 18 2019 г., 02:56
-- Версия сервера: 10.3.13-MariaDB
-- Версия PHP: 7.1.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `pc-repair`
--

-- --------------------------------------------------------

--
-- Структура таблицы `authorization`
--

CREATE TABLE `authorization` (
  `id_user` int(4) NOT NULL,
  `login` varchar(10) NOT NULL DEFAULT '0',
  `password` varchar(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `authorization`
--

INSERT INTO `authorization` (`id_user`, `login`, `password`) VALUES
(1, 'admin', '12345'),
(2, 'boss', '12345'),
(3, 'manager', '12345');

-- --------------------------------------------------------

--
-- Структура таблицы `clients`
--

CREATE TABLE `clients` (
  `id_client` int(4) NOT NULL,
  `name_client` varchar(60) NOT NULL,
  `adress` varchar(150) NOT NULL,
  `phone` bigint(11) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `vip` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `clients`
--

INSERT INTO `clients` (`id_client`, `name_client`, `adress`, `phone`, `email`, `vip`) VALUES
(1, 'Горянов Илья Ильич', 'г.Минск, ул. Ванеева 10-152', 80256669981, 'gor1952@yandex.ru', 0),
(2, 'Полякова Анастасия Егоровна', 'г.Минск, пр.Машерова 120/1-56', 267582211, 'kukushka2@google.com', 1),
(3, 'Сорин Леонид Петрович', 'г.Минск, ул. Лермонтова 10', 275544812, NULL, 0),
(4, 'Алуева Ирина Григорьевна', 'г.Минск, пр. Газеты Правда, 40-102', 251236587, 'irochka89@mail.ru', 0),
(5, 'Баранов Егор Симонович', 'г.Минск, ул. Ротмистрова 85-45', 296584264, 'kopytce@icloud.com', 0),
(6, 'Солянкина Мария Александровна', 'г.Минск, ул. Большова 185-4', 295184265, 'solsol@yandex.com', 0),
(7, 'Голиков Иван Ромуальдович', 'г.Минск, ул. Волгоградская 5-1', 297944266, 'maninblack@mail.com', 0),
(8, 'Москвина Алина Брониславовна', 'г.Минск, ул. Алибегова 8', 291194267, 'ivanova_a@icloud.com', 1),
(9, 'Балашов Ростислав Иванович', 'г.Минск, пер. Осипова 42', 295994268, 'superman83@mail.com', 1),
(10, 'Любимова Ирина Егоровна', 'г.Минск, ул. Пулихова 11/2-78', 331156987, 'luba22@tut.by', 0),
(11, 'Ванеев Иван Андреевич', 'г.Минск, ул. Поповаа, 18Б-25', 293365884, 'vanivan@gmail.com', 1),
(12, 'Литвиненко Егор Алексеевич', 'г. Минск, ул. Ленина, 12-120', 445656778, 'litega@tut.by', 0),
(13, 'Свежие решения ООО', 'г.Минск, ул. Димиденко, д.10, каб.101', 447156779, 'info@svr.by', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `masters`
--

CREATE TABLE `masters` (
  `id_master` int(4) NOT NULL,
  `name_master` varchar(100) NOT NULL,
  `adress` varchar(150) NOT NULL,
  `phone` bigint(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `id_specialization` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `masters`
--

INSERT INTO `masters` (`id_master`, `name_master`, `adress`, `phone`, `email`, `id_specialization`) VALUES
(1, 'Олибегов Кирилл Магомедович', 'г.Минск, ул. Зорина 185-45', 443584259, 'oli_kir@mail.ru', 1),
(2, 'Ахметов Амир Азаматович', 'г.Минск, пер. Валеева 18-40', 442189210, 'ahmetov_amir@mail.ru', 2),
(3, 'Алтуев Роман Романович', 'г.Минск, ул. Есенина 15-170', 291781261, 'romka80@yandex.ru', 1),
(6, 'Тельцов Олег Александрович', 'г.Минск, ул. Броневая 5-15', 296184264, 'redbull@yandex.com', 2),
(7, 'Банин Альберт Владимирович', 'г.Минск, ул. Солонаева 1-40', 295994265, 'parilka91@tut.by', 3);

-- --------------------------------------------------------

--
-- Структура таблицы `online_orders`
--

CREATE TABLE `online_orders` (
  `number` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `name_client_online` varchar(70) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` bigint(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `comments` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Заявки, поступающие с сайта';

--
-- Дамп данных таблицы `online_orders`
--

INSERT INTO `online_orders` (`number`, `date`, `name_client_online`, `email`, `phone`, `title`, `comments`) VALUES
(9, '2019-07-17 00:37:31', 'Иванов Иван Иванович', 'ivanov45@tut.by', 80297165833, 'Не включается ноутбук', 'после отключения электричества не вклюбчается ноутбук'),
(10, '2019-07-17 00:41:51', 'Рогова Мария', '', 80296795833, 'Поменять экран', 'в планшете Lenovo АК45 треснул экран. хочу недорого, можно б/у');

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id_order` int(4) NOT NULL,
  `date_order` date NOT NULL,
  `name_device` varchar(150) NOT NULL,
  `date_finish` date DEFAULT NULL,
  `paid` tinyint(1) NOT NULL DEFAULT 0,
  `returned` tinyint(1) NOT NULL DEFAULT 0,
  `price_final` int(3) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `id_client` int(4) NOT NULL,
  `id_master` int(4) NOT NULL,
  `id_service` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id_order`, `date_order`, `name_device`, `date_finish`, `paid`, `returned`, `price_final`, `comments`, `id_client`, `id_master`, `id_service`) VALUES
(1, '2019-06-01', 'Ноутбук Acer 520C', '2019-06-08', 1, 1, 20, NULL, 1, 3, 1),
(2, '2019-06-01', 'Ноутбук Acer 520C', '2019-06-08', 1, 1, 10, NULL, 1, 3, 2),
(3, '2019-05-22', 'Apple MacBook Pro 15\'\' Retina', '2019-05-31', 1, 1, 335, 'Скидка VIP клиенту', 2, 2, 5),
(4, '2019-06-10', 'Системный блок Intel R 380', '2019-06-13', 0, 0, 150, NULL, 3, 1, 8),
(5, '2019-06-12', 'Нотбук Toshiba A390', '2019-06-14', 0, 0, 80, NULL, 4, 3, 13),
(6, '2019-06-13', 'Планшет Prestigio GH9', '2019-06-15', 0, 0, 100, NULL, 5, 3, 7),
(7, '2019-06-13', 'Flash card 32GB', '2019-06-13', 0, 0, 50, NULL, 6, 7, 4),
(8, '2019-06-13', 'Apple ipad mini4', '2019-06-15', 0, 0, 20, NULL, 7, 6, 9),
(9, '2019-06-13', 'Apple ipad mini4', '2019-06-15', 0, 0, 100, NULL, 7, 6, 7),
(10, '2019-06-13', 'Apple MacBook Air 13\"', '2019-06-14', 0, 0, 70, 'Скидка VIP клиенту', 8, 2, 10),
(11, '2019-06-13', 'Apple MacBook MF865', NULL, 0, 0, NULL, NULL, 9, 2, 10),
(12, '2019-06-14', 'Планшет Acer 569CF', '2019-06-15', 0, 0, 11, NULL, 10, 3, 3),
(13, '2019-06-14', 'Apple ipad Air3', NULL, 1, 0, 23, 'Скидка VIP клиенту - 2 р\r\nУдвоенная гарантия +5 р', 2, 3, 9),
(14, '2019-06-14', 'Ноутбук HP DDR 4GB 320', NULL, 0, 0, NULL, 'Можно подобрать хорошую б/у матрицу', 11, 1, 6),
(15, '2019-06-14', 'Материнская плата GT340', NULL, 1, 0, 73, 'Скидка за предоплату', 12, 1, 10),
(16, '2019-06-14', 'Нотбук Toshiba A390', '2019-06-16', 1, 0, 20, NULL, 4, 3, 1),
(17, '2019-06-14', 'Нотбук Toshiba A390', '2019-06-16', 0, 0, 10, NULL, 4, 3, 2),
(18, '2019-06-14', 'Xerox P8E Ekman (PREMIUM)', '2019-06-14', 1, 1, 25, NULL, 13, 7, 24),
(19, '2019-06-15', 'Ноутбук Acer 520C', NULL, 0, 0, NULL, NULL, 13, 3, 15),
(20, '2019-06-15', 'Нотбук Toshiba A390', '2019-06-15', 0, 0, 25, NULL, 4, 3, 15),
(29, '2019-07-15', 'test', NULL, 0, 0, 19, 'скидка по промокоду AD4356', 1, 1, 1),
(30, '2019-07-16', 'test3', '2019-07-16', 0, 0, NULL, ' ', 1, 1, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `services`
--

CREATE TABLE `services` (
  `id_service` int(4) NOT NULL,
  `name_service` varchar(100) NOT NULL,
  `price` int(3) NOT NULL,
  `guarantee` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `services`
--

INSERT INTO `services` (`id_service`, `name_service`, `price`, `guarantee`) VALUES
(1, 'Переустановка Windows', 20, 0),
(2, 'Установка ПО, антивируса', 11, 0),
(3, 'Перепрошивка планшета', 12, 0),
(4, 'Восстановление информации с ЖД/флешки', 50, 0),
(5, 'Замена матрицы MacBook', 350, 2),
(6, 'Замена матрицы ноутбука', 180, 2),
(7, 'Замена матрицы планшета', 100, 2),
(8, 'Замена северн./южн. моста мат.платы', 150, 12),
(9, 'Замена разъема питания', 20, 1),
(10, 'Пропайка  элементов мат.платы', 75, 2),
(12, 'Замена верхнего корпуса ноутбука', 120, 12),
(13, 'Замена нижнего корпуса ноутбука', 80, 12),
(14, 'Лечение от вирусов', 6, 0),
(15, 'Чистка от пыли и замена термопасты', 25, 0),
(16, 'Удаленная помощь в найстройке ПК', 50, 0),
(17, 'Вызов курьера или мастера на дом', 15, 0),
(18, 'Замена видеокарты', 100, 24),
(19, 'Замена блока питания', 200, 24),
(20, 'Замена метеринской платы', 200, 24),
(21, 'Замена оперативной памяти', 110, 36),
(22, 'Замена гнезда питания,USB,аудио входа', 40, 3),
(23, 'Замена динамика/микрофона', 45, 2),
(24, 'Заправка картриджа (с выездом)', 25, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `specializations`
--

CREATE TABLE `specializations` (
  `id_specialization` int(4) NOT NULL,
  `specialization` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `specializations`
--

INSERT INTO `specializations` (`id_specialization`, `specialization`) VALUES
(1, 'ПК, ноутбуки, планшеты'),
(2, 'Apple'),
(3, 'Модернизация');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `authorization`
--
ALTER TABLE `authorization`
  ADD PRIMARY KEY (`id_user`);

--
-- Индексы таблицы `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id_client`);

--
-- Индексы таблицы `masters`
--
ALTER TABLE `masters`
  ADD PRIMARY KEY (`id_master`),
  ADD KEY `id_specialization` (`id_specialization`);

--
-- Индексы таблицы `online_orders`
--
ALTER TABLE `online_orders`
  ADD PRIMARY KEY (`number`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `id_client` (`id_client`),
  ADD KEY `id_master` (`id_master`),
  ADD KEY `id_service` (`id_service`);

--
-- Индексы таблицы `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id_service`);

--
-- Индексы таблицы `specializations`
--
ALTER TABLE `specializations`
  ADD PRIMARY KEY (`id_specialization`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `authorization`
--
ALTER TABLE `authorization`
  MODIFY `id_user` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `clients`
--
ALTER TABLE `clients`
  MODIFY `id_client` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT для таблицы `masters`
--
ALTER TABLE `masters`
  MODIFY `id_master` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT для таблицы `online_orders`
--
ALTER TABLE `online_orders`
  MODIFY `number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id_order` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT для таблицы `services`
--
ALTER TABLE `services`
  MODIFY `id_service` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT для таблицы `specializations`
--
ALTER TABLE `specializations`
  MODIFY `id_specialization` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `masters`
--
ALTER TABLE `masters`
  ADD CONSTRAINT `masters_ibfk_1` FOREIGN KEY (`id_specialization`) REFERENCES `specializations` (`id_specialization`);

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`id_master`) REFERENCES `masters` (`id_master`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`id_service`) REFERENCES `services` (`id_service`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
