# Umbra — credencial de acceso por NFC (React Native + Expo)

App móvil que actúa como cliente de un sistema de acceso físico (lector PN532 + Arduino Nano ESP32 + panel web).

## Flujo
1. **Login** (usuario + contraseña) contra `https://monsterballgo.com/api/login`; la contraseña viaja como SHA-256.
2. **Credencial**: foto, nombre completo y número de usuario (el `id` que devuelve la API).
3. **NFC (HCE + APDU)**: el teléfono emula una tarjeta. Cuando el lector manda
   `00 A4 04 00 05 F0 12 34 56 78 00` (SELECT del AID `F012345678`), la app responde
   `[número de usuario, 4 bytes] 90 00`. Aparece "Lector detectado", el borde de la credencial se pone
   verde y el teléfono vibra. La app no sabe si se dio acceso ni habla con el endpoint del escáner.
4. **Créditos**: integrantes, grupo, fecha y tech stack con logos oficiales.

## Estructura
- `src/app/` — pantallas (Expo Router): `index` (login), `credencial`, `creditos`.
- `src/lib/` — API, sesión, datos del equipo (`team.ts`), logos (`logos.ts`).
- `modules/umbra-hce/` — **módulo nativo local de Expo** (Kotlin): servicio `HostApduService`, manifiesto y `apduservice.xml`.
  Es necesario porque Expo Go no incluye HCE.

## Compilar e instalar (development build, Android con NFC)
Requisitos: Node 20+, JDK 17, Android SDK (Android Studio), teléfono con NFC y depuración USB.

```bash
npm install
npx expo run:android      # genera android/, compila e instala en el teléfono conectado
```
Alternativa sin SDK local: `npx eas-cli@latest build --profile development --platform android`.
Después, `npm start` abre el servidor para la development build. **No funciona en Expo Go.**

## Depurar
`adb logcat -s UmbraHCE` muestra cada APDU recibido y el usuario enviado.

## Parámetros que dependen del lector
Todos en `modules/umbra-hce/android/src/main/java/expo/modules/umbrahce/HceConfig.kt` salvo el AID, que también está en
`modules/umbra-hce/android/src/main/res/xml/umbra_apduservice.xml`:

| Parámetro | Valor | Origen |
|---|---|---|
| AID | `F012345678` | `Reader.ino` / `ScannerHTTP.ino` (SELECT) |
| Orden de bytes | little-endian | `ScannerHTTP.ino` hace `memcpy(&id, userId, 4)` en un ESP32 |

Si el id que imprime el monitor serie del Arduino (`id:::`) no coincide con el número de usuario de la credencial,
cambiar `LITTLE_ENDIAN` a `false`.

## Pendiente de completar
- `GRUPO` y `FECHA` en `src/lib/team.ts`.
- Cambiar la foto de perfil de cada integrante (app de la tarea 10 o API) y probar con el usuario "baneado".

## Compilar el APK en GitHub (sin Android Studio)
Si Windows falla por rutas demasiado largas (límite de 260 caracteres), el repositorio incluye
`.github/workflows/build-apk.yml`. Al subirlo a GitHub: pestaña **Actions → Build APK → Run workflow**.
Al terminar, descargar el artefacto **umbra-apk** (contiene `app-release.apk`) e instalarlo en el teléfono.
