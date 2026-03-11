# PetFinder Mobile

Aplicación móvil para ayudar a reunir mascotas perdidas con sus dueños, desarrollada con React Native y Expo SDK 55.

## Descripción

Esta es la versión móvil de PetFinder, que aprovecha capacidades nativas de los dispositivos para mejorar la experiencia: cámara para fotos directas, GPS para ubicación automática, y notificaciones push para alertas en tiempo real.

## Características

**Funcionalidades principales:**
- Autenticación de usuarios
- Listado de mascotas perdidas y encontradas
- Detalles completos de cada reporte
- Publicación de nuevos reportes con fotos

**Ventajas de la app móvil:**
- Captura de fotos con la cámara del dispositivo
- Detección automática de ubicación mediante GPS
- Notificaciones push aunque la app esté cerrada
- Integración con mapas nativos del sistema

## Tecnologías

- **React Native** 0.83.2
- **Expo SDK** 55
- **React** 19.2.0
- **React Navigation** 7.x
- **Axios** para llamadas API
- **AsyncStorage** para persistencia local
- **Expo Camera** para fotos
- **Expo Location** para GPS
- **Expo Notifications** para notificaciones push

## Instalación

### Requisitos previos

- Node.js 18 o superior
- npm o yarn
- Aplicación Expo Go en tu dispositivo móvil ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/petFinderUptc/mobile-petFinder.git
cd mobile-petFinder
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:

Crea un archivo `.env` copiando el template `.env.example`:
```bash
cp .env.example .env
```

Edita `.env` con la URL del backend.

**Nota:** Reinicia el servidor después de cambiar variables de entorno. Asegúrate de que tu computadora y celular estén en la misma red WiFi también.

4. Iniciar el servidor:
```bash
npm start
```

5. Ejecutar en tu dispositivo:
   - Android: Escanea el código QR con Expo Go
   - iOS: Escanea el código QR con la app de Cámara

## Uso

### Comandos disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS (solo macOS)
npm run ios

# Ejecutar en navegador
npm run web
```

## Estructura del proyecto

```
mobile-petFinder/
├── src/
│   ├── constants/          # Configuración y constantes
│   ├── contexts/           # Contextos de React
│   ├── navigation/         # Navegación de la app
│   ├── screens/            # Pantallas
│   ├── services/           # Servicios API
│   └── utils/              # Utilidades
├── assets/                 # Imágenes e iconos
├── App.js                  # Punto de entrada
├── app.config.js           # Configuración de Expo
└── package.json
```

## Permisos requeridos

La aplicación solicita los siguientes permisos cuando son necesarios:

**Android:**
- Cámara
- Ubicación (precisa y aproximada)
- Almacenamiento
- Notificaciones

**iOS:**
- Cámara
- Ubicación
- Notificaciones

## Deploy

Para crear builds de producción, se podría utilizar EAS (Expo Application Services), pero eso no está de momento.

## Licencia

Este proyecto es parte de la asignatura Trabajo de Campo para la UPTC.

## Equipo

Proyecto desarrollado por el equipo de PetFinder UPTC.

---

Para más información sobre el proyecto web, visita [frontend-petFinder](https://github.com/petFinderUptc/frontend-petFinder).
