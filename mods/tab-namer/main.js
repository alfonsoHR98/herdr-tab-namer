// tab-namer: renombra la tab activa con un nombre corto, en minúsculas y con
// guiones bajos (ej. fix_login_api), generado por claude (haiku) a partir de lo
// que hay en la pantalla del terminal. Se abre con `mod.open:tab-namer`: actúa y se cierra.
import { View, div } from "gpui-kit";
import { focused, panes, spaces, run, exec, hc, props, closeOverlay, notify, home } from "herdr";

const MODELO = "haiku";
const MAX_CARACTERES = 24;
const MAX_PALABRAS = 3;

// Deja solo letras/números, sin acentos, en minúsculas y unido con _ .
export function limpiar(texto) {
  const palabras = (texto ?? "")
    .split("\n")[0]
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .split("_")
    .filter(Boolean)
    .slice(0, MAX_PALABRAS);
  return palabras.join("_").slice(0, MAX_CARACTERES).replace(/_+$/, "");
}

// El terminal que da contexto: el enfocado, o el primer agente, o el primero de la tab.
function terminalDe(tabId) {
  const f = focused();
  const delTab = panes().filter((p) => p.tab === tabId && p.terminal);
  return delTab.find((p) => p.pane === f?.pane) ?? delTab.find((p) => p.program?.agent) ?? delTab[0] ?? null;
}

async function nombrar() {
  const f = focused();
  if (!f?.tab) return notify({ title: "Nombrar tab", body: "No hay una tab activa.", level: "warning" });
  const pane = terminalDe(f.tab);
  if (!pane) return notify({ title: "Nombrar tab", body: "Esta tab no tiene terminal.", level: "warning" });

  const space = spaces().find((s) => s.tabs.some((t) => t.id === f.tab));
  const aviso = notify({ title: "Nombrando tab…", body: space?.name ?? "", level: "info", timeout: 4000 });
  try {
    const pantalla = (await hc(["read", pane.terminal])).stdout.trim().split("\n").slice(-60).join("\n").slice(-3500);
    const prompt =
      `Dame un nombre corto para una tab de terminal, de 1 a ${MAX_PALABRAS} palabras, en minúsculas, ` +
      `unidas con guion bajo, sin espacios ni acentos (ejemplo: fix_login_api). Responde SOLO el nombre, nada más.\n` +
      `Describe de qué trata el trabajo, no el programa.\n` +
      `Carpeta: ${pane.cwd ?? ""}\nSpace: ${space?.name ?? ""}\nTítulo: ${pane.title ?? ""}\n` +
      `Pantalla del terminal:\n${pantalla}`;
    const r = await exec("sh", ["-c", 'claude -p --model "$1" "$2" </dev/null', "sh", MODELO, prompt], { cwd: home() });
    const nombre = limpiar(r.stdout);
    if (!nombre) throw new Error(r.stderr.trim().split("\n").pop() || "respuesta vacía");
    run("tab.rename", { id: f.tab, name: nombre });
    notify({ title: "Tab renombrada", body: nombre, level: "success", timeout: 3000 });
  } catch (e) {
    notify({ title: "No se pudo nombrar la tab", body: String(e?.message ?? e), level: "error" });
  }
}

export default class TabNamer extends View {
  init() {
    const overlay = props()?.overlay;
    nombrar().finally(() => overlay && closeOverlay(overlay));
  }
  render() {
    return div();
  }
}
