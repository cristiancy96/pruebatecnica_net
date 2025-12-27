# Prueba Técnica Asisya - Full Stack App

Este repositorio contiene la solución a la prueba técnica para **Asisya**. Es una aplicación Full Stack que gestiona productos y categorías, con autenticación, roles y carga masiva de datos.

## 🚀 Tecnologías Utilizadas

*   **Backend:** .NET 8 (C#)
    *   Arquitectura Limpia (Clean Architecture)
    *   Entity Framework Core (SQL Server)
    *   JWT Authentication
    *   AutoMapper
    *   Swagger UI
*   **Frontend:** React (Vite) + TypeScript
    *   Tailwind CSS
    *   Axios
    *   React Router
    *   Context API (Auth)
*   **Infraestructura:** Docker & Docker Compose
*   **Base de Datos:** Microsoft SQL Server (Containerizado)

## 📋 Requisitos Previos

*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo.

## 🛠️ Instalación y Ejecución

La aplicación está completamente dockerizada para facilitar su despliegue.

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/cristiancy96/pruebatecnica_net
    cd AsisyaProject
    ```

2.  **Ejecutar con Docker Compose:**
    Este comando construirá las imágenes del backend y frontend, y levantará la base de datos SQL Server.
    ```bash
    docker-compose up -d --build
    ```

3.  **Acceder a la aplicación:**
    *   **Frontend (Web App):** [http://localhost:3000](http://localhost:3000)
    *   **Backend (Swagger API):** [http://localhost:5000/swagger](http://localhost:5000/swagger)

## 👤 Autenticación y Roles

La aplicación maneja autenticación segura vía JWT.

*   **Registro:** Todo **nuevo usuario** registrado automáticamente obtiene el rol de **`Admin`** (configurado así para propósitos de prueba y facilidad en la corrección).
*   **Login:** Al iniciar sesión se recibe un Token JWT que debe ser enviado en los headers (`Authorization: Bearer <token>`) para peticiones protegidas.

## 📦 Funcionalidades Principales

### 1. Gestión de Productos y Categorías
*   CRUD completo de Productos.
*   Filtrado y listado paginado.
*   Creación de categorías (Requiere rol Admin).

### 2. Carga Masiva de Datos
Se ha incluido un script y un archivo JSON para probar la carga masiva de 1000 productos.

*   **Archivo:** `bulk_products.json` (Generado en la raíz).
*   **Endpoint:** `POST /api/products/bulk`
*   **Herramienta recomendada:** Postman o cURL.

**Pasos para carga masiva:**
1.  Registrarse e Iniciar Sesión para obtener el Token.
2.  Crear al menos una Categoría (ID 1).
3.  Enviar el contenido de `bulk_products.json` al endpoint de bulk.

### 3. Frontend Traducido y Mejorado
Toda la interfaz de usuario (Login, Registro, Dashboard, Admin) ha sido traducida al español.

### 4. Nuevas Funcionalidades
*   **Vista de Detalle:** Nueva página de detalle de producto (`/product/:id`) con imágenes dinámicas de alta calidad (Unsplash) basadas en la categoría del producto.
*   **Gestión de Inventario:** Capacidad para **Editar** y **Eliminar** productos directamente desde el panel de administración, con validaciones de seguridad.

## 📁 Estructura del Proyecto

```
AsisyaProject/
├── Asisya.Backend/         # Solución .NET
│   ├── Asisya.Api/         # Entry point y Controllers
│   ├── Asisya.Application/ # Lógica de negocio, DTOs, Servicios
│   ├── Asisya.Domain/      # Entidades y Interfaces del Repository
│   ├── Asisya.Infrastructure/ # EF Core, Migraciones
│   └── Asisya.Tests/       # Pruebas Unitarias
├── asisya-frontend/        # Proyecto React + Vite
│   ├── src/
│   │   ├── pages/          # Login, Register, Dashboard, Admin
│   │   ├── components/     # Componentes reutilizables
│   │   ├── context/        # Auth Context
│   │   └── api/            # Configuración Axios
├── docker-compose.yml      # Orquestación de contenedores
├── bulk_products.json      # Datos de prueba
└── README.md               # Documentación
```

## 🏗️ Decisiones Arquitectónicas

### Backend: Clean Architecture
Se optó por una **Arquitectura Limpia** para descoplar la lógica de negocio de la infraestructura y la presentación.
*   **Domain**: Entidades puras sin dependencias.
*   **Application**: Casos de uso e interfaces (Abstracción).
*   **Infrastructure**: Implementación de base de datos y servicios externos.
*   **API**: Capa de presentación RESTful.

**Por qué?** Facilita el mantenimiento, las pruebas unitarias y permite cambiar tecnologías (como la base de datos) sin afectar la lógica de negocio.

### Frontend: React + Vite + TypeScript
*   **Vite**: Por su velocidad de compilación superior a CRA.
*   **TypeScript**: Para añadir tipado estático y reducir errores en tiempo de ejecución.
*   **Tailwind CSS**: Para un desarrollo de UI rápido y consistente sin salir del HTML/JSX.
*   **Client-Side Pagination**: Dada la escala del dataset de prueba (1000 items), se optó por paginación y filtrado en el cliente para mejor UX (menor latencia) y reducir llamadas al servidor.
*   **Context API**: Se eligió sobre Redux por la simplicidad, ya que el estado global necesario (Auth) era mínimo.
*   **Enrutamiento Modular**: Se implementó una separación clara de rutas en `AppRouter` para escalabilidad.

### Infraestructura: Docker
La aplicación está totalmente **dockerizada** para garantizar que funcione idénticamente en cualquier entorno (desarrollo, CI/CD, producción) y eliminar el problema de "en mi máquina funciona".

### Base de Datos: Code-First
Se utilizó el enfoque **Code-First** con Entity Framework Core para mantener el esquema de base de datos versionado junto con el código (Migraciones).

## � Estrategias de Escalabilidad y Alto Rendimiento (Propuesta)

Para soportar **altas cargas** y escalar en un entorno Cloud, la arquitectura actual evolucionaría de la siguiente manera:

### 1. Optimización de Carga Masiva (High Load)
Actualmente, la carga masiva es síncrona. Para millones de registros, implementaría:
*   **Procesamiento Asíncrono:** El endpoint `/bulk` solo recibiría el archivo y respondería `202 Accepted`.
*   **Message Queue (RabbitMQ / Azure Service Bus):** Se enviaría un mensaje a una cola con la ruta del archivo.
*   **Background Workers:** Servicios dedicados (Workers) leerían de la cola y procesarían los registros en segundo plano.
*   **Batch Inserts:** Uso de `EF Core Bulk Extensions` o `SqlBulkCopy` para insertar lotes de 10,000 registros en milisegundos, en lugar de uno por uno.

### 2. Caché Distribuido (Redis)
Para reducir la carga en la base de datos en operaciones de lectura frecuentes (como `GET /products`):
*   Implementar **Redis** como caché distribuido.
*   Patrón **Cache-Aside**: Al pedir productos, primero consultar Redis. Si no existen, ir a SQL Server, guardarlos en Redis (con TTL) y devolverlos.

### 3. Escalado Horizontal (Cloud)
Gracias a que la API es **Stateless** (no guarda sesión en memoria, usa JWT), es trivial escalar horizontalmente:
*   **Load Balancer:** Colocar un balanceador de carga (NGINX, AWS ALB, Azure Front Door) frente a las instancias de la API.
*   **Kubernetes / Container Instances:** Desplegar múltiples réplicas (`replicas: 5`) de los contenedores Docker del Backend.
*   **Auto-scaling:** Configurar reglas para escalar automáticamente basado en CPU/Memoria o métricas de la cola de mensajes.

## �🐛 Solución de Problemas Comunes

*   **Error de Base de Datos al iniciar:** Si la BD no carga, intenta reiniciar el volumen:
    ```bash
    docker-compose down -v
    docker-compose up -d --build
    ```
*   **Frontend no conecta con Backend:** Asegúrate de que el backend esté corriendo en el puerto `5000` y que no haya bloqueos de CORS (ya está configurado para permitir todo en este entorno).

---
Desarrollado por Cristian Cruz para la prueba técnica de Asisya.
