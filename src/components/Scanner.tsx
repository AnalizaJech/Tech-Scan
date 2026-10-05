import { Cpu, Crosshair, ScanLine } from "lucide-react";
export default function Scanner({ count }: { count: number }) {
  return (
    <div className="scanner" aria-hidden="true">
      <div className="scanner-grid" />
      <div className="scanner-label">
        <span>TECH-SCAN / STUDIO</span>
        <Crosshair size={16} />
      </div>
      <div className="orbit orbit-outer" />
      <div className="orbit orbit-middle" />
      <div className="orbit orbit-inner" />
      <div className="orbit-ticks" />
      <div className="scanner-sweep" />
      <div className="chip">
        <i />
        <i />
        <i />
        <i />
        <Cpu strokeWidth={0.85} size={86} />
        <span>TS / CORE</span>
      </div>
      <span className="orbit-point point-one" />
      <span className="orbit-point point-two" />
      <span className="orbit-point point-three" />
      <div className="scan-readout">
        <ScanLine size={17} />
        <span>
          {count
            ? `${String(count).padStart(2, "0")} SEÑALES SELECCIONADAS`
            : "ESPERANDO TUS SÍNTOMAS"}
        </span>
        <span className="readout-dot" />
      </div>
      <div className="scan-coordinate">
        SYS / READY <span>ORIENTACIÓN LOCAL</span>
      </div>
    </div>
  );
}
