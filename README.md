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
    git clone <URL_DEL_REPO>
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

### 3. Frontend Traducido
Toda la interfaz de usuario (Login, Registro, Dashboard, Admin) ha sido traducida y adaptada al español.

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

## 🐛 Solución de Problemas Comunes

*   **Error de Base de Datos al iniciar:** Si la BD no carga, intenta reiniciar el volumen:
    ```bash
    docker-compose down -v
    docker-compose up -d --build
    ```
*   **Frontend no conecta con Backend:** Asegúrate de que el backend esté corriendo en el puerto `5000` y que no haya bloqueos de CORS (ya está configurado para permitir todo en este entorno).

---
Desarrollado por [Tu Nombre / Cristian] para la prueba técnica de Asisya.
