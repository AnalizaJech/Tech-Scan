import { useEffect, useState } from "react";
import DiagnosticStudio from "./DiagnosticStudio";
import Landing from "./Landing";
export default function App() {
  const [diagnostic, setDiagnostic] = useState(
    location.hash === "#diagnostico",
  );
  useEffect(() => {
    const sync = () => setDiagnostic(location.hash === "#diagnostico");
    addEventListener("hashchange", sync);
    return () => removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    document.title = diagnostic
      ? "Tech-Scan · Estudio de diagnóstico"
      : "Tech-Scan · Menos dudas. Más soluciones.";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [diagnostic]);
  return diagnostic ? <DiagnosticStudio /> : <Landing />;
}
