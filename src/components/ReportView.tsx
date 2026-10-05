import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  RotateCcw,
  Terminal,
  TriangleAlert,
} from "lucide-react";
import { sources, symptoms, type Report } from "../diagnostics";
import { Button, Pill } from "./ui";
export default function ReportView({
  report,
  onSave,
  onDownload,
  onEdit,
  onReset,
}: {
  report: Report;
  onSave: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onReset: () => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const total = report.result.findings.reduce((n, f) => n + f.steps.length, 0);
  return (
    <section className="report-view" aria-label="Resultado del diagnóstico">
      <div className="report-heading">
        <div>
          <span className="eyebrow">TU PLAN DE ACCIÓN / {report.os}</span>
          <h2 tabIndex={-1} id="report-heading">
            {report.result.findings.length
              ? `${report.result.findings.length} ${report.result.findings.length === 1 ? "área" : "áreas"} para revisar.`
              : "Sin coincidencias conocidas."}
          </h2>
          <p>
            {report.device} · {new Date(report.date).toLocaleString("es-CO")}
          </p>
        </div>
        <span className="report-seal">
          <Check size={25} />
          <small>
            ANÁLISIS
            <br />
            COMPLETADO
          </small>
        </span>
      </div>
      <div className="report-toolbar">
        <div className="report-actions">
          <Button variant="outline" onClick={onEdit}>
            <RotateCcw size={16} />
            Editar señales
          </Button>
          <Button variant="outline" onClick={onSave}>
            <Bookmark size={16} />
            Guardar informe
          </Button>
          <Button onClick={onDownload}>
            <ArrowDownToLine size={16} />
            Descargar
          </Button>
        </div>
        <span className="mono">
          {checked.length}/{total} PASOS REVISADOS
        </span>
      </div>
      <p className="report-disclaimer">
        Las causas son orientativas. La prioridad indica qué revisar primero, no
        la probabilidad de una falla.
      </p>
      {report.result.matches.length > 0 && (
        <div className="code-match">
          <Terminal size={19} />
          <div>
            <strong>Códigos reconocidos</strong>
            <p>{report.result.matches.join(" · ")}</p>
          </div>
        </div>
      )}
      {report.result.unknownLog && (
        <div className="warning">
          <TriangleAlert size={18} />
          <p>
            El mensaje no coincide con el catálogo. Conserva el error completo y
            consulta el soporte del producto.
          </p>
        </div>
      )}
      {!report.result.findings.length && (
        <p className="no-findings">
          Esto no confirma que tu equipo esté sano. Añade síntomas o consulta a
          un técnico con el mensaje completo.
        </p>
      )}
      {report.os === "Windows 10" && (
        <div className="warning">
          <TriangleAlert size={18} />
          <p>
            Comprueba la cobertura de soporte y actualizaciones de tu edición de
            Windows 10 en Microsoft.
          </p>
        </div>
      )}
      <div className="findings">
        {report.result.findings.map((f, i) => (
          <article
            className={`finding ${f.level === "Urgente" ? "finding-urgent" : ""}`}
            key={f.id}
          >
            <div className="finding-number">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="finding-content">
              <div className="finding-heading">
                <h3>{f.title}</h3>
                <span className={`severity severity-${f.level}`}>
                  {f.level}
                </span>
              </div>
              <p>{f.explanation}</p>
              <div className="evidence-label">
                {f.evidence.map((id) => (
                  <Pill key={id}>
                    {symptoms.find((s) => s.id === id)?.label}
                  </Pill>
                ))}
              </div>
              <div className="action-list">
                {f.steps.map((s, j) => {
                  const id = `${f.id}-${j}`;
                  const done = checked.includes(id);
                  return (
                    <button
                      key={id}
                      className={done ? "action-step completed" : "action-step"}
                      aria-pressed={done}
                      onClick={() =>
                        setChecked((prev) =>
                          done ? prev.filter((v) => v !== id) : [...prev, id],
                        )
                      }
                    >
                      <span className="action-check">
                        <Check size={13} />
                      </span>
                      <span>{s}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="report-sources">
        <h3>Continúa con documentación oficial</h3>
        {sources
          .filter((s) => report.os.startsWith(s.os))
          .map((s) => (
            <a href={s.url} key={s.url} target="_blank" rel="noreferrer">
              {s.name}
              <ArrowUpRight size={15} />
            </a>
          ))}
      </div>
      <div className="report-bottom">
        <p>
          Comprueba una causa a la vez.
          <br />
          <strong>Un paso claro hace la diferencia.</strong>
        </p>
        <Button variant="quiet" onClick={onReset}>
          Empezar otro diagnóstico <ArrowRight size={17} />
        </Button>
      </div>
    </section>
  );
}
