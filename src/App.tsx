import React, { useEffect, useRef, useState } from "react";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Cpu,
  Download,
  FileText,
  History,
  Monitor,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Terminal,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  analyze,
  reportText,
  reviewed,
  sources,
  symptoms,
  type Category,
  type OS,
  type Report,
} from "./diagnostics";
import "./styles.css";
type View = "diagnostic" | "history" | "library";
function loadHistory(): Report[] {
  try {
    const data: unknown = JSON.parse(
      localStorage.getItem("tech-scan-history-v2") || "[]",
    );
    return Array.isArray(data)
      ? data
          .filter(
            (r): r is Report =>
              !!r &&
              typeof r === "object" &&
              typeof r.id === "string" &&
              typeof r.date === "string" &&
              ["Windows 11", "Windows 10", "macOS", "Linux"].includes(r.os) &&
              typeof r.device === "string" &&
              Array.isArray(r.selected) &&
              r.selected.every((s: unknown) => typeof s === "string") &&
              typeof r.log === "string",
          )
          .slice(0, 20)
          .map((r) => ({ ...r, result: analyze(r.selected, r.log, r.os) }))
      : [];
  } catch {
    return [];
  }
}
export default function App() {
  const [view, setView] = useState<View>("diagnostic");
  const [os, setOs] = useState<OS>("Windows 11");
  const [device, setDevice] = useState("Portátil");
  const [selected, setSelected] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>("Todos");
  const [search, setSearch] = useState("");
  const [log, setLog] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<Report[]>(loadHistory);
  const [notice, setNotice] = useState("");
  const [help, setHelp] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const helpRef = useRef<HTMLDialogElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const dialog = helpRef.current;
    if (help && dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, [help]);
  useEffect(() => {
    if (report && view === "diagnostic") {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({ block: "center" });
    }
  }, [report?.id, view]);
  const visible = symptoms.filter(
    (s) =>
      (!s.windows || os.startsWith("Windows")) &&
      (category === "Todos" || s.category === category) &&
      `${s.label} ${s.detail}`
        .toLocaleLowerCase("es")
        .includes(search.toLocaleLowerCase("es")),
  );
  const valid = selected.length > 0 || log.trim().length > 0;
  function reset() {
    setReport(null);
    setSelected([]);
    setLog("");
    setChecked([]);
    setNotice("");
    setView("diagnostic");
    setSearch("");
    setCategory("Todos");
  }
  function diagnose() {
    if (!valid) return;
    setReport({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      os,
      device,
      selected: [...selected],
      log,
      result: analyze(selected, log, os),
    });
    setChecked([]);
    setNotice("");
  }
  function persist(next: Report[]) {
    try {
      localStorage.setItem("tech-scan-history-v2", JSON.stringify(next));
      setHistory(next);
      return true;
    } catch {
      setNotice(
        "No se pudo guardar en este navegador. Puedes descargar el informe.",
      );
      return false;
    }
  }
  function save() {
    if (!report) return;
    const next = [report, ...history.filter((r) => r.id !== report.id)].slice(
      0,
      20,
    );
    if (persist(next)) setNotice("Informe guardado en este navegador.");
  }
  function download() {
    if (!report) return;
    const url = URL.createObjectURL(
      new Blob([reportText(report)], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `tech-scan-${new Date(report.date).toLocaleDateString("sv-SE")}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <aside className="sidebar">
        <a className="brand" href="./" aria-label="Tech-Scan, inicio">
          <span className="brand-icon">
            <Activity size={25} />
          </span>
          <span>
            tech<span className="brand-light">scan</span>
            <small>DIAGNÓSTICO INTELIGENTE</small>
          </span>
        </a>
        <div className="nav-label">ESPACIO DE TRABAJO</div>
        <nav aria-label="Navegación principal">
          <button
            className={view === "diagnostic" ? "active" : ""}
            onClick={() => {
              setView("diagnostic");
              setNotice("");
            }}
          >
            <SlidersHorizontal size={18} /> Diagnóstico{" "}
            <ChevronRight size={15} />
          </button>
          <button
            className={view === "history" ? "active" : ""}
            onClick={() => {
              setView("history");
              setNotice("");
            }}
          >
            <History size={18} /> Historial{" "}
            <span className="nav-count">{history.length}</span>
          </button>
          <button
            className={view === "library" ? "active" : ""}
            onClick={() => {
              setView("library");
              setNotice("");
            }}
          >
            <ClipboardList size={18} /> Base de conocimiento
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="local-card">
            <ShieldCheck size={22} />
            <strong>Tu información, contigo.</strong>
            <p>
              El análisis se realiza en tu navegador. Tus registros no se envían
              a un servidor.
            </p>
            <span>
              <i /> Procesamiento local
            </span>
          </div>
          <button className="help-button" onClick={() => setHelp(true)}>
            <CircleHelp size={17} /> Cómo funciona <ArrowUpRight size={15} />
          </button>
          <div className="sidebar-foot">
            TECH-SCAN <span>v2.0</span>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div>
            Espacio de trabajo <ChevronRight size={14} />
            <strong>
              {view === "history"
                ? "Historial"
                : view === "library"
                  ? "Base de conocimiento"
                  : "Diagnóstico"}
            </strong>
          </div>
          <span className="status">
            <i /> Motor de reglas disponible
          </span>
        </header>
        <main id="main">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {view === "diagnostic"
                  ? "ENTIENDE. COMPRUEBA. RESUELVE."
                  : "TU CENTRO DE SOPORTE"}
              </div>
              <h1>
                {view === "history"
                  ? "Historial de diagnósticos"
                  : view === "library"
                    ? "Conocimiento que ayuda."
                    : "Cada problema tiene un siguiente paso."}
              </h1>
              <p>
                {view === "history"
                  ? "Tus informes guardados, disponibles en este navegador."
                  : view === "library"
                    ? "Guías oficiales para comprobar las causas y avanzar con confianza."
                    : "Describe lo que ocurre y obtén un plan claro para revisar tu equipo."}
              </p>
            </div>
            <button className="button secondary new-button" onClick={reset}>
              <Plus size={17} /> Nuevo diagnóstico
            </button>
          </div>
          {notice && (
            <div className="notice" role="status">
              {notice}
              <button aria-label="Cerrar aviso" onClick={() => setNotice("")}>
                <X size={16} />
              </button>
            </div>
          )}
          {view === "diagnostic" && (
            <>
              <div className="overview">
                <div>
                  <span className="overview-icon">
                    <Monitor size={21} />
                  </span>
                  <div>
                    <strong>4 sistemas</strong>
                    <small>Windows · macOS · Linux</small>
                  </div>
                </div>
                <div>
                  <span className="overview-icon">
                    <Search size={21} />
                  </span>
                  <div>
                    <strong>20 señales de diagnóstico</strong>
                    <small>Hardware, sistema y conectividad</small>
                  </div>
                </div>
                <div>
                  <span className="overview-icon">
                    <ShieldCheck size={21} />
                  </span>
                  <div>
                    <strong>Orientación con fuentes</strong>
                    <small>Sin instalaciones ni accesos remotos</small>
                  </div>
                </div>
              </div>
              {!report ? (
                <div className="diagnostic-layout">
                  <section
                    className="panel diagnostic-panel"
                    aria-label="Nuevo diagnóstico"
                  >
                    <div className="panel-heading">
                      <div>
                        <span className="step-number">01</span>
                        <h2>Configura tu diagnóstico</h2>
                      </div>
                      <span className="subtle">Aproximadamente 2 minutos</span>
                    </div>
                    <div className="configuration">
                      <label>
                        Tipo de equipo
                        <select
                          value={device}
                          onChange={(e) => setDevice(e.target.value)}
                        >
                          <option>Portátil</option>
                          <option>Computador de escritorio</option>
                          <option>Mini PC / estación de trabajo</option>
                        </select>
                      </label>
                      <label>
                        Sistema operativo
                        <select
                          value={os}
                          onChange={(e) => {
                            const next = e.target.value as OS;
                            setOs(next);
                            if (!next.startsWith("Windows"))
                              setSelected((s) =>
                                s.filter((id) => id !== "bsod"),
                              );
                          }}
                        >
                          <option>Windows 11</option>
                          <option>Windows 10</option>
                          <option>macOS</option>
                          <option>Linux</option>
                        </select>
                      </label>
                    </div>
                    <div className="section-heading">
                      <div>
                        <span className="step-number">02</span>
                        <h2>¿Qué está ocurriendo?</h2>
                      </div>
                      <span className="selection-count">
                        {selected.length} seleccionados
                      </span>
                    </div>
                    <p className="section-description">
                      Selecciona todos los síntomas que has observado.
                    </p>
                    <div className="filter-row">
                      <div className="tabs" aria-label="Filtrar síntomas">
                        {(
                          [
                            "Todos",
                            "Sistema",
                            "Rendimiento",
                            "Hardware",
                            "Conectividad",
                          ] as Category[]
                        ).map((c) => (
                          <button
                            key={c}
                            aria-pressed={category === c}
                            className={category === c ? "selected" : ""}
                            onClick={() => setCategory(c)}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                      <label className="search-field">
                        <Search size={16} />
                        <input
                          aria-label="Buscar síntomas"
                          placeholder="Buscar síntoma…"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="symptom-grid">
                      {visible.map((s) => (
                        <label
                          className={`symptom ${selected.includes(s.id) ? "chosen" : ""}`}
                          key={s.id}
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(s.id)}
                            onChange={() =>
                              setSelected((prev) =>
                                prev.includes(s.id)
                                  ? prev.filter((id) => id !== s.id)
                                  : [...prev, s.id],
                              )
                            }
                          />
                          <span className="checkbox-visual">
                            <Check size={12} />
                          </span>
                          <span>
                            <strong>{s.label}</strong>
                            <small>{s.detail}</small>
                          </span>
                        </label>
                      ))}
                      {!visible.length && (
                        <p className="empty-search">
                          No hay coincidencias. Prueba otro término o categoría.
                        </p>
                      )}
                    </div>
                    <div className="log-heading">
                      <div>
                        <Terminal size={18} />
                        <h2>Agrega el mensaje de error</h2>
                        <span className="optional">OPCIONAL</span>
                      </div>
                      <span>{log.length.toLocaleString("es")} / 20.000</span>
                    </div>
                    <textarea
                      aria-label="Mensaje de error o registro"
                      value={log}
                      maxLength={20000}
                      onChange={(e) => setLog(e.target.value)}
                      placeholder={
                        "Pega el código o el fragmento relevante del registro.\nEj. MEMORY_MANAGEMENT, ERR_NAME_NOT_RESOLVED…"
                      }
                    />
                    <p className="input-note">
                      Revisa y elimina contraseñas, claves y datos personales
                      antes de guardar o compartir el informe.
                    </p>
                    <div className="form-footer">
                      <span>
                        <ShieldCheck size={15} /> Análisis local por evidencias
                      </span>
                      <button
                        className="button primary"
                        disabled={!valid}
                        onClick={diagnose}
                      >
                        Analizar síntomas <ArrowRight size={17} />
                      </button>
                    </div>
                  </section>
                  <aside className="context-column">
                    <div className="scan-illustration">
                      <div className="illustration-grid" />
                      <span className="corner-label">
                        TECH-SCAN / ENGINE 02
                      </span>
                      <div className="device-drawing">
                        <div className="device-screen">
                          <Activity size={56} strokeWidth={1.3} />
                          <span>SYSTEM CHECK</span>
                        </div>
                        <div className="device-base" />
                      </div>
                      <span className="illustration-status">
                        <i /> Listo para analizar
                      </span>
                    </div>
                    <div className="expectation">
                      <span className="eyebrow">UN PROCESO MÁS CLARO</span>
                      <h3>
                        Del síntoma
                        <br />a la solución.
                      </h3>
                      <ol>
                        <li>
                          <span>1</span>
                          <div>
                            <strong>Describe el problema</strong>
                            <p>Elige síntomas y añade el error.</p>
                          </div>
                        </li>
                        <li>
                          <span>2</span>
                          <div>
                            <strong>Explora posibles causas</strong>
                            <p>Entiende qué revisar y por qué.</p>
                          </div>
                        </li>
                        <li>
                          <span>3</span>
                          <div>
                            <strong>Sigue tu plan de acción</strong>
                            <p>Comprueba cada paso a tu ritmo.</p>
                          </div>
                        </li>
                      </ol>
                    </div>
                    <div className="scope-note">
                      <CircleHelp size={18} />
                      <p>
                        Un diagnóstico orientativo, basado en lo que indicas. No
                        mide tu hardware ni ejecuta reparaciones.
                      </p>
                    </div>
                  </aside>
                </div>
              ) : (
                <section
                  className="panel results"
                  aria-label="Resultado del diagnóstico"
                >
                  <div className="result-top">
                    <div>
                      <span className="eyebrow">INFORME DE DIAGNÓSTICO</span>
                      <h2 ref={resultRef} tabIndex={-1}>
                        {report.result.findings.length
                          ? `${report.result.findings.length} áreas para revisar`
                          : "No hay coincidencias conocidas"}
                      </h2>
                      <p>
                        {report.device} · {report.os} ·{" "}
                        {new Date(report.date).toLocaleString("es-CO")}
                      </p>
                    </div>
                    <div className="result-actions">
                      <button
                        className="button secondary"
                        onClick={() => {
                          setReport(null);
                          setChecked([]);
                        }}
                      >
                        <SlidersHorizontal size={16} /> Editar
                      </button>
                      <button className="button secondary" onClick={save}>
                        <History size={16} /> Guardar
                      </button>
                      <button className="button primary" onClick={download}>
                        <Download size={16} /> Descargar
                      </button>
                    </div>
                  </div>
                  <p className="result-disclaimer">
                    Causas posibles, no fallas confirmadas. Las prioridades
                    indican qué revisar primero; no son probabilidades.
                  </p>
                  {report.result.matches.length > 0 && (
                    <div className="code-matches">
                      <Terminal size={18} />
                      <div>
                        <strong>Coincidencias en el mensaje</strong>
                        <p>{report.result.matches.join(" · ")}</p>
                      </div>
                    </div>
                  )}
                  {report.result.unknownLog && (
                    <div className="warning">
                      <TriangleAlert size={18} /> El texto no coincide con los
                      códigos del catálogo. Conserva el mensaje completo y
                      consulta el soporte del producto.
                    </div>
                  )}
                  {!report.result.findings.length && (
                    <p className="empty-search">
                      Esto no confirma que el equipo esté sano. Añade síntomas,
                      comprueba el código o consulta a un técnico.
                    </p>
                  )}
                  {report.os === "Windows 10" && (
                    <div className="warning">
                      Comprueba la cobertura de soporte y actualizaciones de tu
                      edición de Windows 10 en el sitio oficial de Microsoft.
                    </div>
                  )}
                  {report.result.findings.map((f, index) => (
                    <article className="finding" key={f.id}>
                      <div className="finding-title">
                        <span className="finding-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3>{f.title}</h3>
                        <span
                          className={`priority ${f.level === "Urgente" ? "urgent" : f.level === "Prioritaria" ? "high" : ""}`}
                        >
                          {f.level}
                        </span>
                      </div>
                      <p>{f.explanation}</p>
                      <div className="evidence">
                        Señales:{" "}
                        {f.evidence
                          .map((id) => symptoms.find((s) => s.id === id)?.label)
                          .join(" · ")}
                      </div>
                      <div className="action-list">
                        {f.steps.map((s, i) => {
                          const id = `${f.id}-${i}`;
                          return (
                            <label
                              key={id}
                              className={
                                checked.includes(id) ? "completed" : ""
                              }
                            >
                              <input
                                type="checkbox"
                                checked={checked.includes(id)}
                                onChange={() =>
                                  setChecked((prev) =>
                                    prev.includes(id)
                                      ? prev.filter((v) => v !== id)
                                      : [...prev, id],
                                  )
                                }
                              />
                              <span>{s}</span>
                            </label>
                          );
                        })}
                      </div>
                    </article>
                  ))}
                  <div className="report-sources">
                    <h3>Documentación para continuar</h3>
                    {sources
                      .filter((s) => report.os.startsWith(s.os))
                      .map((s) => (
                        <a
                          key={s.url}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {s.name}
                          <ArrowUpRight size={15} />
                        </a>
                      ))}
                  </div>
                </section>
              )}
            </>
          )}
          {view === "history" && (
            <section className="panel history-panel">
              {history.length ? (
                <>
                  <div className="panel-heading">
                    <h2>
                      {history.length}{" "}
                      {history.length === 1
                        ? "informe guardado"
                        : "informes guardados"}
                    </h2>
                    <button
                      className="text-button"
                      onClick={() => {
                        if (persist([])) setNotice("Historial eliminado.");
                      }}
                    >
                      <Trash2 size={16} /> Eliminar historial
                    </button>
                  </div>
                  {history.map((r) => (
                    <article className="history-row" key={r.id}>
                      <span className="overview-icon">
                        <FileText size={21} />
                      </span>
                      <div>
                        <strong>
                          {r.device} · {r.os}
                        </strong>
                        <p>
                          {new Date(r.date).toLocaleString("es-CO")} ·{" "}
                          {r.result.findings.length} áreas para revisar
                        </p>
                      </div>
                      <button
                        className="button secondary"
                        onClick={() => {
                          setOs(r.os);
                          setDevice(r.device);
                          setSelected(r.selected);
                          setLog(r.log);
                          setReport(r);
                          setChecked([]);
                          setView("diagnostic");
                        }}
                      >
                        Ver informe <ArrowRight size={15} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label={`Eliminar informe del ${new Date(r.date).toLocaleString("es-CO")}`}
                        onClick={() =>
                          persist(history.filter((item) => item.id !== r.id))
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </article>
                  ))}
                </>
              ) : (
                <div className="empty-state">
                  <History size={38} />
                  <h2>Tu próximo diagnóstico empieza aquí.</h2>
                  <p>
                    Analiza un problema y pulsa Guardar para conservar el
                    informe localmente.
                  </p>
                  <button className="button primary" onClick={reset}>
                    Crear diagnóstico <ArrowRight size={16} />
                  </button>
                </div>
              )}
              <p className="input-note">
                Se conservan hasta 20 informes. Guardar incluye el texto
                aportado. Puedes eliminarlo aquí o borrar los datos del
                navegador.
              </p>
            </section>
          )}
          {view === "library" && (
            <section className="panel library">
              <div className="panel-heading">
                <h2>Fuentes oficiales</h2>
                <span className="subtle">
                  Revisadas el 2 de octubre de 2026
                </span>
              </div>
              <p>
                El catálogo es revisable y no se actualiza automáticamente. Para
                instrucciones recientes y específicas de tu versión, abre la
                documentación del fabricante.
              </p>
              <div className="library-grid">
                {sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                    <span className="tag">{s.os}</span>
                    <h3>{s.name.split(" · ")[1]}</h3>
                    <span>
                      Consultar documentación <ArrowUpRight size={16} />
                    </span>
                  </a>
                ))}
              </div>
              <div className="scope-note">
                <Cpu size={20} />
                <p>
                  SSD/NVMe, memoria, refrigeración, controladores, redes y
                  sistemas modernos. Las comprobaciones dependen del fabricante,
                  modelo y distribución.
                </p>
              </div>
            </section>
          )}
          <footer className="main-footer">
            <span>Tech-Scan · Una mejor forma de resolver.</span>
            <span>
              Catálogo revisado <time dateTime={reviewed}>02 oct 2026</time>
              <span className="footer-dot">·</span>
              <button onClick={() => setHelp(true)}>
                Acerca del diagnóstico
              </button>
            </span>
          </footer>
        </main>
      </div>
      {help && (
        <dialog
          ref={helpRef}
          className="help-modal"
          aria-labelledby="help-title"
          onCancel={() => setHelp(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setHelp(false);
          }}
        >
          <div className="help-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              className="dialog-close icon-button"
              aria-label="Cerrar ayuda"
              autoFocus
              onClick={() => setHelp(false)}
            >
              <X size={20} />
            </button>
            <ShieldCheck size={30} />
            <h2 id="help-title">Una guía para comprobar, paso a paso.</h2>
            <p>
              Tech-Scan relaciona tus síntomas y códigos reconocidos con
              posibles causas. No tiene acceso a sensores, archivos ni
              componentes del equipo y no confirma fallas.
            </p>
            <p>
              Las señales urgentes se muestran primero. Después aparecen las
              áreas prioritarias y las de revisión, ordenadas por cantidad de
              coincidencias.
            </p>
            <p>
              El análisis no envía datos. Los informes solo se guardan si pulsas
              Guardar, en este navegador. Descargarlos incluye el mensaje de
              error aportado.
            </p>
            <button className="button primary" onClick={() => setHelp(false)}>
              Entendido <Check size={16} />
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
