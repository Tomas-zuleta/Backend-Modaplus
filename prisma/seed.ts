import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Iniciando seed de base de datos...');

  // Crear roles
  const superadmin = await prisma.rol.upsert({
    where: { nombre_rol: 'Superadministrador' },
    update: {},
    create: {
      nombre_rol: 'Superadministrador',
      descripcion: 'Cuenta principal protegida con acceso completo',
      estado: 'Activo',
      permisos: JSON.stringify({
        dashboard: { view: true, create: true, edit: true, delete: true, download: true, annul: true },
        catalogo: { view: true, create: false, edit: false, delete: false, download: false, annul: false },
        inventario: { view: true, create: true, edit: true, delete: true, download: true, annul: true },
        colores: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        tallas: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        categorias: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        ventas: { view: true, create: true, edit: true, delete: true, download: true, annul: true },
        compras: { view: true, create: true, edit: true, delete: true, download: true, annul: true },
        clientes: { view: true, create: true, edit: true, delete: true, download: true, annul: false },
        roles: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        usuarios: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        separe: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        abonos: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        devoluciones: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
      }),
    },
  });

  const admin = await prisma.rol.upsert({
    where: { nombre_rol: 'Administrador' },
    update: {},
    create: {
      nombre_rol: 'Administrador',
      descripcion: 'Administración operativa del sistema',
      estado: 'Activo',
      permisos: JSON.stringify({
        dashboard: { view: true, create: true, edit: true, delete: true, download: true, annul: true },
        catalogo: { view: true, create: false, edit: false, delete: false, download: false, annul: false },
        inventario: { view: true, create: true, edit: true, delete: true, download: true, annul: true },
        colores: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        tallas: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        categorias: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        ventas: { view: true, create: true, edit: true, delete: true, download: true, annul: true },
        compras: { view: true, create: true, edit: true, delete: true, download: true, annul: true },
        clientes: { view: true, create: true, edit: true, delete: true, download: true, annul: false },
        roles: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        usuarios: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        separe: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        abonos: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        devoluciones: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
      }),
    },
  });

  const cliente = await prisma.rol.upsert({
    where: { nombre_rol: 'Cliente' },
    update: {},
    create: {
      nombre_rol: 'Cliente',
      descripcion: 'Acceso al catálogo de compra',
      estado: 'Activo',
      permisos: JSON.stringify({
        catalogo: { view: true, create: false, edit: false, delete: false, download: false, annul: false },
      }),
    },
  });

  const vendedor = await prisma.rol.upsert({
    where: { nombre_rol: 'Vendedor' },
    update: {},
    create: {
      nombre_rol: 'Vendedor',
      descripcion: 'Gestión de ventas, clientes y plan separe',
      estado: 'Activo',
      permisos: JSON.stringify({
        dashboard: { view: true, create: false, edit: false, delete: false, download: false, annul: false },
        catalogo: { view: true, create: false, edit: false, delete: false, download: false, annul: false },
        ventas: { view: true, create: true, edit: true, delete: true, download: true, annul: true },
        clientes: { view: true, create: true, edit: true, delete: false, download: true, annul: false },
        separe: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        abonos: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
        devoluciones: { view: true, create: true, edit: true, delete: true, download: false, annul: false },
      }),
    },
  });

  console.log('Roles creados');

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.usuario.upsert({
    where: { correo: 'admin@modaplus.co' },
    update: {},
    create: {
      correo: 'admin@modaplus.co',
      contrasena_hash: hashedPassword,
      nombres: 'Admin',
      apellidos: 'Sistema',
      telefono: '3000000000',
      id_rol: superadmin.id_rol,
    },
  });

  console.log('Usuario admin creado (admin@modaplus.co / admin123)');

  // Crear categorías
  const camisas = await prisma.categoria.upsert({
    where: { nombre_categoria: 'Camisas' },
    update: {},
    create: { nombre_categoria: 'Camisas', descripcion: 'Camisas, blusas y prendas superiores' },
  });
  const pantalones = await prisma.categoria.upsert({
    where: { nombre_categoria: 'Pantalones' },
    update: {},
    create: { nombre_categoria: 'Pantalones', descripcion: 'Jeans, chinos, bermudas y pantalones' },
  });
  const vestidos = await prisma.categoria.upsert({
    where: { nombre_categoria: 'Vestidos' },
    update: {},
    create: { nombre_categoria: 'Vestidos', descripcion: 'Vestidos casuales, coctel y formales' },
  });
  const accesorios = await prisma.categoria.upsert({
    where: { nombre_categoria: 'Accesorios' },
    update: {},
    create: { nombre_categoria: 'Accesorios', descripcion: 'Complementos y accesorios de moda' },
  });

  console.log('Categorías creadas');

  // Crear colores
  const colores = [
    { nombre_color: 'Blanco', codigo_hex: '#f5f5f0' },
    { nombre_color: 'Negro', codigo_hex: '#111111' },
    { nombre_color: 'Azul Claro', codigo_hex: '#9ccfe7' },
    { nombre_color: 'Beige', codigo_hex: '#d8c3a5' },
    { nombre_color: 'Vino', codigo_hex: '#6f1d2d' },
    { nombre_color: 'Multicolor', codigo_hex: '#d66ad2', es_multicolor: true, codigos_hex: JSON.stringify(['#16a34a', '#dc2626', '#2563eb', '#eab308']) },
    { nombre_color: 'Azul Oscuro', codigo_hex: '#1e3a5f' },
    { nombre_color: 'Gris', codigo_hex: '#888888' },
  ];

  for (const color of colores) {
    await prisma.color.upsert({
      where: { nombre_color: color.nombre_color },
      update: {},
      create: color as any,
    });
  }

  console.log('Colores creados');

  // Crear tallas
  const tallas = [
    { nombre_talla: 'XS', descripcion: 'Ropa' },
    { nombre_talla: 'S', descripcion: 'Ropa' },
    { nombre_talla: 'M', descripcion: 'Ropa' },
    { nombre_talla: 'L', descripcion: 'Ropa' },
    { nombre_talla: 'XL', descripcion: 'Ropa' },
    { nombre_talla: 'XXL', descripcion: 'Ropa' },
    { nombre_talla: 'Única', descripcion: 'Accesorios' },
    { nombre_talla: '28', descripcion: 'Pantalon' },
    { nombre_talla: '30', descripcion: 'Pantalon' },
    { nombre_talla: '32', descripcion: 'Pantalon' },
    { nombre_talla: '34', descripcion: 'Pantalon' },
    { nombre_talla: '36', descripcion: 'Pantalon' },
    { nombre_talla: '38', descripcion: 'Pantalon' },
  ];

  for (const talla of tallas) {
    await prisma.talla.upsert({
      where: { nombre_talla: talla.nombre_talla },
      update: {},
      create: talla,
    });
  }

  console.log('Tallas creadas');

  // Crear productos
  const producto1 = await prisma.producto.upsert({
    where: { referencia: 'CAM-OXF' },
    update: {},
    create: {
      id_categoria: camisas.id_categoria,
      referencia: 'CAM-OXF',
      nombre_producto: 'Camisa Oxford Manga Larga',
      descripcion: 'Camisa formal manga larga',
      genero: 'Hombre',
    },
  });

  const producto2 = await prisma.producto.upsert({
    where: { referencia: 'PAN-CHI' },
    update: {},
    create: {
      id_categoria: pantalones.id_categoria,
      referencia: 'PAN-CHI',
      nombre_producto: 'Pantalon Chino Slim',
      descripcion: 'Pantalon casual corte slim',
      genero: 'Hombre',
    },
  });

  const producto3 = await prisma.producto.upsert({
    where: { referencia: 'VES-FLO' },
    update: {},
    create: {
      id_categoria: vestidos.id_categoria,
      referencia: 'VES-FLO',
      nombre_producto: 'Vestido Floral Midi',
      descripcion: 'Vestido casual estampado',
      genero: 'Mujer',
    },
  });

  console.log('Productos creados');

  // Crear variantes
  await prisma.variante.upsert({
    where: { id_producto_id_talla_id_color: { id_producto: producto1.id_producto, id_talla: 3, id_color: 1 } },
    update: {},
    create: {
      id_producto: producto1.id_producto,
      id_talla: 3, // M
      id_color: 1, // Blanco
      precio_venta: 89000,
      stock_actual: 8,
      stock_minimo: 2,
      stock_maximo: 20,
    },
  });

  await prisma.variante.upsert({
    where: { id_producto_id_talla_id_color: { id_producto: producto1.id_producto, id_talla: 4, id_color: 3 } },
    update: {},
    create: {
      id_producto: producto1.id_producto,
      id_talla: 4, // L
      id_color: 3, // Azul Claro
      precio_venta: 89000,
      stock_actual: 2,
      stock_minimo: 2,
      stock_maximo: 20,
    },
  });

  await prisma.variante.upsert({
    where: { id_producto_id_talla_id_color: { id_producto: producto2.id_producto, id_talla: 10, id_color: 4 } },
    update: {},
    create: {
      id_producto: producto2.id_producto,
      id_talla: 10, // 32
      id_color: 4, // Beige
      precio_venta: 125000,
      stock_actual: 5,
      stock_minimo: 2,
      stock_maximo: 15,
    },
  });

  await prisma.variante.upsert({
    where: { id_producto_id_talla_id_color: { id_producto: producto3.id_producto, id_talla: 2, id_color: 6 } },
    update: {},
    create: {
      id_producto: producto3.id_producto,
      id_talla: 2, // S
      id_color: 6, // Multicolor
      precio_venta: 155000,
      stock_actual: 3,
      stock_minimo: 1,
      stock_maximo: 10,
    },
  });

  console.log('Variantes creadas');

  // Crear clientes
  const clientePassword = await bcrypt.hash('cliente123', 12);
  await prisma.cliente.upsert({
    where: { identificacion: '900100001' },
    update: {},
    create: {
      id_rol: cliente.id_rol,
      tipo_documento: 'CC',
      identificacion: '900100001',
      nombres: 'Valeria',
      apellidos: 'Pardo Ruiz',
      telefono: '3100001001',
      correo: 'valeria.pardo@example.com',
      direccion: 'Cra 12 #34-56, Medellin',
      contrasena_hash: clientePassword,
    },
  });

  await prisma.cliente.upsert({
    where: { identificacion: '900100002' },
    update: {},
    create: {
      id_rol: cliente.id_rol,
      tipo_documento: 'CC',
      identificacion: '900100002',
      nombres: 'Nicolas',
      apellidos: 'Rivera Sol',
      telefono: '3100001002',
      correo: 'nicolas.rivera@example.com',
      direccion: 'Cl 45 #67-89, Medellin',
      contrasena_hash: clientePassword,
    },
  });

  console.log('Clientes creados');

  // Crear proveedores
  await prisma.proveedor.upsert({
    where: { nit: '900111222' },
    update: {},
    create: {
      nit: '900111222',
      razon_social: 'Textiles La 36 S.A.S.',
      contacto: 'Laura Mesa',
      contacto_telefono: '3105551101',
      contacto_correo: 'laura.mesa@textiles36.co',
      telefono: '6041112233',
      correo: 'ventas@textiles36.co',
      direccion: 'Medellin',
    },
  });

  await prisma.proveedor.upsert({
    where: { nit: '900333444' },
    update: {},
    create: {
      nit: '900333444',
      razon_social: 'Confecciones Medellin Ltda.',
      contacto: 'Andres Mora',
      contacto_telefono: '3105551102',
      contacto_correo: 'andres.mora@confemed.co',
      telefono: '6042223344',
      correo: 'contacto@confemed.co',
      direccion: 'Medellin',
    },
  });

  console.log('Proveedores creados');

  console.log('Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
