import { useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Fingerprint,
  ScanLine,
  ShieldCheck,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";
import { analyze } from "./diagnostics";
import Scanner from "./components/Scanner";
import "./landing.css";
const cases = [
  {
    id: "network",
    label: "Sin conexión",
    icon: Wifi,
    signal: "dns",
    code: "ERR_NAME_NOT_RESOLVED",
  },
  { id: "performance", label: "Lentitud", icon: Zap, signal: "slow", code: "" },
  {
    id: "system",
    label: "Pantalla azul",
    icon: Terminal,
    signal: "bsod",
    code: "MEMORY_MANAGEMENT",
  },
];
const logo = `${import.meta.env.BASE_URL}brand/tech-scan-isologo.png`;
export default function Landing() {
  const [active, setActive] = useState("network");
  const current = cases.find((c) => c.id === active)!;
  const result = analyze([current.signal], current.code, "Windows 11");
  const first = result.findings[0];
  return (
    <main className="landing">
      <a className="skip-link" href="#como-funciona">
        Ir a cómo funciona
      </a>
      <div className="landing-identity">
        <img src={logo} alt="Tech-Scan" width="2172" height="724" />
        <span>SEÑALES CLARAS. MEJORES DECISIONES.</span>
      </div>
      <section className="landing-hero" aria-label="Presentación de Tech-Scan">
        <div className="landing-hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> TU EQUIPO TIENE ALGO QUE DECIR.
          </div>
          <h1>
            Encuentra la falla.
            <br />
            <span>Entiende el camino.</span>
          </h1>
          <p>
            Antes de cambiar piezas, conecta las señales.
            <br />
            Convierte síntomas y códigos de error en un plan de acción que
            puedas comprobar.
          </p>
          <div className="hero-actions">
            <a className="button button-solid" href="#diagnostico">
              Abrir diagnóstico
              <ArrowRight size={19} />
            </a>
            <a className="landing-text-link" href="#como-funciona">
              Así funciona
              <ChevronRight size={16} />
            </a>
          </div>
          <div className="landing-trust">
            <ShieldCheck size={15} />
            <span>Sin registro</span>
            <i />
            <span>Sin instalaciones</span>
            <i />
            <span>Análisis local</span>
          </div>
        </div>
        <div className="hero-instrument">
          <Scanner count={0} />
          <div className="case-preview">
            <div className="case-preview-label">
              <span>UNA SEÑAL, UN SIGUIENTE PASO.</span>
              <span>EJEMPLO</span>
            </div>
            <ToggleGroup.Root
              type="single"
              value={active}
              onValueChange={(v) => {
                if (v) setActive(v);
              }}
              aria-label="Explorar casos de ejemplo"
              className="case-switch"
            >
              {cases.map(({ id, label, icon: Icon }) => (
                <ToggleGroup.Item value={id} key={id} aria-label={label}>
                  <Icon size={13} />
                  {label}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
            <div className="case-result" key={current.id}>
              <span className="case-error">
                <Terminal size={12} />
                {current.code || "SÍNTOMA: EQUIPO LENTO"}
              </span>
              <h2>{first.title}</h2>
              <p>{first.steps[0]}</p>
              <span className="case-priority">
                <span className="live-dot" /> POSIBLE CAUSA · POR COMPROBAR
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="platform-strip">
        <span className="mono">UN PROCESO. DISTINTOS SISTEMAS.</span>
        <span>Windows 11</span>
        <b>+</b>
        <span>Windows 10</span>
        <b>+</b>
        <span>macOS</span>
        <b>+</b>
        <span>Linux</span>
      </div>
      <section className="landing-process" id="como-funciona">
        <div className="landing-section-heading">
          <div>
            <span className="eyebrow">DEL PROBLEMA A LA PRÓXIMA ACCIÓN</span>
            <h2>
              No necesitas adivinar.
              <br />
              <span>Necesitas un punto de partida.</span>
            </h2>
          </div>
          <p>
            Tres pasos para organizar lo que observas
            <br />y decidir qué comprobar primero.
          </p>
        </div>
        <div className="process-grid">
          {[
            {
              title: "Ubica tu equipo.",
              text: "El dispositivo y el sistema operativo dan contexto a las recomendaciones.",
              icon: ScanLine,
            },
            {
              title: "Conecta las señales.",
              text: "Combina síntomas, pega un código o añade el fragmento relevante del error.",
              icon: Terminal,
            },
            {
              title: "Avanza con criterio.",
              text: "Explora posibles causas, marca cada comprobación y conserva tu informe.",
              icon: ArrowUpRight,
            },
          ].map((item, i) => (
            <article key={item.title}>
              <div className="process-number">
                <span>0{i + 1}</span>
                <item.icon size={22} strokeWidth={1.3} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-product">
        <div className="product-copy">
          <span className="eyebrow">TU ESTUDIO DE DIAGNÓSTICO</span>
          <h2>
            Un problema complejo.
            <br />
            <span>Un proceso claro.</span>
          </h2>
          <p>
            Hardware, rendimiento, sistema y conectividad. Todo en una sesión
            guiada, con recomendaciones adaptadas y fuentes para continuar.
          </p>
          <ul>
            <li>
              <Check size={15} />
              20 síntomas combinables
            </li>
            <li>
              <Check size={15} />
              Códigos reconocidos y mensajes sin coincidencia
            </li>
            <li>
              <Check size={15} />
              Informe descargable e historial local
            </li>
          </ul>
          <a className="landing-text-link" href="#diagnostico">
            Entrar al estudio
            <ArrowRight size={17} />
          </a>
        </div>
        <div className="product-frame">
          <div className="product-frame-bar">
            <span>
              <i />
              <i />
              <i />
            </span>
            <span>TECH-SCAN / DIAGNÓSTICO</span>
            <ScanLine size={12} />
          </div>
          <img
            src={`${import.meta.env.BASE_URL}media/studio-preview.jpg`}
            alt="Interfaz real del estudio Tech-Scan, con selección visual de equipo y sistema operativo"
            loading="lazy"
            width="1152"
            height="600"
          />
        </div>
      </section>
      <section className="landing-principles">
        <article>
          <Fingerprint size={24} strokeWidth={1.3} />
          <h3>Tus datos se quedan contigo.</h3>
          <p>
            Los síntomas y mensajes se procesan en el navegador. Tú decides si
            guardas o descargas el informe.
          </p>
        </article>
        <article>
          <BookOpen size={24} strokeWidth={1.3} />
          <h3>Fuentes, no promesas.</h3>
          <p>
            Guías oficiales de Microsoft, Apple y Ubuntu. Posibles causas que
            puedes comprobar, sin diagnósticos definitivos inventados.
          </p>
        </article>
      </section>
      <section className="landing-final">
        <div>
          <span className="eyebrow">EL SIGUIENTE PASO EMPIEZA AQUÍ.</span>
          <h2>
            Menos dudas.<span> Más soluciones.</span>
          </h2>
        </div>
        <a href="#diagnostico" className="button button-solid">
          Empezar mi diagnóstico
          <ArrowRight size={19} />
        </a>
      </section>
      <footer className="landing-footer">
        <img src={logo} alt="Tech-Scan" width="2172" height="724" />
        <p>
          Orientación a partir de tus señales. No mide el hardware
          <br />
          ni ejecuta reparaciones. Catálogo revisado: 02 oct 2026.
        </p>
        <a
          href="https://github.com/AnalizaJech/Tech-Scan"
          target="_blank"
          rel="noreferrer"
        >
          El proyecto
          <ArrowUpRight size={14} />
        </a>
      </footer>
    </main>
  );
}
