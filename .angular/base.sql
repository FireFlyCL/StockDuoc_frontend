SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `dbpruebaduoc` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `dbpruebaduoc`;

DROP TABLE IF EXISTS `area_model`;
CREATE TABLE `area_model` (
  `id_area` int(11) NOT NULL,
  `nombre_area` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `area_model` (`id_area`, `nombre_area`, `deleteAt`) VALUES
(1, 'PAÑOL', NULL),
(2, 'DDHUB', NULL),
(3, 'CTA', NULL),
(5, 'FINANZAS', NULL);

DROP TABLE IF EXISTS `cantidad_model`;
CREATE TABLE `cantidad_model` (
  `id_cantidad` int(11) NOT NULL,
  `cantidad` varchar(255) NOT NULL,
  `stock_critico` int(11) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL,
  `productoIdProducto` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

DROP TABLE IF EXISTS `cliente_model`;
CREATE TABLE `cliente_model` (
  `correo` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL,
  `escuelaIdEscuela` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `cliente_model` (`correo`, `deleteAt`, `escuelaIdEscuela`) VALUES
('ange.leal@profesor.duoc.cl', NULL, 1),
('bra.sepulvedam@duocuc.cl', NULL, 2),
('c.cerda@duocuc.cl', NULL, 1),
('pie.flores@duocuc.cl', NULL, 1);

DROP TABLE IF EXISTS `escuela_model`;
CREATE TABLE `escuela_model` (
  `id_escuela` int(11) NOT NULL,
  `nombre_escuela` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `escuela_model` (`id_escuela`, `nombre_escuela`, `deleteAt`) VALUES
(1, 'INFORMATICA Y TELECOMUNICACIONES', NULL),
(2, 'DISEÑO', NULL),
(3, 'PUBLICIDAD', NULL),
(4, 'FINANZAS', NULL);

DROP TABLE IF EXISTS `estado_solicitud_model`;
CREATE TABLE `estado_solicitud_model` (
  `id_estado_solicitud` int(11) NOT NULL,
  `nombre_estado` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `estado_solicitud_model` (`id_estado_solicitud`, `nombre_estado`, `deleteAt`) VALUES
(1, 'Nueva', NULL),
(2, 'Aprobado', NULL),
(3, 'Rechazado', NULL),
(4, 'Terminado', NULL);

DROP TABLE IF EXISTS `fuera_stock_model`;
CREATE TABLE `fuera_stock_model` (
  `id_fuera_stock` int(11) NOT NULL,
  `numero_serie` varchar(255) NOT NULL,
  `serie_sap` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL,
  `productoIdProducto` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

DROP TABLE IF EXISTS `lugar_model`;
CREATE TABLE `lugar_model` (
  `id_lugar` int(11) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL,
  `nombre_lugar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `lugar_model` (`id_lugar`, `deleteAt`, `nombre_lugar`) VALUES
(1, NULL, 'Oficina Pañol'),
(2, NULL, 'Oficina Cta'),
(3, NULL, 'Oficina Ddhub'),
(4, NULL, 'Recepción'),
(5, NULL, 'Dirección'),
(6, NULL, 'Capilla'),
(7, NULL, 'Auditorio'),
(8, NULL, 'casino'),
(9, NULL, 'Dirección');

DROP TABLE IF EXISTS `perfil_model`;
CREATE TABLE `perfil_model` (
  `id_perfil` int(11) NOT NULL,
  `nombre_perfil` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `perfil_model` (`id_perfil`, `nombre_perfil`, `deleteAt`) VALUES
(1, 'ADMIN', NULL),
(2, 'PROFESOR', NULL),
(3, 'ESTUDIANTE', NULL);

DROP TABLE IF EXISTS `producto_model`;
CREATE TABLE `producto_model` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `modelo` varchar(255) NOT NULL,
  `stock_critico` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL,
  `areaIdArea` int(11) DEFAULT NULL,
  `imagenUrl` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `producto_model` (`id_producto`, `nombre`, `marca`, `modelo`, `stock_critico`, `descripcion`, `imagen`, `deleteAt`, `areaIdArea`, `imagenUrl`) VALUES
(1, 'MOUSE', 'HP', '150', 5, 'MOUSE DE PRUEBA', 'imagen-1703819033783-428292568.png', NULL, 1, 'https://ms.stockduocpv.cl/uploads/imagen-1703819033783-428292568.png'),
(2, 'Mouse', 'miniso', 'gh1', 5, 'Mouse de prueba', 'imagen-1703819064854-326550863.png', NULL, 1, 'https://ms.stockduocpv.cl/uploads/imagen-1703819064854-326550863.png'),
(3, 'TECLADO', 'genius', 'B2', 4, 'TECLADO DE PRUEBA', 'imagen-1703819090260-657800268.png', NULL, 1, 'https://ms.stockduocpv.cl/uploads/imagen-1703819090260-657800268.png'),
(17, 'Impresora 3d', 's2w32', 'gg', 4, 'producto de prueba', 'imagen-1703826637106-379971352.png', NULL, 2, 'https://ms.stockduocpv.cl/uploads/imagen-1703826637106-379971352.png'),
(19, 'CAMARA', 'CANON', 'REBEL T100', 3, 'producto de prueba', 'imagen-1703818985375-62862970.png', NULL, 3, 'https://ms.stockduocpv.cl/uploads/imagen-1703818985375-62862970.png'),
(25, 'Proyector', 'sony', 'aparato educativo', 10, 'es un proyector', 'imagen-1703818967707-44251782.png', NULL, 3, 'https://ms.stockduocpv.cl/uploads/imagen-1703818967707-44251782.png'),
(26, 'plumon azul', 'marker', 'permanente', 20, 'test de ingreso de producto', 'imagen-1703826664369-299826145.png', NULL, 2, 'https://ms.stockduocpv.cl/uploads/imagen-1703826664369-299826145.png'),
(27, 'plumon rojo', 'marker', 'Pizarra', 19, 'test 2', 'imagen-1703826682374-158444169.png', NULL, 2, 'https://ms.stockduocpv.cl/uploads/imagen-1703826682374-158444169.png'),
(28, 'notebook', 'lenovo', 'pro500', 3, 'lenovo para administrativos', 'imagen-1703818943372-828819153.png', NULL, 3, 'https://ms.stockduocpv.cl/uploads/imagen-1703818943372-828819153.png'),
(29, 'notebook', 'lenovo', 'p450', 1, 'lenovo para el citt', 'imagen-1703819176903-822153502.png', NULL, 1, 'https://ms.stockduocpv.cl/uploads/imagen-1703819176903-822153502.png'),
(30, 'Impresora', 'Epson', 'EcoTank L3210 negra 220V', 3, 'negra ', 'imagen-1703818919417-26814529.png', NULL, 3, 'https://ms.stockduocpv.cl/uploads/imagen-1703818919417-26814529.png'),
(31, 'smart tv', 'Xiaomi', ' A2 43 Smart TV FHD', 4, 'Xiaomi ', 'imagen-1703826701336-526877628.png', NULL, 2, 'https://ms.stockduocpv.cl/uploads/imagen-1703826701336-526877628.png'),
(32, 'arduino', 'novx', 'hh-1', 5, 'arduino de prueba', 'imagen-1703818715370-158773035.png', NULL, 3, 'https://ms.stockduocpv.cl/uploads/imagen-1703818715370-158773035.png'),
(35, 'notebook lenovo', 'notebook lenovo', 'notebook lenovo', 1, 'notebook lenovo', 'imagen-1703818703589-736800692.png', NULL, 3, 'https://ms.stockduocpv.cl/uploads/imagen-1703818703589-736800692.png'),
(36, 'CELULAR ', 'XIAOMI', 'NOTE 12', 5, 'CELULAR PARA TRABAJADORES DE DDHUB', 'https://ms.stockduocpv.cl/uploads/imagen-1704223313071-956388609.jfif', NULL, 2, 'https://ms.stockduocpv.cl/uploads/imagen-1704223313071-956388609.jfif');

DROP TABLE IF EXISTS `sap_stock`;
CREATE TABLE `sap_stock` (
  `codActivo` int(11) NOT NULL,
  `lugar` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

DROP TABLE IF EXISTS `solicitud_model`;
CREATE TABLE `solicitud_model` (
  `id_solicitud` int(11) NOT NULL,
  `hora_inicio` varchar(255) NOT NULL,
  `hora_termino` varchar(255) NOT NULL,
  `seccion` varchar(255) NOT NULL,
  `nombre_solicitante` varchar(255) NOT NULL,
  `correo_solicitante` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL,
  `estadosolicitudIdEstadoSolicitud` int(11) DEFAULT NULL,
  `areaIdArea` int(11) DEFAULT NULL,
  `fecha_solicitud` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_entrega` varchar(255) NOT NULL,
  `fecha_regreso` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- [Insert your data here]

DROP TABLE IF EXISTS `solicitud_producto_model`;
CREATE TABLE `solicitud_producto_model` (
  `id_solicitud_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `observacion` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL,
  `solicitudIdSolicitud` int(11) DEFAULT NULL,
  `productoIdProducto` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- [Insert your data here]

DROP TABLE IF EXISTS `stock_model`;
CREATE TABLE `stock_model` (
  `id_stock` int(11) NOT NULL,
  `numero_serie` varchar(255) NOT NULL,
  `serie_sap` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL,
  `productoIdProducto` int(11) DEFAULT NULL,
  `lugarIdLugar` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- [Insert your data here]

DROP TABLE IF EXISTS `usuario_model`;
CREATE TABLE `usuario_model` (
  `id_usuario` int(11) NOT NULL,
  `pnombre` varchar(255) NOT NULL,
  `snombre` varchar(255) NOT NULL,
  `appaterno` varchar(255) NOT NULL,
  `correo_institucional` varchar(255) NOT NULL,
  `rut` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `estado_usuario` varchar(255) NOT NULL,
  `deleteAt` datetime(6) DEFAULT NULL,
  `perfilIdPerfil` int(11) DEFAULT NULL,
  `areaIdArea` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `usuario_model` (`id_usuario`, `pnombre`, `snombre`, `appaterno`, `correo_institucional`, `rut`, `contraseña`, `estado_usuario`, `deleteAt`, `perfilIdPerfil`, `areaIdArea`) VALUES
(2, 'PAÑOL', 'PLAZA', 'VESPUCIO', 'panol.admin@stockduocpv.cl', '123', '123', 'ACTIVO', NULL, 1, 1),
(3, 'CTA', 'PLAZA', 'VESPUCIO', 'cta.admin@stockduocpv.cl', '1235', '123', 'ACTIVO', NULL, 1, 3),
(5, 'FINANZAS', 'PLAZA', 'VESPUCIO', 'finanzas.admin@stockduocpv.cl', '1237', '123', 'ACTIVO', NULL, 1, 5),
(8, 'DDHUB', 'PLAZA', 'VESPUCIO', 'ddhub.admin@stockduocpv.cl', '1234', '123', 'ACTIVO', NULL, 1, 2);

ALTER TABLE `area_model`
  ADD PRIMARY KEY (`id_area`);

ALTER TABLE `cantidad_model`
  ADD PRIMARY KEY (`id_cantidad`),
  ADD KEY `FK_4ce4340d53d3c3f67230cfa5d45` (`productoIdProducto`);

ALTER TABLE `cliente_model`
  ADD PRIMARY KEY (`correo`),
  ADD KEY `FK_43b52f2bf8fe7db72fa55d38303` (`escuelaIdEscuela`);

ALTER TABLE `escuela_model`
  ADD PRIMARY KEY (`id_escuela`);

ALTER TABLE `estado_solicitud_model`
  ADD PRIMARY KEY (`id_estado_solicitud`);

ALTER TABLE `fuera_stock_model`
  ADD PRIMARY KEY (`id_fuera_stock`),
  ADD KEY `FK_c690ee6ec710779eb7321519f0e` (`productoIdProducto`);

ALTER TABLE `lugar_model`
  ADD PRIMARY KEY (`id_lugar`);

ALTER TABLE `perfil_model`
  ADD PRIMARY KEY (`id_perfil`);

ALTER TABLE `producto_model`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `FK_42d15b2de4ef86d131482f5c597` (`areaIdArea`);

ALTER TABLE `sap_stock`
  ADD PRIMARY KEY (`codActivo`);

ALTER TABLE `solicitud_model`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `FK_9a2ac8f9df73f82fbfb24a069f3` (`estadosolicitudIdEstadoSolicitud`),
  ADD KEY `FK_5da7758bbb782e72d061861039d` (`areaIdArea`);

ALTER TABLE `solicitud_producto_model`
  ADD PRIMARY KEY (`id_solicitud_producto`),
  ADD KEY `FK_b8eb3de05d0be6033815ce6465b` (`solicitudIdSolicitud`),
  ADD KEY `FK_9d7533343119b6adfb21cf70a2b` (`productoIdProducto`);

ALTER TABLE `stock_model`
  ADD PRIMARY KEY (`id_stock`),
  ADD KEY `FK_eef4654ac6e12fb64b71f2dd507` (`productoIdProducto`),
  ADD KEY `FK_5d2e4cca72882abd164066d8d8e` (`lugarIdLugar`);

ALTER TABLE `usuario_model`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `IDX_8b53cd5e9b0e3ebbbe15f6fa15` (`correo_institucional`),
  ADD UNIQUE KEY `IDX_c7517ea0b3489323e03af13fe3` (`rut`),
  ADD KEY `FK_f908b91febbeb6c63e2a893a422` (`perfilIdPerfil`),
  ADD KEY `FK_793df87e730dd72a5ac4f9d62cb` (`areaIdArea`);

ALTER TABLE `area_model`
  MODIFY `id_area` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `cantidad_model`
  MODIFY `id_cantidad` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `escuela_model`
  MODIFY `id_escuela` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `estado_solicitud_model`
  MODIFY `id_estado_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `fuera_stock_model`
  MODIFY `id_fuera_stock` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `lugar_model`
  MODIFY `id_lugar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `perfil_model`
  MODIFY `id_perfil` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `producto_model`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

ALTER TABLE `sap_stock`
  MODIFY `codActivo` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `solicitud_model`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

ALTER TABLE `solicitud_producto_model`
  MODIFY `id_solicitud_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

ALTER TABLE `stock_model`
  MODIFY `id_stock` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

ALTER TABLE `usuario_model`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `cantidad_model`
  ADD CONSTRAINT `FK_4ce4340d53d3c3f67230cfa5d45` FOREIGN KEY (`productoIdProducto`) REFERENCES `producto_model` (`id_producto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `cliente_model`
  ADD CONSTRAINT `FK_43b52f2bf8fe7db72fa55d38303` FOREIGN KEY (`escuelaIdEscuela`) REFERENCES `escuela_model` (`id_escuela`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `fuera_stock_model`
  ADD CONSTRAINT `FK_c690ee6ec710779eb7321519f0e` FOREIGN KEY (`productoIdProducto`) REFERENCES `producto_model` (`id_producto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `producto_model`
  ADD CONSTRAINT `FK_42d15b2de4ef86d131482f5c597` FOREIGN KEY (`areaIdArea`) REFERENCES `area_model` (`id_area`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `solicitud_model`
  ADD CONSTRAINT `FK_5da7758bbb782e72d061861039d` FOREIGN KEY (`areaIdArea`) REFERENCES `area_model` (`id_area`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_9a2ac8f9df73f82fbfb24a069f3` FOREIGN KEY (`estadosolicitudIdEstadoSolicitud`) REFERENCES `estado_solicitud_model` (`id_estado_solicitud`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `solicitud_producto_model`
  ADD CONSTRAINT `FK_9d7533343119b6adfb21cf70a2b` FOREIGN KEY (`productoIdProducto`) REFERENCES `producto_model` (`id_producto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b8eb3de05d0be6033815ce6465b` FOREIGN KEY (`solicitudIdSolicitud`) REFERENCES `solicitud_model` (`id_solicitud`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `stock_model`
  ADD CONSTRAINT `FK_5d2e4cca72882abd164066d8d8e` FOREIGN KEY (`lugarIdLugar`) REFERENCES `lugar_model` (`id_lugar`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_eef4654ac6e12fb64b71f2dd507` FOREIGN KEY (`productoIdProducto`) REFERENCES `producto_model` (`id_producto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `usuario_model`
  ADD CONSTRAINT `FK_793df87e730dd72a5ac4f9d62cb` FOREIGN KEY (`areaIdArea`) REFERENCES `area_model` (`id_area`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f908b91febbeb6c63e2a893a422` FOREIGN KEY (`perfilIdPerfil`) REFERENCES `perfil_model` (`id_perfil`) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT;

