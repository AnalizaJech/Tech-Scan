import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Check, Search, X } from "lucide-react";
import { symptoms, type OS, type Category } from "../diagnostics";
import { useState } from "react";
export default function SymptomPicker({
  selected,
  onChange,
  os,
}: {
  selected: string[];
  onChange: (selected: string[]) => void;
  os: OS;
}) {
  const [category, setCategory] = useState<Category>("Todos");
  const [query, setQuery] = useState("");
  const visible = symptoms.filter(
    (s) =>
      (!s.windows || os.startsWith("Windows")) &&
      (category === "Todos" || category === s.category) &&
      `${s.label} ${s.detail}`
        .toLocaleLowerCase("es")
        .includes(query.toLocaleLowerCase("es")),
  );
  return (
    <>
      <div className="symptom-tools">
        <ToggleGroup.Root
          type="single"
          value={category}
          onValueChange={(v) => {
            if (v) setCategory(v as Category);
          }}
          aria-label="Filtrar síntomas"
          className="category-switch"
        >
          {(
            [
              "Todos",
              "Sistema",
              "Rendimiento",
              "Hardware",
              "Conectividad",
            ] as Category[]
          ).map((c) => (
            <ToggleGroup.Item key={c} value={c} aria-label={c}>
              {c}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
        <label className="search-control">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar síntoma"
            aria-label="Buscar síntomas"
          />
          {query && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => setQuery("")}
            >
              <X size={15} />
            </button>
          )}
        </label>
      </div>
      <ToggleGroup.Root
        type="multiple"
        value={selected}
        onValueChange={onChange}
        aria-label="Síntomas observados"
        className="symptom-grid"
      >
        {visible.map((s) => (
          <ToggleGroup.Item
            key={s.id}
            value={s.id}
            className="symptom-choice"
            aria-label={s.label}
          >
            <span className="symptom-check">
              <Check size={14} />
            </span>
            <span>
              <strong>{s.label}</strong>
              <small>{s.detail}</small>
            </span>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
      {!visible.length && (
        <div className="empty-state small">
          <Search size={25} />
          <p>No hay coincidencias. Prueba otro término.</p>
        </div>
      )}
      <p className="picker-note">
        {selected.length
          ? `${selected.length} síntomas seleccionados. Puedes combinar distintas categorías.`
          : "Selecciona al menos un síntoma o continúa para aportar un código de error."}
      </p>
    </>
  );
}
