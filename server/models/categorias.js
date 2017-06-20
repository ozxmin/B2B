
const diccionarioCategorias = {
    "Accesorios de moda": [
        'Accesorios Cinturones','Cinturones','Servicios Diseño Accesorios de Moda','Servicios de Procesado Accesorios de Moda','Stock Accesorios de Moda','Guantes','Accesorios de Cabeza','Prendas para el cuello','Bufandas, Sombreros y Sets de Guantes','Sombreros y Gorras','Bufandas y Echarpes','Accesorios para el cabello','Correas de cuero genuino','Guantes y manoplas de cuero','Corbatas y accesorios','Hebillas','Cinturones de Poliuretano','Cadenas de Cinturón','Cinturones de metal','Tirantes'
    ],
    "Accesorios generales":[],
    "Bolsos maletas y fundas": [
        'Bolsa de equipaje y materiales', 'Bolsos Partes y Accesorios', 'Bolsos de Viaje, Maletas', 'Equipos Digitales y Bolsas para Cámaras', 'Bolsos de mano y Mensajero', 'Equipaje & bolsas de viaje', 'Carritos de Equipaje', 'Otros Bolsos, Maletas y Fundas', 'Bolsos de Viaje, Maletas', 'Bolsas de deporte y Ocio', 'Carteras y Tarjeteros', 'Equipaje de mano', 'Juegos de equipaje', 'Maletas con ruedas', 'Maletines', 'Estuches y bolsas de cosméticos', 'Bolsas de compra', 'Bolsos', 'Mochilas', 'Billeteras'
    ],
    "Calzado y accesorios": [
        'Calzado de bebé', 'Botas', 'Calzado casual', 'Calzado para niños', 'Zuecos', 'Calzado para danza', 'Zapatos de vestir', 'Calzado de piel genuina', 'Zapatos para hombre', 'Otro calzado', 'Sandalias', 'Material para calzado', 'Partes de calzado y accesorios', 'Equipamiento reparación de calzados', 'Servicios Diseño de calzado', 'Servicios Procesado de calzado', 'Stocks de calzado', 'Cremalleras', 'Calzados para propósitos especiales', 'Calzado deportivo', 'Calzado usado', 'Zapatos para mujer'
    ],
    "Cuero, piel y plumas": [
        'Piel de vaca','piel genuina','Productos de cuero','Cuero sintético PU','Piel sintética de PVC','Piel de carnero','cuero sintético','Otros Pieles'
    ],
    "Diseñadores textiles":[],
    "Fibras":[
        'Fibra acrílica','Fibra de aramida','Fibra de bambu','Fibra química','Fibra de cáñamo','Fibra hueca','Fibra de yute','Fibra de lino','Fibra Modacrílica','Fibra de nailon','Fibra de poliester','Fibra de polipropileno','Algodón en bruto','Fibra de poliéster reciclado','Fibra de seda','Fibra de grapas','Fibra sintética','UHMWPE Fibra','Fibra de viscosa','Fibra de lana','Otras fibras'
    ],
    "Fibras innovadoras":[],
    "Hilaturas":[
        'Hilado mezclado acrílico', 'Hilo de acrílico', 'Hilo mezclado de bambú', 'Hilado de fibra de bambú', 'Hilo mezclado', 'Hilado de cachemira', 'Hilado de Chenille', 'Hilado de algodón mezclado', 'Hilo de algodón', 'Hilados de bordado', 'Hilados de fantasía', 'Hilo de plumas', 'Hilo de tejer a mano', 'Hilo de yute', 'Hilados de punto', 'Hilados de lino', 'Hilados Lurex', 'Hilo de Lycra', 'Hilo de melange', 'Hilo metálico', 'Hilo Modal', 'Hilo de Mohair', 'Hilo de fregona', 'Hilo mezclado de nylon', 'Hilado de nylon', 'Hilo orgánico', 'Hilo mezclado de poliéster', 'Hilo de poliester', 'Hilo de polipropileno', 'Hilado de rayón', 'Hilo reciclado', 'Hilo de seda', 'Hilo de Spandex', 'Hilado de viscosa', 'Hilados de lana', 'Otros hilados'
    ],
    "Maquinaria":[],
    "Otros textiles y productos de cuero":[],
    "Plásticos":[],
    "Químicos":[],
    "Ropa": [
        'Ropa Servicio de Diseño','Ropa Servicios de Procesado','Ropa Stocks','Ropa Chicos','Ropa Niños','Abrigos','Disfraces','Vestidos','Ropa Accesorios','Ropa Chicas','Sudaderas y Suéter','Calcetería','Bebés y niños pequeños','Chaquetas','Vaqueros','Mujeres Blusas y Tops','Maniquíes','Ropa de Maternidad','Hombre Ropa','Hombre Camisetas','Ropa Algodón Orgánico','Ropa Otros','Pantalones y Vaqueros','Ropa Tallas Grandes','Costura Suministros','Shorts','Faldas','Pijamas','Ropa Deportiva','Ropa Baile y Espectáculos','Trajes','Suéter','Etiquetadoras','Camisetas Tirantes','Camisetas','Ropa Interior','Uniformes','Ropa Usada','Chalecos','Ropa de Boda y Accesorios','Mujeres Ropa','Ropa de Trabajo'
    ],
    "Ropa especial": [
        'Delantal', 'Ropa étnica y popular', 'Vestido de maternidad', 'Ropa militar', 'Ropa de protección y de protección', 'Bullet Proof Ropa', 'Traje ignífugo', 'Ropa Retardante De Llama', 'Ropa de seguridad reflectante', 'Otros Trajes de Seguridad y Protección', 'Trajes de baño', 'Traje de teatro', 'Uniformes y ropa de trabajo', 'Uniforme', 'Ropa de trabajo', 'Vestidos de novia y trajes ceremoniales', 'Vestidos de dama de honor', 'Vestidos de la celebridad', 'Vestidos de cóctel', 'Vestidos de noche', 'Vestidos de la muchacha de flor', 'Vestidos de graduación', 'Vestidos De Fiesta', 'Vestido de hombre', 'Madre de la novia vestido', 'Vestidos de baile', 'Vestidos de Quinceañera', 'Accesorios De Boda', 'Vestidos de novia', 'Otros Ropa Ceremonial'
    ],
    "Servicios":[],
    "Tela": [
        'Tela acrílica','Tela de fibra de bambú','Tela de fibra de carbono','Tela de cachemira','Tela de algodón','Tela de cáñamo','Tela de yute','Tela de lino','Tela metálica','Tela Modacrylic','Tejido Modal','Tela de Nylon','Tela de algodón orgánico','Tejido de poliéster','Tela de polipropileno','Tela de Ramie','Tejido de rayón','Tela de seda','Tejido de Spandex','Tela de Tencel','Tela de viscosa','Tejido de lana','Otros tejidos'
    ],
    "Textil hogar":[
        'Falda de la cama', 'Juego de cama', 'Colcha', 'Cobija', 'Alfombra', 'Silla Cubierta', 'Edredón', 'Cortina', 'Amortiguar', 'Fundas de colchón', 'Funda para edredón', 'Pañuelo', 'Estera', 'Funda de colchón', 'Mosquitero', 'Almohada', 'Funda de almohada', 'Edredón', 'Alfombra', 'Hoja', 'Funda de sofá', 'Paño de mesa', 'Servilleta de mesa', 'Camino de mesa', 'Falda de la tabla', 'Tapiz', 'Lanzar', 'Toalla', 'Doselera', 'Otros textiles para el hogar'
    ],
    "Textil medico":[],
    "Textil para el paquete": [
        'Etiquetas de la ropa','Envase y transporte','Paquete y servicio de impresión','Embalaje farmacéutico','Saco y bolsa para embalaje','Etiquetas impresas','Etiqueta tejida'
    ]
};

module.exports = diccionarioCategorias;
