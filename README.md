# Tech-Scan

Aplicación de diagnóstico técnico en español para Windows 11, Windows 10, macOS y Linux. Interfaz adaptable, análisis local de síntomas y códigos, planes de comprobación y documentación oficial.

## Tecnologías

- React 19 y TypeScript estricto para interfaz y lógica tipada.
- Vite 8 para desarrollo y compilación; CSS con tokens propios y Lucide para iconos.
- Pruebas con node:test y tsx; Prettier para formato.
- GitHub Actions valida y despliega dist en GitHub Pages. Assets con rutas relativas, compatibles con /Tech-Scan/.

## Desarrollo

Requiere Node.js 22.12 o superior.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

## Funcionalidad

Selecciona el equipo, sistema y síntomas. Puedes pegar hasta 20.000 caracteres de un mensaje de error. El motor reconoce un catálogo explícito de códigos de detención, actualización, DNS, falta de espacio y errores de entrada/salida; un texto desconocido se indica como tal.

El resultado conserva todas las áreas coincidentes y las ordena por prioridad y número de señales, sin porcentajes de confianza inventados. Ante un riesgo eléctrico o de batería se bloquean las recomendaciones que impliquen seguir usando el equipo. Las comprobaciones de sistema dependen del sistema operativo.

Los pasos pueden marcarse durante la sesión. Guardar conserva hasta 20 informes en localStorage, únicamente por acción del usuario; descargar genera un informe de texto con síntomas, mensaje, recomendaciones y fuentes. Las marcas de pasos no se guardan. El historial puede eliminarse y se valida al cargarlo.

## Alcance y privacidad

Es orientación basada en datos declarados, no un escáner automático ni una IA generativa. No accede a sensores, discos o registros del sistema, no ejecuta comandos y no confirma componentes defectuosos. No necesita backend ni claves API. Los síntomas y mensajes no se transmiten a servidores. Las fuentes tipográficas se cargan desde Google Fonts; el navegador mantiene fuentes de respaldo si no están disponibles.

Guardar y exportar incluye el mensaje aportado: elimina información sensible antes de compartir. localStorage pertenece al navegador y al origen del sitio; no está cifrado ni sincronizado entre dispositivos.

## Catálogo de conocimiento

Última revisión: 2 de octubre de 2026. Fuentes oficiales consultadas:

- [Microsoft: errores de detención](https://support.microsoft.com/en-us/windows/resolving-blue-screen-errors-in-windows-60b01860-58f2-be66-7516-5c45a66ae3c6)
- [Microsoft: DISM y SFC](https://support.microsoft.com/en-au/windows/experience/backup-recovery/using-system-file-checker-in-windows)
- [Apple: Diagnóstico Apple](https://support.apple.com/en-ie/102550)
- [Apple: Primeros Auxilios](https://support.apple.com/en-gb/102611)
- [Ubuntu: problemas de red](https://help.ubuntu.com/stable/ubuntu-help/net-problem.html.en)
- [Ubuntu: diagnóstico básico](https://wiki.ubuntu.com/BasicTroubleshooting)

El catálogo no se actualiza automáticamente. Mantén síntomas, reglas, códigos, enlaces y fecha en src/diagnostics.ts; añade pruebas en src/diagnostics.test.ts. Las instrucciones de Ubuntu no deben asumirse universales para todas las distribuciones Linux.

## Publicación

Cada push a master ejecuta pruebas y compilación antes de desplegar. En Settings → Pages, la fuente debe ser GitHub Actions. Los pull requests solo ejecutan validación. El sitio es https://analizajech.github.io/Tech-Scan/.
