# Paquetes modelo 2026 — puntero

La fuente de verdad vive en el repo de conocimiento:

**[pgt/04-producto/datos/paquetes-modelo-2026/CEREBRO.md](../../pgt/04-producto/datos/paquetes-modelo-2026/CEREBRO.md)**

(ruta absoluta: `/home/jairoprodev/proyectos/pgt/04-producto/datos/paquetes-modelo-2026/`)

No editar precios de `src/content/tours/*.json` hasta validar `informes/PRECIOS-Y-FORMULA.md` con Cristina/Ricardo.

Regenerar:

```bash
python3 scripts/google/download-paquetes-modelo.py          # Drive → raw/
python3 scripts/google/build-paquetes-cerebro.py            # xlsx/pptx → csvs
python3 scripts/google/generate-paquetes-informes.py        # markdown cerebro
```
