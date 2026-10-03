export type OS = "Windows 11" | "Windows 10" | "macOS" | "Linux";
export type Category =
  "Todos" | "Sistema" | "Rendimiento" | "Hardware" | "Conectividad";
export const reviewed = "2026-10-02";
export const symptoms: {
  id: string;
  label: string;
  detail: string;
  category: Category;
  windows?: boolean;
}[] = [
  {
    id: "slow",
    label: "El equipo está lento",
    detail: "Abrir programas o trabajar toma más tiempo.",
    category: "Rendimiento",
  },
  {
    id: "freeze",
    label: "Aplicaciones bloqueadas",
    detail: "La aplicación deja de responder o se cierra.",
    category: "Rendimiento",
  },
  {
    id: "startup",
    label: "Inicio demasiado lento",
    detail: "El sistema tarda en estar listo.",
    category: "Rendimiento",
  },
  {
    id: "space",
    label: "Poco espacio disponible",
    detail: "El almacenamiento está casi lleno.",
    category: "Rendimiento",
  },
  {
    id: "bsod",
    label: "Pantalla azul",
    detail: "Windows muestra un código de detención.",
    category: "Sistema",
    windows: true,
  },
  {
    id: "restart",
    label: "Reinicios inesperados",
    detail: "El equipo se reinicia sin solicitarlo.",
    category: "Sistema",
  },
  {
    id: "boot",
    label: "No inicia el sistema",
    detail: "Se queda en el logo o no encuentra el arranque.",
    category: "Sistema",
  },
  {
    id: "update",
    label: "Error de actualización",
    detail: "No se pueden instalar actualizaciones.",
    category: "Sistema",
  },
  {
    id: "corrupt",
    label: "Archivos dañados",
    detail: "Hay archivos que no se pueden abrir.",
    category: "Sistema",
  },
  {
    id: "heat",
    label: "Temperatura elevada",
    detail: "El equipo se calienta o se apaga bajo carga.",
    category: "Hardware",
  },
  {
    id: "noise",
    label: "Ruidos inusuales",
    detail: "Se escuchan clics, roces o ventiladores fuertes.",
    category: "Hardware",
  },
  {
    id: "disk",
    label: "Errores de lectura o escritura",
    detail: "Fallan las copias o desaparecen archivos.",
    category: "Hardware",
  },
  {
    id: "display",
    label: "Fallos de imagen",
    detail: "Pantalla negra, parpadeos o artefactos.",
    category: "Hardware",
  },
  {
    id: "beep",
    label: "Pitidos al encender",
    detail: "Hay una secuencia de pitidos o luces.",
    category: "Hardware",
  },
  {
    id: "power",
    label: "No enciende",
    detail: "No aparecen luces ni señal de encendido.",
    category: "Hardware",
  },
  {
    id: "electric",
    label: "Olor a quemado o chispas",
    detail: "También incluye batería hinchada o corto.",
    category: "Hardware",
  },
  {
    id: "wifi",
    label: "Wi-Fi sin conexión",
    detail: "No conecta o se desconecta con frecuencia.",
    category: "Conectividad",
  },
  {
    id: "dns",
    label: "Las páginas no cargan",
    detail: "Hay conexión, pero no se abren los sitios.",
    category: "Conectividad",
  },
  {
    id: "usb",
    label: "Periférico no reconocido",
    detail: "USB, cámara o Bluetooth no funcionan.",
    category: "Conectividad",
  },
  {
    id: "audio",
    label: "Sin sonido",
    detail: "La salida de audio no reproduce sonido.",
    category: "Conectividad",
  },
];
export const sources = [
  {
    name: "Microsoft · errores de detención",
    url: "https://support.microsoft.com/en-us/windows/resolving-blue-screen-errors-in-windows-60b01860-58f2-be66-7516-5c45a66ae3c6",
    os: "Windows",
  },
  {
    name: "Microsoft · reparación con DISM y SFC",
    url: "https://support.microsoft.com/en-au/windows/experience/backup-recovery/using-system-file-checker-in-windows",
    os: "Windows",
  },
  {
    name: "Apple · Diagnóstico Apple",
    url: "https://support.apple.com/en-ie/102550",
    os: "macOS",
  },
  {
    name: "Apple · Primeros Auxilios",
    url: "https://support.apple.com/en-gb/102611",
    os: "macOS",
  },
  {
    name: "Ubuntu · problemas de red",
    url: "https://help.ubuntu.com/stable/ubuntu-help/net-problem.html.en",
    os: "Linux",
  },
  {
    name: "Ubuntu · diagnóstico básico",
    url: "https://wiki.ubuntu.com/BasicTroubleshooting",
    os: "Linux",
  },
];
type Rule = {
  id: string;
  title: string;
  category: Category;
  signals: string[];
  level: "Revisar" | "Prioritaria" | "Urgente";
  explanation: string;
  steps: string[];
  platform?: Partial<Record<OS, string[]>>;
};
export const rules: Rule[] = [
  {
    id: "electrical",
    title: "Riesgo eléctrico o de batería",
    category: "Hardware",
    signals: ["electric"],
    level: "Urgente",
    explanation:
      "Estas señales requieren detener el uso. No intentes reproducir la falla.",
    steps: [
      "Desconecta el cargador si puedes hacerlo sin tocar partes calientes o dañadas.",
      "No vuelvas a encender, cargar, abrir ni presionar una batería hinchada.",
      "Solicita asistencia del fabricante o de un técnico. Ante humo o fuego, aléjate y contacta emergencias.",
    ],
  },
  {
    id: "storage",
    title: "Almacenamiento y sistema de archivos",
    category: "Hardware",
    signals: ["disk", "corrupt", "space", "noise"],
    level: "Prioritaria",
    explanation:
      "Las fallas de archivos pueden relacionarse con almacenamiento, falta de espacio o apagados. El ruido por sí solo no identifica un disco averiado.",
    steps: [
      "Si hay errores de lectura, copia primero los archivos importantes a otra unidad. Si hay clics persistentes o datos irremplazables, detén el uso y consulta recuperación profesional.",
      "Comprueba espacio libre y el estado de la unidad con la herramienta del fabricante. Un SSD/NVMe no tiene partes mecánicas: identifica de dónde procede el ruido.",
      "No formatees ni reemplaces la unidad antes de confirmar la falla.",
    ],
    platform: {
      "Windows 11": [
        "Revisa Configuración → Sistema → Almacenamiento. Evita reparaciones intensivas de disco antes del respaldo.",
      ],
      "Windows 10": [
        "Revisa Configuración → Sistema → Almacenamiento. Evita reparaciones intensivas de disco antes del respaldo.",
      ],
      macOS: [
        "Tras respaldar, usa Utilidad de Discos → Primeros Auxilios según la guía de Apple.",
      ],
      Linux: [
        "Revisa la unidad en Discos (si está instalado) y los mensajes de entrada/salida del registro. No ejecutes fsck sobre una partición montada.",
      ],
    },
  },
  {
    id: "thermal",
    title: "Refrigeración y temperatura",
    category: "Hardware",
    signals: ["heat", "noise", "restart"],
    level: "Prioritaria",
    explanation:
      "La temperatura y los apagados bajo carga pueden indicar ventilación insuficiente. Un reinicio aislado también puede tener otras causas.",
    steps: [
      "Si se calienta excesivamente, apaga el equipo y deja que se enfríe.",
      "Usa una superficie firme, despeja las rejillas y comprueba si el ventilador gira.",
      "Consulta los límites térmicos del modelo; no existe una temperatura máxima universal. Si persiste, pide revisión de refrigeración.",
    ],
  },
  {
    id: "stability",
    title: "Estabilidad, memoria y controladores",
    category: "Sistema",
    signals: ["bsod", "restart", "freeze", "beep"],
    level: "Revisar",
    explanation:
      "Los bloqueos no prueban una falla de RAM. Pueden intervenir controladores, software, memoria o energía.",
    steps: [
      "Anota el código exacto, la hora y qué cambió antes del primer fallo.",
      "Desconecta periféricos agregados recientemente y comprueba si la falla se repite.",
      "Obtén controladores del fabricante. Si hay pitidos, consulta la secuencia en el manual del modelo.",
    ],
    platform: {
      "Windows 11": [
        "Abre el Historial de confiabilidad y, si persiste, ejecuta Diagnóstico de memoria de Windows.",
      ],
      "Windows 10": [
        "Abre el Historial de confiabilidad y, si persiste, ejecuta Diagnóstico de memoria de Windows.",
      ],
      macOS: [
        "Usa Diagnóstico Apple siguiendo las instrucciones específicas para Apple silicon o Intel.",
      ],
      Linux: [
        "Consulta el registro del arranque con journalctl -b -p err. Una prueba de memoria requiere una herramienta compatible con tu equipo.",
      ],
    },
  },
  {
    id: "performance",
    title: "Carga de recursos y programas de inicio",
    category: "Rendimiento",
    signals: ["slow", "startup", "space", "freeze"],
    level: "Revisar",
    explanation:
      "Revisa el uso real de CPU, memoria y disco antes de comprar componentes o instalar optimizadores.",
    steps: [
      "Cierra aplicaciones que no necesitas y observa si mejora la respuesta.",
      "Revisa procesos y programas de inicio. Desactiva únicamente los que reconoces y no necesitas al arrancar.",
      "Libera espacio moviendo archivos respaldados; evita limpiadores de registro y descargas de procedencia desconocida.",
    ],
    platform: {
      "Windows 11": [
        "Usa Administrador de tareas → Procesos y Aplicaciones de inicio.",
      ],
      "Windows 10": ["Usa Administrador de tareas → Procesos e Inicio."],
      macOS: ["Usa Monitor de Actividad y revisa la presión de memoria."],
      Linux: [
        "Usa el monitor del sistema de tu distribución para observar CPU, memoria y disco.",
      ],
    },
  },
  {
    id: "system",
    title: "Actualizaciones e integridad del sistema",
    category: "Sistema",
    signals: ["update", "corrupt", "boot"],
    level: "Revisar",
    explanation:
      "Una actualización incompleta o archivos de sistema dañados pueden impedir el arranque o el funcionamiento normal.",
    steps: [
      "Respalda los datos antes de modificar el sistema. Registra el código del error.",
      "Comprueba fecha, conexión y espacio libre. Reintenta la actualización oficial y evita interrumpirla.",
      "Si no arranca, usa la recuperación del sistema. Conserva la clave de recuperación de BitLocker/FileVault antes de cambiar firmware o arranque.",
    ],
    platform: {
      "Windows 11": [
        "Si Windows inicia y hay corrupción confirmada, abre Terminal como administrador: DISM.exe /Online /Cleanup-image /Restorehealth. Cuando termine correctamente, ejecuta sfc /scannow.",
      ],
      "Windows 10": [
        "Si Windows inicia y hay corrupción confirmada, abre una consola como administrador: DISM.exe /Online /Cleanup-image /Restorehealth; después de finalizar correctamente, sfc /scannow.",
      ],
      macOS: [
        "Desde Recuperación de macOS, consulta las opciones de Utilidad de Discos. No borres la unidad como primer paso.",
      ],
      Linux: [
        "Revisa los registros del gestor de paquetes de tu distribución. No mezcles comandos de distintas distribuciones.",
      ],
    },
  },
  {
    id: "network",
    title: "Conexión de red y resolución DNS",
    category: "Conectividad",
    signals: ["wifi", "dns"],
    level: "Revisar",
    explanation:
      "Distingue una falla del equipo de un problema del router, DNS o proveedor.",
    steps: [
      "Comprueba si otro dispositivo puede abrir el mismo sitio usando la misma red.",
      "Revisa modo avión y conexión. Reconecta la red; reinicia el router solo si es tuyo y no interrumpes a otras personas.",
      "Prueba otro sitio y otra red. Si falla únicamente un sitio, revisa su estado; si falla toda la red, contacta al proveedor.",
    ],
    platform: {
      "Windows 11": [
        "Usa el solucionador de red en Obtener ayuda y registra cualquier mensaje DNS.",
      ],
      "Windows 10": [
        "Usa el solucionador en Configuración → Red e Internet → Estado.",
      ],
      macOS: [
        "Abre Diagnóstico Inalámbrico desde el menú Wi-Fi con la tecla Opción.",
      ],
      Linux: [
        "Consulta la guía de red de Ubuntu si usas Ubuntu; en otras distribuciones consulta su documentación.",
      ],
    },
  },
  {
    id: "devices",
    title: "Pantalla, audio y periféricos",
    category: "Conectividad",
    signals: ["display", "usb", "audio"],
    level: "Revisar",
    explanation:
      "La conexión, los permisos, la salida seleccionada o un controlador pueden explicar la falla.",
    steps: [
      "Comprueba cables, puerto, alimentación y dispositivo de salida seleccionado.",
      "Prueba el periférico en otro puerto o equipo. Revisa los permisos de cámara y micrófono.",
      "Instala actualizaciones oficiales y el controlador específico del fabricante. Evita herramientas automáticas de controladores de terceros.",
    ],
  },
  {
    id: "power",
    title: "Alimentación y secuencia de arranque",
    category: "Hardware",
    signals: ["power", "boot", "beep"],
    level: "Prioritaria",
    explanation:
      "No encender y no cargar el sistema son situaciones diferentes. Ninguna confirma por sí sola una placa base dañada.",
    steps: [
      "Distingue si hay luces o ventiladores. Comprueba toma de corriente y cargador compatible sin abrir la fuente.",
      "Desconecta accesorios externos y consulta el procedimiento de arranque del fabricante.",
      "Anota la secuencia de luces o pitidos y solicita revisión si no aparece imagen. No desmontes una fuente de alimentación.",
    ],
  },
];
const signatures = [
  {
    pattern: /\b(memory_management|page_fault_in_nonpaged_area|0x0000001a)\b/i,
    signal: "bsod",
    windows: true,
    label: "Error de memoria o acceso a memoria",
  },
  {
    pattern:
      /\b(irql_not_less_or_equal|driver_irql_not_less_or_equal|dpc_watchdog_violation|whea_uncorrectable_error)\b/i,
    signal: "bsod",
    windows: true,
    label: "Código de detención de Windows",
  },
  {
    pattern: /\b(0x800f081f|0x80070002|0x80073712)\b/i,
    signal: "update",
    windows: true,
    label: "Error de actualización o componentes",
  },
  {
    pattern: /\b(kernel panic|panic\(cpu|segmentation fault)\b/i,
    signal: "freeze",
    label: "Fallo de ejecución o del núcleo",
  },
  {
    pattern:
      /\b(err_name_not_resolved|dns_probe_finished_nxdomain|eai_again|enotfound)\b/i,
    signal: "dns",
    label: "Fallo de resolución de nombres",
  },
  {
    pattern: /\b(enospc|no space left on device|disk full)\b/i,
    signal: "space",
    label: "Espacio de almacenamiento agotado",
  },
  {
    pattern: /\b(i\/o error|input\/output error|bad sector|nvme.*error)\b/i,
    signal: "disk",
    label: "Error de entrada/salida de almacenamiento",
  },
];
export function analyze(selected: string[], log: string, os: OS) {
  const matches = signatures.filter(
    (s) => (!s.windows || os.startsWith("Windows")) && s.pattern.test(log),
  );
  const eligible = symptoms
    .filter((s) => !s.windows || os.startsWith("Windows"))
    .map((s) => s.id);
  const evidence = [
    ...new Set([
      ...selected.filter((s) => eligible.includes(s)),
      ...matches.map((s) => s.signal),
    ]),
  ];
  const findings = rules
    .map((rule) => ({
      ...rule,
      evidence: rule.signals.filter((s) => evidence.includes(s)),
      steps: [...rule.steps, ...(rule.platform?.[os] ?? [])],
    }))
    .filter((r) => r.evidence.length)
    .sort(
      (a, b) =>
        ({ Urgente: 3, Prioritaria: 2, Revisar: 1 })[b.level] -
          { Urgente: 3, Prioritaria: 2, Revisar: 1 }[a.level] ||
        b.evidence.length - a.evidence.length,
    );
  if (evidence.includes("electric"))
    for (const finding of findings) {
      if (finding.id !== "electrical")
        finding.steps = [
          "No realices pruebas ni vuelvas a encender el equipo. Estas áreas solo deben revisarse después de que un técnico descarte el riesgo eléctrico o de batería.",
        ];
    }
  return {
    findings,
    matches: matches.map((s) => s.label),
    evidence,
    unknownLog: !!log.trim() && !matches.length,
  };
}
export type Report = {
  id: string;
  date: string;
  os: OS;
  device: string;
  selected: string[];
  log: string;
  result: ReturnType<typeof analyze>;
};
export function reportText(report: Report) {
  return [
    `TECH-SCAN · INFORME DE ORIENTACIÓN`,
    new Date(report.date).toLocaleString("es-CO"),
    `${report.device} · ${report.os}`,
    "Basado en síntomas declarados; no es una comprobación automática de hardware.",
    `Síntomas: ${report.result.evidence.map((id) => symptoms.find((s) => s.id === id)?.label).join(", ") || "Ninguno"}`,
    `Mensaje aportado: ${report.log || "Ninguno"}`,
    ...report.result.findings.map(
      (f) =>
        `\n[${f.level}] ${f.title}\n${f.explanation}\n${f.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
    ),
    report.result.unknownLog
      ? "El mensaje no coincide con el catálogo de códigos."
      : "",
    !report.result.findings.length
      ? "Sin coincidencias: esto no confirma que el equipo esté sano."
      : "",
    "\nFuentes:",
    ...sources
      .filter((s) => report.os.startsWith(s.os))
      .map((s) => `${s.name}: ${s.url}`),
    `Revisión del catálogo: ${reviewed}`,
  ]
    .filter(Boolean)
    .join("\n");
}
