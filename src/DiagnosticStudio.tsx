import { useEffect, useRef, useState, useTransition } from "react";
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Cpu,
  FileText,
  History,
  Laptop,
  Monitor,
  ScanLine,
  ShieldCheck,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import {
  analyze,
  reportText,
  reviewed,
  sources,
  type OS,
  type Report,
} from "./diagnostics";
import { loadHistory, storageKey } from "./storage";
import { Button, ChoiceGroup, Modal, Pill } from "./components/ui";
import Scanner from "./components/Scanner";
import SymptomPicker from "./components/SymptomPicker";
import ReportView from "./components/ReportView";
import "./styles.css";

const devices = [
  {
    value: "Portátil",
    label: "Portátil",
    description: "Ligero. Siempre contigo.",
    icon: Laptop,
  },
  {
    value: "Computador de escritorio",
    label: "Escritorio",
    description: "Tu estación de trabajo.",
    icon: Monitor,
  },
  {
    value: "Mini PC / estación de trabajo",
    label: "Mini PC / workstation",
    description: "Compacto o de alto desempeño.",
    icon: Cpu,
  },
];
const systems = [
  { value: "Windows 11", label: "Windows 11", icon: Monitor },
  { value: "Windows 10", label: "Windows 10", icon: Monitor },
  { value: "macOS", label: "macOS", icon: Apple },
  { value: "Linux", label: "Linux", icon: Terminal },
];
const stageNames = ["Tu equipo", "Las señales", "El contexto"];
type Panel = "history" | "sources" | "help" | null;

export default function App() {
  const [step, setStep] = useState(0);
  const [os, setOs] = useState<OS>("Windows 11");
  const [device, setDevice] = useState("Portátil");
  const [selected, setSelected] = useState<string[]>([]);
  const [log, setLog] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<Report[]>(loadHistory);
  const [panel, setPanel] = useState<Panel>(null);
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();
  const workbench = useRef<HTMLDivElement>(null);
  const previousFlow = useRef("0:");
  const valid = selected.length > 0 || !!log.trim();
  useEffect(() => {
    const currentFlow = `${step}:${report?.id ?? ""}`;
    if (previousFlow.current === currentFlow) return;
    previousFlow.current = currentFlow;
    workbench.current?.focus({ preventScroll: true });
    workbench.current?.scrollIntoView({
      block: "start",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [step, report?.id]);
  function reset() {
    setStep(0);
    setSelected([]);
    setLog("");
    setReport(null);
    setNotice("");
    setPanel(null);
  }
  function changeOS(value: string) {
    setOs(value as OS);
    if (!value.startsWith("Windows"))
      setSelected((prev) => prev.filter((id) => id !== "bsod"));
  }
  function diagnose() {
    if (!valid) return;
    startTransition(() =>
      setReport({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        os,
        device,
        selected: [...selected],
        log,
        result: analyze(selected, log, os),
      }),
    );
    setNotice("");
  }
  function persist(next: Report[]) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setHistory(next);
      setNotice("");
      return true;
    } catch {
      setNotice(
        "No se pudo guardar en este navegador. Descarga el informe para conservarlo.",
      );
      return false;
    }
  }
  function save() {
    if (
      report &&
      persist(
        [report, ...history.filter((r) => r.id !== report.id)].slice(0, 20),
      )
    )
      setNotice("Informe guardado en este navegador.");
  }
  function download() {
    if (!report) return;
    const url = URL.createObjectURL(
      new Blob([reportText(report)], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `tech-scan-${new Date(report.date).toLocaleDateString("sv-SE")}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function openReport(saved: Report) {
    setOs(saved.os);
    setDevice(saved.device);
    setSelected(saved.selected);
    setLog(saved.log);
    setReport(saved);
    setPanel(null);
    setNotice("");
  }
  return (
    <main className="studio" id="main">
      <a
        className="skip-link"
        href="#workbench"
        onClick={(event) => {
          event.preventDefault();
          workbench.current?.focus();
          workbench.current?.scrollIntoView({
            block: "start",
            behavior: "instant",
          });
        }}
      >
        Ir al diagnóstico
      </a>
      <div className="identity">
        <a href="./" aria-label="Tech-Scan, inicio">
          <img
            src={`${import.meta.env.BASE_URL}brand/tech-scan-isologo.png`}
            alt="Tech-Scan"
            width="2172"
            height="724"
          />
        </a>
      </div>
      <section className="studio-intro" aria-label="Estudio de diagnóstico">
        <div className="intro-copy">
          <div className="eyebrow">
            <span className="live-dot" /> DIAGNÓSTICO TÉCNICO, SIN RUIDO.
          </div>
          <h1>
            Menos dudas.
            <br />
            <span>Más soluciones.</span>
          </h1>
          <p className="intro-description">
            Tu equipo tiene algo que decir.
            <br />
            Conecta las señales y encuentra el siguiente paso.
          </p>
          <div className="intro-tools">
            <Button variant="quiet" onClick={() => setPanel("history")}>
              <History size={16} />
              Mis informes<span className="tool-count">{history.length}</span>
            </Button>
            <span className="tool-divider" />
            <Button variant="quiet" onClick={() => setPanel("sources")}>
              <BookOpen size={16} />
              Guías oficiales
              <ArrowUpRight size={14} />
            </Button>
          </div>
          <div className="intro-footnote">
            <ShieldCheck size={14} />
            <span>Local. Privado. Sin instalar nada.</span>
          </div>
        </div>
        <Scanner count={selected.length} />
      </section>
      <div
        className="workbench"
        id="workbench"
        ref={workbench}
        tabIndex={-1}
        aria-label={
          report
            ? "Informe de diagnóstico"
            : `Paso ${step + 1}: ${stageNames[step]}`
        }
      >
        <div className="workbench-caption">
          <span>
            <ScanLine size={14} />{" "}
            {report ? "DIAGNÓSTICO / RESULTADO" : "DIAGNÓSTICO / NUEVA SESIÓN"}
          </span>
          <span>
            TS—03 <span className="caption-dot">●</span> MOTOR LOCAL
          </span>
        </div>
        {notice && (
          <div className="notice" role="status">
            <Check size={17} />
            <span>{notice}</span>
            <button
              className="icon-button"
              aria-label="Cerrar aviso"
              onClick={() => setNotice("")}
            >
              <X size={17} />
            </button>
          </div>
        )}
        {report ? (
          <ReportView
            key={report.id}
            report={report}
            onSave={save}
            onDownload={download}
            onEdit={() => {
              setReport(null);
              setStep(1);
              setNotice("");
            }}
            onReset={reset}
          />
        ) : (
          <>
            <div className="step-track" aria-label="Progreso del diagnóstico">
              {stageNames.map((name, i) => (
                <button
                  key={name}
                  className={`stage ${i === step ? "stage-active" : ""} ${i < step ? "stage-done" : ""}`}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => setStep(i)}
                >
                  <span className="stage-index">
                    {i < step ? (
                      <Check size={13} />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <span>{name}</span>
                  {i === step && <span className="stage-indicator" />}
                </button>
              ))}
            </div>
            <div className="stage-content" key={step}>
              <div className="stage-heading">
                <div>
                  <span className="eyebrow">
                    {step === 0
                      ? "EL PUNTO DE PARTIDA"
                      : step === 1
                        ? "CADA DETALLE CUENTA"
                        : "UNA PISTA MÁS"}
                  </span>
                  <h2>
                    {step === 0
                      ? "Empecemos por tu equipo."
                      : step === 1
                        ? "¿Qué está ocurriendo?"
                        : "Dale contexto al diagnóstico."}
                  </h2>
                  <p>
                    {step === 0
                      ? "Elige el dispositivo y su sistema operativo."
                      : step === 1
                        ? "Marca todas las señales que has observado."
                        : "Un código o un mensaje puede ayudarnos a conectar las señales."}
                  </p>
                </div>
                <span className="stage-fraction">
                  0{step + 1}
                  <small>/03</small>
                </span>
              </div>
              {step === 0 && (
                <div className="equipment-step">
                  <div className="field-caption">
                    <span>01 / DISPOSITIVO</span>
                    <span>Elige uno</span>
                  </div>
                  <ChoiceGroup
                    value={device}
                    onChange={setDevice}
                    options={devices}
                    label="Tipo de equipo"
                  />
                  <div className="field-caption os-caption">
                    <span>02 / SISTEMA OPERATIVO</span>
                    <span>Selecciona tu versión</span>
                  </div>
                  <ChoiceGroup
                    value={os}
                    onChange={changeOS}
                    options={systems}
                    label="Sistema operativo"
                    className="os-group"
                  />
                </div>
              )}
              {step === 1 && (
                <SymptomPicker
                  selected={selected}
                  onChange={setSelected}
                  os={os}
                />
              )}
              {step === 2 && (
                <div className="context-step">
                  <div className="terminal-editor">
                    <div className="terminal-bar">
                      <span className="terminal-lights">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span>MENSAJE O REGISTRO</span>
                      <span>OPCIONAL</span>
                    </div>
                    <div className="terminal-body">
                      <span className="terminal-prompt">›</span>
                      <textarea
                        value={log}
                        onChange={(e) => setLog(e.target.value)}
                        maxLength={20000}
                        aria-label="Mensaje de error o registro"
                        placeholder={
                          "Pega aquí el fragmento relevante del error…\n\nMEMORY_MANAGEMENT\nERR_NAME_NOT_RESOLVED\nI/O error"
                        }
                      />
                    </div>
                    <div className="terminal-footer">
                      <span>
                        <ShieldCheck size={12} />
                        Solo se analiza en este navegador
                      </span>
                      <span>{log.length.toLocaleString("es")} / 20.000</span>
                    </div>
                  </div>
                  <div className="example-codes">
                    <span>Prueba con un ejemplo:</span>
                    {(os.startsWith("Windows")
                      ? [
                          "MEMORY_MANAGEMENT",
                          "ERR_NAME_NOT_RESOLVED",
                          "0x800f081f",
                        ]
                      : ["ERR_NAME_NOT_RESOLVED", "I/O error", "ENOSPC"]
                    ).map((code) => (
                      <button key={code} onClick={() => setLog(code)}>
                        {code}
                        <ArrowUpRight size={12} />
                      </button>
                    ))}
                  </div>
                  <div className="session-summary">
                    <span className="summary-title">TU SESIÓN</span>
                    <Pill>{device}</Pill>
                    <Pill>{os}</Pill>
                    <Pill>{selected.length} síntomas</Pill>
                  </div>
                  <p className="privacy-note">
                    Elimina contraseñas, claves y datos personales antes de
                    guardar o compartir el informe. Tech-Scan orienta a partir
                    de tus señales; no mide el hardware.
                  </p>
                </div>
              )}
            </div>
            <div className="workbench-footer">
              <div className="footer-context">
                {step === 0 ? (
                  <>
                    <span className="live-dot" /> Listo para empezar
                  </>
                ) : (
                  <>
                    <span className="selection-dot" />
                    {selected.length} señales seleccionadas
                    <span className="footer-slash">/</span>
                    {os}
                  </>
                )}
              </div>
              <div className="step-actions">
                {step > 0 && (
                  <Button variant="quiet" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={16} />
                    Atrás
                  </Button>
                )}
                {step < 2 ? (
                  <Button onClick={() => setStep(step + 1)}>
                    Continuar
                    <ArrowRight size={18} />
                  </Button>
                ) : (
                  <Button onClick={diagnose} disabled={!valid || pending}>
                    {pending ? "Preparando informe…" : "Conectar las señales"}
                    <ScanLine size={18} />
                  </Button>
                )}
              </div>
              {step === 2 && !valid && (
                <p className="validation-note">
                  Selecciona un síntoma o escribe un error para analizar.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <div className="studio-bottom">
        <div className="bottom-mark">
          <span>TS</span>
          <p>
            Diagnóstico orientativo.
            <br />
            <strong>Decisiones mejor informadas.</strong>
          </p>
        </div>
        <div className="bottom-tools">
          <span className="mono">
            CATÁLOGO <time dateTime={reviewed}>02 OCT 2026</time>
          </span>
          <button onClick={() => setPanel("help")}>
            <CircleHelp size={15} />
            Cómo funciona
          </button>
        </div>
      </div>
      <Modal
        open={panel === "history"}
        onOpenChange={(open) => {
          if (!open) setPanel(null);
        }}
        title="Tu archivo de diagnósticos."
        description="Informes que guardaste en este navegador. Hasta 20 sesiones."
        wide
      >
        {history.length ? (
          <div className="history-list">
            {history.map((saved) => (
              <article key={saved.id} className="history-item">
                <FileText size={23} />
                <div>
                  <strong>{saved.device}</strong>
                  <p>
                    {saved.os} · {new Date(saved.date).toLocaleString("es-CO")}
                  </p>
                  <small>
                    {saved.result.findings.length}{" "}
                    {saved.result.findings.length === 1 ? "área" : "áreas"} para
                    revisar
                  </small>
                </div>
                <Button variant="quiet" onClick={() => openReport(saved)}>
                  Abrir
                  <ChevronRight size={15} />
                </Button>
                <button
                  className="icon-button"
                  aria-label={`Eliminar informe ${saved.id}`}
                  onClick={() =>
                    persist(history.filter((r) => r.id !== saved.id))
                  }
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <History size={34} />
            <h3>Un espacio para tus próximos pasos.</h3>
            <p>
              Analiza un problema y guarda el informe para encontrarlo aquí.
            </p>
            <Button onClick={() => setPanel(null)}>
              Crear diagnóstico
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
        <p className="modal-note">
          Guardar incluye el mensaje aportado. Los informes no se sincronizan ni
          se cifran; puedes eliminarlos en cualquier momento.
        </p>
      </Modal>
      <Modal
        open={panel === "sources"}
        onOpenChange={(open) => {
          if (!open) setPanel(null);
        }}
        title="La fuente importa."
        description="Documentación oficial para comprobar cada paso."
        wide
      >
        <div className="source-grid">
          {sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              <span className="source-platform">{source.os}</span>
              <h3>{source.name.split(" · ")[1]}</h3>
              <span>
                Consultar guía
                <ArrowUpRight size={16} />
              </span>
            </a>
          ))}
        </div>
        <p className="modal-note">
          Catálogo revisado el 2 de octubre de 2026. No se actualiza
          automáticamente. Consulta las instrucciones de tu fabricante y
          versión.
        </p>
      </Modal>
      <Modal
        open={panel === "help"}
        onOpenChange={(open) => {
          if (!open) setPanel(null);
        }}
        title="Conecta. Comprueba. Resuelve."
        description="Una guía técnica a partir de lo que observas."
      >
        <div className="help-steps">
          {[
            {
              title: "Configura",
              text: "El equipo y el sistema adaptan las recomendaciones.",
            },
            {
              title: "Describe",
              text: "Elige síntomas y aporta un error si lo tienes.",
            },
            {
              title: "Comprueba",
              text: "Revisa las posibles causas con acciones y fuentes oficiales.",
            },
          ].map((s, i) => (
            <div key={s.title}>
              <span>0{i + 1}</span>
              <p>
                <strong>{s.title}</strong>
                {s.text}
              </p>
            </div>
          ))}
        </div>
        <p className="modal-note">
          No accedemos a sensores ni archivos, no ejecutamos comandos y no
          confirmamos fallas físicas. La animación es una representación visual.
          Solo se guardan informes cuando tú lo decides.
        </p>
        <Button onClick={() => setPanel(null)}>
          Entendido
          <Check size={16} />
        </Button>
      </Modal>
    </main>
  );
}
