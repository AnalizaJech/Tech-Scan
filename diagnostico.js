document.getElementById('diagnoseBtn').addEventListener('click', function() {
    // Obtener las respuestas seleccionadas
    const respuestas = [];
    for (let i = 1; i <= 20; i++) {
      const valor = document.querySelector(`input[name="pregunta${i}"]:checked`).value;
      respuestas.push(valor);
    }
  
    let resultMessage = '';
  
    // Evaluar reglas para cada posible combinación de respuestas
    if (respuestas[0] === 'si' && respuestas[1] === 'si') {
      resultMessage = 'El equipo se reinicia constantemente y muestra mensajes de error. Posibles problemas en la RAM. Recomendación: Cambiar o limpiar la RAM.';
    } else if (respuestas[2] === 'si' && respuestas[0] === 'si') {
      resultMessage = 'El equipo se detiene inesperadamente y manda mensajes de error. Esto indica un problema en la RAM.';
    } else if (respuestas[3] === 'si' && respuestas[0] === 'si') {
      resultMessage = 'El equipo presenta pantallazos azules y mensajes de error. Problema en el Disco Duro. Recomendación: Reemplazar el disco duro.';
    } else if (respuestas[3] === 'si' && respuestas[4] === 'si') {
      resultMessage = 'Pantallazos azules y errores al guardar información indican un problema en el Disco Duro.';
    } else if (respuestas[5] === 'si') {
      resultMessage = 'El equipo hace ruidos extraños. Esto podría indicar problemas en el Disco Duro o en los ventiladores. Se recomienda hacer una revisión del hardware.';
    } else if (respuestas[6] === 'si' && respuestas[7] === 'si') {
      resultMessage = 'El equipo realiza una revisión al reiniciarse y está lento. Esto sugiere problemas en el Disco Duro o el Sistema Operativo.';
    } else if (respuestas[8] === 'si' && respuestas[9] === 'si') {
      resultMessage = 'El equipo tiene muchos programas instalados y mal rendimiento. Es posible que haya problemas de espacio en el disco o sobrecarga de programas.';
    } else if (respuestas[1] === 'si' && respuestas[7] === 'si') {
      resultMessage = 'El equipo se reinicia continuamente y está lento. Problemas en la RAM o en el Procesador.';
    } else if (respuestas[12] === 'si' && respuestas[13] === 'si') {
      resultMessage = 'El procesador está sobrecalentado. Problemas de refrigeración. Recomendación: Revisar los ventiladores y el sistema de refrigeración.';
    } else if (respuestas[14] === 'si' && respuestas[15] === 'si') {
      resultMessage = 'Pitido largo al arrancar indica un problema en la RAM o en la Placa Base. Se requiere una revisión técnica.';
    } else if (respuestas[17] === 'si') {
      resultMessage = 'Hay muchos archivos dañados en el sistema. Esto podría ser causado por virus o errores en el sistema de archivos. Se recomienda hacer un análisis del sistema.';
    } else if (respuestas[18] === 'si') {
      resultMessage = 'El equipo no arranca. Esto indica un problema grave en la RAM, el Procesador o la Placa Base.';
    } else if (respuestas[19] === 'si') {
      resultMessage = 'Cortocircuitos detectados. Revisión urgente recomendada para prevenir más daños.';
    } else if (respuestas[10] === 'si') {
      resultMessage = 'Lectura errónea del disco indica problemas en el Disco Duro. Recomendación: Reemplazar o revisar el disco duro.';
    } else if (respuestas[11] === 'si') {
      resultMessage = 'Bloqueo de aplicaciones. Esto podría estar relacionado con problemas en el procesador o la memoria RAM.';
    } else if (respuestas[7] === 'si') {
      resultMessage = 'El equipo está lento. Esto puede deberse a varios factores, como problemas en el disco duro, exceso de programas instalados o falta de espacio en disco.';
    } else if (respuestas[2] === 'si') {
      resultMessage = 'El equipo se detiene inesperadamente. Esto podría estar relacionado con la RAM o problemas en el sistema operativo.';
    } else {
      resultMessage = 'No se ha detectado un problema específico. Se recomienda realizar una revisión general del equipo.';
    }
  
    // Mostrar el resultado del diagnóstico
    const resultContainer = document.getElementById('diagnosticResult');
    const resultText = document.getElementById('resultMessage');
    resultText.textContent = resultMessage;
    resultContainer.classList.remove('hidden');
  });
  