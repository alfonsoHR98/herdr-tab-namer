# tab-namer

Un mod de [Herdr](https://herdr.dev) que renombra la tab activa con un nombre corto generado por IA,
en minúsculas y con guiones bajos (`fix_login_api`), y un parche opcional para que la sección
**Agents** muestre el nombre de la tab y, debajo, el space al que pertenece.

## Cómo funciona

Al abrirse, el mod lee las últimas líneas de la pantalla del terminal de la tab activa, su carpeta, su
título y el nombre del space, se las pasa a `claude -p --model haiku` y renombra la tab con `tab.rename`.
Responde de 1 a 3 palabras, sin espacios ni acentos, máximo 24 caracteres. Se abre y se cierra solo.

## Instalación

Pídele a tu agente: *"Read ~/.config/herdr-app/AGENTS.md, then add this mod:
github.com/alfonsoHR98/herdr-tab-namer"*. O a mano:

```sh
cp -R mods/tab-namer ~/.config/herdr-app/mods/
herdr-app check ~/.config/herdr-app/mods/tab-namer
```

Mezcla [keys.json](keys.json) con el tuyo (`alt-shift-n` renombra la tab activa).

### Parche opcional: Agents con dos líneas y botón ✦

[agents-filas-dos-lineas.patch](agents-filas-dos-lineas.patch) cambia el mod `agents` que trae Herdr: cada
fila muestra el nombre de la tab arriba y su space debajo (en gris), y el encabezado gana un botón ✦ que
abre `tab-namer`. Hecho sobre la versión de Herdr App 0.1.13; si tu `agents` es otro, aplícalo a mano.

```sh
cd ~/.config/herdr-app && patch -p1 < ruta/a/agents-filas-dos-lineas.patch
```

## Requisitos y qué toca

- Tener `claude` (Claude Code) instalado y con sesión iniciada. Usa tu cuenta.
- **Privacidad:** se envía a Claude un fragmento de la pantalla del terminal (hasta unas 60 líneas), la
  carpeta, el título y el nombre del space. No nombres con esto una tab que muestre datos sensibles.
- Ejecuta `hc read` (lee la pantalla) y `claude`; no usa red por su cuenta ni guarda archivos.

## Límites

- Solo renombra la tab activa, una a la vez.
- Si `claude` falla (sesión caducada, sin red), avisa con una notificación y no cambia nada.

Código: MIT.
