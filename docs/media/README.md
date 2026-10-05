# Capturas de Studio 03

Imágenes reales del navegador a 1280 × 900 y en móvil a 390 × 844. La landing utiliza la misma captura del estudio que `public/media/studio-preview.jpg`.

Para renovar el GIF, captura el recorrido real de landing → equipo → señales → contexto → resultado → guardar → historial. Guarda las capturas JPEG del mismo viewport como `artifacts/gif/00.jpg`, `01.jpg`, etc. Ese directorio está ignorado por Git.

Con Python y Pillow instalados:

```sh
python scripts/build_demo_gif.py
```

El script redimensiona las capturas a 960 px, compone una animación de 2,4 segundos por estado y escribe `docs/media/workflow.gif`. No genera interfaces ni resultados ficticios.
