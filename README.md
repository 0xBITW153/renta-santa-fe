# Renta Santa Fe - Web App PWA

Sistema interactivo para control y registro de rentas, recargos y mantenimiento con sincronización en tiempo real a Google Sheets.

## 📱 Acceso
- **URL en Producción:** [https://0xbitw153.github.io/renta-santa-fe/](https://0xbitw153.github.io/renta-santa-fe/)

## 🚀 Características
- Gestión dinámica de cuentas (cargos, abonos, descuentos por mantenimiento).
- Persistencia local permanente con LocalStorage.
- Sincronización bidireccional con Google Sheets (Google Apps Script).
- Exportación a Excel (.csv) y copias de seguridad (.json).
- PWA instalable con interfaz adaptada a móviles (Galaxy Fold / iOS / Android).

---

## 📌 TODOs Pendientes
- [ ] **TODO: WebAPK / Instalación en Cajón de Aplicaciones Samsung (Galaxy Fold 7):**
  - Actualmente se agrega correctamente como acceso directo/shortcut en la pantalla de inicio.
  - Investigar y resolver por qué Samsung One UI / Chrome WebAPK Minting Service no lo coloca directamente en el cajón de todas las aplicaciones (`app drawer`).
  - Posibles vías de resolución:
    1. Probar empaquetado TWA (Trusted Web Activity) con Bubblewrap para generar APK firmado instalable.
    2. Revisar requisitos de screenshots en `manifest.json` (`screenshots` array obligatorio en versiones recientes de Chrome para Android para activar WebAPK en lugar de bookmark).
    3. Verificar headers MIME type de GitHub Pages en `manifest.webmanifest`.
