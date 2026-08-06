// Mock database and Axios adapter for client-side demo execution
// Saves everything to localStorage to allow full interactive editing.

const defaultReferees = [
  { idArbitro: 1, nombre: "Carlos", apellido: "Gómez", categoria: "Árbitro Principal", whatsapp: "+5491122334455", estado: true, disponibleSabado: true, disponibleDomingo: true, talleShort: "M", talleCamiseta: "L", tieneAuto: true },
  { idArbitro: 2, nombre: "María", apellido: "Rodríguez", categoria: "Asistente Internacional", whatsapp: "+5491199887766", estado: true, disponibleSabado: true, disponibleDomingo: false, talleShort: "S", talleCamiseta: "M", tieneAuto: false },
  { idArbitro: 3, nombre: "Juan", apellido: "Pérez", categoria: "Árbitro Categoría B", whatsapp: "+5491144556677", estado: true, disponibleSabado: false, disponibleDomingo: true, talleShort: "L", talleCamiseta: "XL", tieneAuto: true },
  { idArbitro: 4, nombre: "Sofía", apellido: "Martínez", categoria: "Árbitro Principal", whatsapp: "+5491166778899", estado: false, disponibleSabado: false, disponibleDomingo: false, talleShort: "M", talleCamiseta: "M", tieneAuto: false },
  { idArbitro: 5, nombre: "Lucas", apellido: "Díaz", categoria: "Árbitro de Reserva", whatsapp: "+5491133221100", estado: true, disponibleSabado: true, disponibleDomingo: true, talleShort: "M", talleCamiseta: "L", tieneAuto: true }
];

const defaultLoans = [
  { idPrestamo: 101, arbitro: { idArbitro: 1, nombre: "Carlos", apellido: "Gómez" }, montoSolicitado: 30000.00, montoDevuelto: 30000.00, saldoRestante: 0.00, fechaSolicitud: "2026-06-15", estado: "PAGADO" },
  { idPrestamo: 102, arbitro: { idArbitro: 2, nombre: "María", apellido: "Rodríguez" }, montoSolicitado: 50000.00, montoDevuelto: 25000.00, saldoRestante: 25000.00, fechaSolicitud: "2026-07-10", estado: "PENDIENTE" },
  { idPrestamo: 103, arbitro: { idArbitro: 3, nombre: "Juan", apellido: "Pérez" }, montoSolicitado: 20000.00, montoDevuelto: 0.00, saldoRestante: 20000.00, fechaSolicitud: "2026-05-01", estado: "VENCIDO" }
];

const defaultTransactions = [
  { idTransaccion: 501, tipo: "EGRESO", monto: 12000.00, fecha: "2026-08-01T10:00:00", descripcion: "Alquiler de predio para entrenamientos", nombreConceptoGasto: "Alquiler", requiereRecupero: false, idPrestamo: null },
  { idTransaccion: 502, tipo: "EGRESO", monto: 8500.00, fecha: "2026-08-02T15:30:00", descripcion: "Combustible y viáticos para designación en San Vicente", nombreConceptoGasto: "Viáticos", requiereRecupero: true, idPrestamo: null },
  { idTransaccion: 503, tipo: "INGRESO", monto: 95000.00, fecha: "2026-08-03T18:00:00", descripcion: "Cobro de cuotas Liga Metropolitana", nombreConceptoGasto: "Cuotas", requiereRecupero: false, idPrestamo: null },
  { idTransaccion: 504, tipo: "EGRESO", monto: 50000.00, fecha: "2026-08-04T09:15:00", descripcion: "Préstamo emitido a María Rodríguez (#102)", nombreConceptoGasto: "Préstamos", requiereRecupero: false, idPrestamo: 102 },
  { idTransaccion: 505, tipo: "INGRESO", monto: 30000.00, fecha: "2026-08-04T12:00:00", descripcion: "Pago de cuota de préstamo de Carlos Gómez", nombreConceptoGasto: "Recupero", requiereRecupero: false, idPrestamo: 101 },
  { idTransaccion: 506, tipo: "EGRESO", monto: 4500.00, fecha: "2026-08-05T11:00:00", descripcion: "Compra de silbatos y tarjetas oficiales", nombreConceptoGasto: "Indumentaria", requiereRecupero: false, idPrestamo: null }
];

const defaultCajas = {
  saldoActual: 254800.00
};

const defaultCanchas = [
  { idCancha: 1, nombre: "Cancha Principal A" },
  { idCancha: 2, fontAwesomeIcon: null, nombre: "Cancha Auxiliar B" },
  { idCancha: 3, fontAwesomeIcon: null, nombre: "Predio Centenario - 1" },
  { idCancha: 4, nombre: "Estadio Municipal" }
];

const defaultAranceles = [
  { idArancel: 1, descripcion: "Arancel Liga Amateur A", montoTotal: 15000.0, fechaVigencia: "2026-06-01", cantidadPartidos: 3, activo: true, cancha: { idCancha: 1, nombreCancha: "Cancha Principal A", nombre: "Cancha Principal A" } },
  { idArancel: 2, descripcion: "Arancel Torneo Relámpago", montoTotal: 8500.0, fechaVigencia: "2026-05-15", cantidadPartidos: 2, activo: false, cancha: { idCancha: 2, fontAwesomeIcon: null, nombreCancha: "Cancha Auxiliar B", nombre: "Cancha Auxiliar B" } }
];

const defaultConceptos = [
  { idConcepto: 1, nombre: "Viáticos" },
  { idConcepto: 2, nickname: null, nombre: "Indumentaria" },
  { idConcepto: 3, nombre: "Alquiler" },
  { idConcepto: 4, nombre: "Honorarios" },
  { idConcepto: 5, nombre: "Capacitación" },
  { idConcepto: 6, nombre: "Cuotas" },
  { idConcepto: 9999, nombre: "Recupero" }
];

const defaultRecupero502 = [
  { idDeuda: 1, idArbitro: 1, arbitroNombre: "Carlos", arbitroApellido: "Gómez", montoAsignado: 4250.00, montoPagado: 4250.00, estado: "PAGADO" },
  { idDeuda: 2, idArbitro: 2, arbitroNombre: "María", arbitroApellido: "Rodríguez", montoAsignado: 4250.00, montoPagado: 0.00, estado: "PENDIENTE" }
];

// Database storage helper
const db = {
  getReferees: () => JSON.parse(localStorage.getItem("reffinance_referees")),
  saveReferees: (data) => localStorage.setItem("reffinance_referees", JSON.stringify(data)),
  
  getLoans: () => JSON.parse(localStorage.getItem("reffinance_loans")),
  saveLoans: (data) => localStorage.setItem("reffinance_loans", JSON.stringify(data)),
  
  getTransactions: () => JSON.parse(localStorage.getItem("reffinance_transactions")),
  saveTransactions: (data) => localStorage.setItem("reffinance_transactions", JSON.stringify(data)),
  
  getCaja: () => JSON.parse(localStorage.getItem("reffinance_cajas")),
  saveCaja: (data) => localStorage.setItem("reffinance_cajas", JSON.stringify(data)),
  
  getCanchas: () => JSON.parse(localStorage.getItem("reffinance_canchas")),
  saveCanchas: (data) => localStorage.setItem("reffinance_canchas", JSON.stringify(data)),
  
  getAranceles: () => JSON.parse(localStorage.getItem("reffinance_aranceles")),
  saveAranceles: (data) => localStorage.setItem("reffinance_aranceles", JSON.stringify(data)),
  
  getConceptos: () => JSON.parse(localStorage.getItem("reffinance_conceptos")),
  saveConceptos: (data) => localStorage.setItem("reffinance_conceptos", JSON.stringify(data))
};

function initDb() {
  if (!localStorage.getItem("reffinance_referees")) {
    localStorage.setItem("reffinance_referees", JSON.stringify(defaultReferees));
  }
  if (!localStorage.getItem("reffinance_loans")) {
    localStorage.setItem("reffinance_loans", JSON.stringify(defaultLoans));
  }
  if (!localStorage.getItem("reffinance_transactions")) {
    localStorage.setItem("reffinance_transactions", JSON.stringify(defaultTransactions));
  }
  if (!localStorage.getItem("reffinance_cajas")) {
    localStorage.setItem("reffinance_cajas", JSON.stringify(defaultCajas));
  }
  if (!localStorage.getItem("reffinance_canchas")) {
    localStorage.setItem("reffinance_canchas", JSON.stringify(defaultCanchas));
  }
  if (!localStorage.getItem("reffinance_aranceles")) {
    localStorage.setItem("reffinance_aranceles", JSON.stringify(defaultAranceles));
  }
  if (!localStorage.getItem("reffinance_conceptos")) {
    localStorage.setItem("reffinance_conceptos", JSON.stringify(defaultConceptos));
  }
  if (!localStorage.getItem("recupero_asociaciones_502")) {
    localStorage.setItem("recupero_asociaciones_502", JSON.stringify(defaultRecupero502));
  }
}

// Intercepts and mocks requests
export async function mockAdapter(config) {
  initDb();

  // Extract normalized route path
  let path = config.url || "";
  if (config.baseURL && path.startsWith(config.baseURL)) {
    path = path.substring(config.baseURL.length);
  }
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  const [urlWithoutParams, queryString] = path.split("?");
  const url = urlWithoutParams;
  const method = config.method.toUpperCase();
  const params = config.params || {};

  function getQueryParam(key) {
    if (params[key] !== undefined) return params[key];
    if (!queryString) return undefined;
    const searchParams = new URLSearchParams(queryString);
    const val = searchParams.get(key);
    return val === "true" ? true : val === "false" ? false : val;
  }

  // Parse payload data
  let payload = {};
  if (config.data) {
    try {
      payload = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    } catch (e) {
      payload = config.data;
    }
  }

  // Helper for response format matching Axios
  const response = (data, status = 200) => {
    return new Promise((resolve) => {
      // Simulate real delay for visual spinner fidelity
      setTimeout(() => {
        resolve({
          data,
          status,
          statusText: status === 200 ? "OK" : "Error",
          headers: {
            "content-type": "application/json"
          },
          config,
          request: {}
        });
      }, 350);
    });
  };

  // --- ROUTES DEFINITION ---

  // Auth: Login
  if (url === "/auth/login" && method === "POST") {
    return response({
      status: true,
      message: "Inicio de sesión de demostración exitoso",
      jwt: "mock-jwt-token-for-portfolio",
      username: payload.whatsapp || "DemoUser"
    });
  }

  // Referees: List
  if (url === "/finanzas/arbitros" && method === "GET") {
    const referees = db.getReferees();
    return response({
      content: referees,
      totalPages: 1,
      totalElements: referees.length
    });
  }

  // Referees: Create
  if (url === "/arbitros" && method === "POST") {
    const referees = db.getReferees();
    const newReferee = {
      ...payload,
      idArbitro: Date.now(),
      estado: payload.estado !== undefined ? payload.estado : true
    };
    referees.push(newReferee);
    db.saveReferees(referees);
    return response(newReferee);
  }

  // Referees: Update
  const refereeUpdateMatch = url.match(/^\/arbitros\/(\d+)$/);
  if (refereeUpdateMatch && method === "PUT") {
    const id = Number(refereeUpdateMatch[1]);
    const referees = db.getReferees();
    const idx = referees.findIndex(r => r.idArbitro === id);
    if (idx !== -1) {
      referees[idx] = { ...referees[idx], ...payload };
      db.saveReferees(referees);
      return response(referees[idx]);
    }
    return response({ message: "Árbitro no encontrado" }, 404);
  }

  // Referees: Loans details list
  const refereeLoansMatch = url.match(/^\/finanzas\/prestamos\/arbitro\/(\d+)$/);
  if (refereeLoansMatch && method === "GET") {
    const refereeId = Number(refereeLoansMatch[1]);
    const loans = db.getLoans().filter(l => l.arbitro && l.arbitro.idArbitro === refereeId);
    return response(loans);
  }

  // Loans: List
  if (url === "/finanzas/prestamos" && method === "GET") {
    const loans = db.getLoans();
    return response({
      content: loans,
      totalPages: 1,
      totalElements: loans.length
    });
  }

  // Loans: Create
  if (url === "/finanzas/prestamos" && method === "POST") {
    const referees = db.getReferees();
    const refObj = referees.find(r => r.idArbitro === Number(payload.arbitro));
    const requestedAmount = parseFloat(payload.montoSolicitado);
    
    const newLoan = {
      idPrestamo: Date.now(),
      arbitro: refObj ? { idArbitro: refObj.idArbitro, nombre: refObj.nombre, apellido: refObj.apellido } : { idArbitro: Number(payload.arbitro), nombre: "Árbitro", apellido: "Desconocido" },
      montoSolicitado: requestedAmount,
      montoDevuelto: 0.0,
      saldoRestante: requestedAmount,
      fechaSolicitud: payload.fechaSolicitud,
      estado: "PENDIENTE"
    };

    const loans = db.getLoans();
    loans.push(newLoan);
    db.saveLoans(loans);

    // Register loan transaction
    const txs = db.getTransactions();
    txs.unshift({
      idTransaccion: Date.now(),
      tipo: "EGRESO",
      monto: requestedAmount,
      fecha: payload.fechaSolicitud + "T00:00:00",
      descripcion: `Préstamo emitido a ${newLoan.arbitro.nombre} ${newLoan.arbitro.apellido} (#LN-${newLoan.idPrestamo})`,
      nombreConceptoGasto: "Préstamos",
      requiereRecupero: false,
      idPrestamo: newLoan.idPrestamo
    });
    db.saveTransactions(txs);

    // Deduct from Caja
    const caja = db.getCaja();
    caja.saldoActual = parseFloat((caja.saldoActual - requestedAmount).toFixed(2));
    db.saveCaja(caja);

    return response(newLoan);
  }

  // Loans: Register Payment
  const loanPaymentMatch = url.match(/^\/finanzas\/prestamos\/(\d+)\/pago$/);
  if (loanPaymentMatch && method === "POST") {
    const loanId = Number(loanPaymentMatch[1]);
    const amount = parseFloat(getQueryParam("montoPagado"));
    const fecha = getQueryParam("fecha") || new Date().toISOString().split("T")[0];

    const loans = db.getLoans();
    const loan = loans.find(l => l.idPrestamo === loanId);
    if (loan) {
      loan.montoDevuelto = parseFloat((loan.montoDevuelto + amount).toFixed(2));
      loan.saldoRestante = parseFloat(Math.max(0, loan.montoSolicitado - loan.montoDevuelto).toFixed(2));
      if (loan.saldoRestante === 0) {
        loan.estado = "PAGADO";
      } else {
        loan.estado = "PENDIENTE";
      }
      db.saveLoans(loans);

      // Log INGRESO transaction
      const txs = db.getTransactions();
      txs.unshift({
        idTransaccion: Date.now(),
        tipo: "INGRESO",
        monto: amount,
        fecha: fecha + "T00:00:00",
        descripcion: `Recibo pago de préstamo de ${loan.arbitro.nombre} ${loan.arbitro.apellido}`,
        nombreConceptoGasto: "Recupero",
        requiereRecupero: false,
        idPrestamo: loan.idPrestamo
      });
      db.saveTransactions(txs);

      // Update Caja
      const caja = db.getCaja();
      caja.saldoActual = parseFloat((caja.saldoActual + amount).toFixed(2));
      db.saveCaja(caja);

      return response(loan);
    }
    return response({ message: "Préstamo no encontrado" }, 404);
  }

  // Loans: Update Date
  const loanUpdateDateMatch = url.match(/^\/finanzas\/prestamos\/(\d+)\/actualizar-fecha$/);
  if (loanUpdateDateMatch && method === "PUT") {
    const loanId = Number(loanUpdateDateMatch[1]);
    const nuevaFecha = getQueryParam("nuevaFecha");
    const loans = db.getLoans();
    const loan = loans.find(l => l.idPrestamo === loanId);
    if (loan) {
      loan.fechaSolicitud = nuevaFecha;
      db.saveLoans(loans);
      return response(loan);
    }
    return response({ message: "Préstamo no encontrado" }, 404);
  }

  // Loans: Update Payment Date
  const loanUpdatePaymentDateMatch = url.match(/^\/?(?:finanzas\/)?prestamos\/(\d+)\/actualizar-fecha-pago$/);
  if (loanUpdatePaymentDateMatch && method === "PUT") {
    const loanId = Number(loanUpdatePaymentDateMatch[1]);
    const nuevaFecha = getQueryParam("nuevaFecha");
    const loans = db.getLoans();
    const loan = loans.find(l => l.idPrestamo === loanId);
    if (loan) {
      loan.fechaSolicitud = nuevaFecha;
      db.saveLoans(loans);
      return response(loan);
    }
    return response({ message: "Préstamo no encontrado" }, 404);
  }

  // Loans: Download Report
  if (url === "/finanzas/prestamos/reporte" && method === "GET") {
    try {
      const res = await fetch("/prestamos.pdf");
      const pdfBlob = await res.blob();
      return response(pdfBlob);
    } catch (e) {
      console.error("Error al cargar prestamos.pdf simulado:", e);
      return response(new Blob(["%PDF-1.4 mock pdf fallback"], { type: "application/pdf" }));
    }
  }

  // Loans: Detail (Cuotas)
  const loanDetailsMatch = url.match(/^\/prestamos\/(\d+)\/detalle$/);
  if (loanDetailsMatch && method === "GET") {
    const loanId = Number(loanDetailsMatch[1]);
    const loans = db.getLoans();
    const loan = loans.find(l => l.idPrestamo === loanId);
    const solicitados = loan ? loan.montoSolicitado : 5000;
    const devueltos = loan ? loan.montoDevuelto : 0;
    const nombreArbitro = loan ? `${loan.arbitro.nombre} ${loan.arbitro.apellido}` : "Árbitro";
    const fechaBase = loan ? loan.fechaSolicitud : new Date().toISOString().split("T")[0];
    
    const items = [];
    const totalCuotas = 4;
    const cuotaMonto = parseFloat((solicitados / totalCuotas).toFixed(2));
    let montoRestanteDevuelto = devueltos;

    for (let i = 1; i <= totalCuotas; i++) {
      const vto = new Date(new Date(fechaBase).getTime() + i * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      let pagado = 0;
      let estado = "PENDIENTE";

      if (montoRestanteDevuelto > 0) {
        pagado = Math.min(cuotaMonto, montoRestanteDevuelto);
        montoRestanteDevuelto = parseFloat((montoRestanteDevuelto - pagado).toFixed(2));
        estado = pagado >= cuotaMonto ? "PAGADO" : "PARCIAL";
      }

      items.push({
        idDeuda: i,
        nroCuota: i,
        fechaVencimiento: vto,
        montoCuota: cuotaMonto,
        montoPagado: parseFloat(pagado.toFixed(2)),
        estado: estado,
        arbitroNombre: nombreArbitro
      });
    }

    return response({
      content: items,
      totalPages: 1,
      totalElements: items.length
    });
  }

  // Caja: Info Actual
  if (url === "/finanzas/cajas/actual" && method === "GET") {
    return response(db.getCaja());
  }

  // Transactions: List
  if (url === "/finanzas/transacciones" && method === "GET") {
    const txs = db.getTransactions();
    return response({
      content: txs,
      totalPages: 1,
      totalElements: txs.length
    });
  }

  // Transactions: Create (Gasto / Ingreso)
  if (url === "/finanzas/gastos" && method === "POST") {
    const conceptos = db.getConceptos();
    const conceptoObj = conceptos.find(c => c.idConcepto === Number(payload.concepto));
    const monto = Math.abs(parseFloat(payload.monto));
    const fecha = payload.fecha || new Date().toISOString();

    const newTx = {
      idTransaccion: Date.now(),
      tipo: payload.tipo === "EGRESO" ? "EGRESO" : "INGRESO",
      monto: monto,
      fecha: fecha,
      descripcion: payload.descripcion || "Transacción",
      nombreConceptoGasto: conceptoObj ? conceptoObj.nombre : "Otros",
      requiereRecupero: !!payload.requiereRecupero,
      idPrestamo: null
    };

    const txs = db.getTransactions();
    txs.unshift(newTx);
    db.saveTransactions(txs);

    // Update Caja
    const caja = db.getCaja();
    if (newTx.tipo === "EGRESO") {
      caja.saldoActual = parseFloat((caja.saldoActual - monto).toFixed(2));
    } else {
      caja.saldoActual = parseFloat((caja.saldoActual + monto).toFixed(2));
    }
    db.saveCaja(caja);

    // Initialize associations empty array
    if (newTx.requiereRecupero) {
      localStorage.setItem(`recupero_asociaciones_${newTx.idTransaccion}`, JSON.stringify([]));
    }

    return response({
      idGasto: newTx.idTransaccion,
      fecha: newTx.fecha,
      monto: newTx.monto,
      descripcion: newTx.descripcion,
      concepto: newTx.nombreConceptoGasto,
      requiereRecupero: newTx.requiereRecupero
    });
  }

  // Transactions: Update (Gasto)
  const txUpdateMatch = url.match(/^\/finanzas\/gastos\/(\d+)\/actualizar$/);
  if (txUpdateMatch && method === "PUT") {
    const txId = Number(txUpdateMatch[1]);
    const txs = db.getTransactions();
    const idx = txs.findIndex(t => t.idTransaccion === txId);
    if (idx !== -1) {
      const oldTx = txs[idx];
      const conceptos = db.getConceptos();
      const conceptoObj = conceptos.find(c => c.idConcepto === Number(payload.concepto));
      const monto = Math.abs(parseFloat(payload.monto));

      // Reverse old Box balance
      const caja = db.getCaja();
      if (oldTx.tipo === "EGRESO") {
        caja.saldoActual = parseFloat((caja.saldoActual + oldTx.monto).toFixed(2));
      } else {
        caja.saldoActual = parseFloat((caja.saldoActual - oldTx.monto).toFixed(2));
      }

      // Update values
      oldTx.tipo = payload.tipo === "EGRESO" ? "EGRESO" : "INGRESO";
      oldTx.monto = monto;
      oldTx.fecha = payload.fecha;
      oldTx.descripcion = payload.descripcion;
      oldTx.nombreConceptoGasto = conceptoObj ? conceptoObj.nombre : oldTx.nombreConceptoGasto;
      oldTx.requiereRecupero = !!payload.requiereRecupero;

      // Apply new Box balance
      if (oldTx.tipo === "EGRESO") {
        caja.saldoActual = parseFloat((caja.saldoActual - monto).toFixed(2));
      } else {
        caja.saldoActual = parseFloat((caja.saldoActual + monto).toFixed(2));
      }

      db.saveCaja(caja);
      db.saveTransactions(txs);

      return response({
        idGasto: oldTx.idTransaccion,
        fecha: oldTx.fecha,
        monto: oldTx.monto,
        descripcion: oldTx.descripcion,
        concepto: oldTx.nombreConceptoGasto,
        requiereRecupero: oldTx.requiereRecupero
      });
    }
    return response({ message: "Transacción no encontrada" }, 404);
  }

  // Transactions: Download Report for Gasto
  const txReportMatch = url.match(/^\/finanzas\/gastos\/(\d+)\/reporte$/);
  if (txReportMatch && method === "GET") {
    return response(new Blob(["Reporte de gasto en PDF"], { type: "application/pdf" }));
  }

  // Concepts: List
  if ((url === "/finanzas/conceptos" || url === "/conceptos") && method === "GET") {
    return response({
      content: db.getConceptos()
    });
  }

  // Recupero Split: Get associations for detailed screen
  const recuperoDetailMatch = url.match(/^\/finanzas\/gastos-con-recupero\/(\d+)$/);
  if (recuperoDetailMatch && method === "GET") {
    const id = Number(recuperoDetailMatch[1]);
    const txs = db.getTransactions();
    const tx = txs.find(t => t.idTransaccion === id);

    const localKey = `recupero_asociaciones_${id}`;
    const deudas = JSON.parse(localStorage.getItem(localKey)) || [];

    return response({
      idTransaccion: id,
      descripcion: tx ? tx.descripcion : "",
      conceptoGastoNombre: tx ? tx.nombreConceptoGasto : "",
      deudasDivididas: deudas,
      monto: tx ? tx.monto : 0
    });
  }

  // Recupero Split: Associate referee
  if (url === "/finanzas/gastos/asociar-gasto-arbitro" && method === "POST") {
    const idGasto = Number(getQueryParam("idGasto"));
    const idArbitro = Number(getQueryParam("idArbitro"));
    const montoAsignado = parseFloat(getQueryParam("montoAsignado"));

    const localKey = `recupero_asociaciones_${idGasto}`;
    let deudas = JSON.parse(localStorage.getItem(localKey)) || [];

    const referees = db.getReferees();
    const referee = referees.find(r => r.idArbitro === idArbitro);

    if (referee) {
      deudas = deudas.filter(d => d.idArbitro !== idArbitro);
      deudas.push({
        idDeuda: deudas.length + 1,
        idArbitro: idArbitro,
        arbitroNombre: referee.nombre,
        arbitroApellido: referee.apellido,
        montoAsignado: montoAsignado,
        montoPagado: 0.0,
        estado: "PENDIENTE"
      });
      localStorage.setItem(localKey, JSON.stringify(deudas));
    }
    return response({ success: true, message: "Árbitro asociado exitosamente" });
  }

  // Recupero Split: Auto assign designados
  if (url === "/finanzas/gastos/asignar-arbitros" && method === "POST") {
    const idGasto = Number(getQueryParam("idGasto"));
    const montoAasignar = parseFloat(getQueryParam("montoAasignar"));
    
    const referees = db.getReferees().filter(r => r.estado);
    if (referees.length > 0) {
      const splitAmount = parseFloat((montoAasignar / referees.length).toFixed(2));
      const localKey = `recupero_asociaciones_${idGasto}`;
      
      const deudas = referees.map((r, i) => ({
        idDeuda: i + 1,
        idArbitro: r.idArbitro,
        arbitroNombre: r.nombre,
        arbitroApellido: r.apellido,
        montoAsignado: splitAmount,
        montoPagado: 0.0,
        estado: "PENDIENTE"
      }));
      localStorage.setItem(localKey, JSON.stringify(deudas));
    }
    return response({ success: true });
  }

  // Recupero Split: Collect debt
  const recuperoCollectMatch = url.match(/^\/finanzas\/gastos-con-recupero\/(\d+)\/realizar-cobro$/);
  if (recuperoCollectMatch && method === "POST") {
    const idGasto = Number(recuperoCollectMatch[1]);
    const idArbitro = Number(getQueryParam("idArbitro"));
    const montoCobrado = parseFloat(getQueryParam("montoCobrado"));

    const localKey = `recupero_asociaciones_${idGasto}`;
    const deudas = JSON.parse(localStorage.getItem(localKey)) || [];
    const debt = deudas.find(d => d.idArbitro === idArbitro);
    
    if (debt) {
      debt.montoPagado = parseFloat((debt.montoPagado + montoCobrado).toFixed(2));
      if (debt.montoPagado >= debt.montoAsignado) {
        debt.montoPagado = debt.montoAsignado;
        debt.estado = "PAGADO";
      } else {
        debt.estado = "PARCIAL";
      }
      localStorage.setItem(localKey, JSON.stringify(deudas));

      // Log INGRESO transaction
      const txs = db.getTransactions();
      txs.unshift({
        idTransaccion: Date.now(),
        tipo: "INGRESO",
        monto: montoCobrado,
        fecha: new Date().toISOString(),
        descripcion: `Recibo cobro recupero de ${debt.arbitroNombre} ${debt.arbitroApellido}`,
        nombreConceptoGasto: "Recupero",
        requiereRecupero: false,
        idPrestamo: null
      });
      db.saveTransactions(txs);

      // Add to Caja
      const caja = db.getCaja();
      caja.saldoActual = parseFloat((caja.saldoActual + montoCobrado).toFixed(2));
      db.saveCaja(caja);
    }
    return response({ success: true });
  }

  // Recupero Split: Delete association
  const recuperoDeleteMatch = url.match(/^\/finanzas\/gastos-con-recupero\/(\d+)\/asociacion\/(\d+)$/);
  if (recuperoDeleteMatch && method === "DELETE") {
    const idGasto = Number(recuperoDeleteMatch[1]);
    const idArbitro = Number(recuperoDeleteMatch[2]);

    const localKey = `recupero_asociaciones_${idGasto}`;
    let deudas = JSON.parse(localStorage.getItem(localKey)) || [];
    deudas = deudas.filter(d => d.idArbitro !== idArbitro);
    localStorage.setItem(localKey, JSON.stringify(deudas));

    return response({ success: true });
  }

  // Canchas: List
  if (url === "/canchas" && method === "GET") {
    return response(db.getCanchas());
  }

  // Canchas: Create
  if (url === "/canchas" && method === "POST") {
    const canchas = db.getCanchas();
    const newCancha = {
      idCancha: Date.now(),
      nombreCancha: payload.nombreCancha || payload.nombre,
      nombre: payload.nombreCancha || payload.nombre,
      categoria: payload.categoria || null,
      fueraDeJuego: payload.fueraDeJuego || false,
      estado: payload.estado !== undefined ? payload.estado : true
    };
    canchas.push(newCancha);
    db.saveCanchas(canchas);
    return response(newCancha);
  }

  // Canchas: Update
  const canchaUpdateMatch = url.match(/^\/canchas\/(\d+)$/);
  if (canchaUpdateMatch && method === "PUT") {
    const idCancha = Number(canchaUpdateMatch[1]);
    const canchas = db.getCanchas();
    const idx = canchas.findIndex(c => c.idCancha === idCancha);
    if (idx !== -1) {
      canchas[idx] = { ...canchas[idx], ...payload };
      db.saveCanchas(canchas);
      return response(canchas[idx]);
    }
    return response({ message: "Cancha no encontrada" }, 404);
  }

  // Aranceles: List
  if (url === "/aranceles" && method === "GET") {
    const aranceles = db.getAranceles();
    return response({
      content: aranceles,
      totalPages: 1,
      totalElements: aranceles.length
    });
  }

  // Aranceles: Create
  if (url === "/aranceles" && method === "POST") {
    const aranceles = db.getAranceles();
    const canchas = db.getCanchas();
    const canchaObj = canchas.find(c => c.idCancha === Number(payload.idCancha)) || null;

    const newArancel = {
      idArancel: Date.now(),
      descripcion: payload.descripcion,
      montoTotal: parseFloat(payload.monto),
      monto: parseFloat(payload.monto),
      fechaVigencia: payload.fechaVigencia,
      cantidadPartidos: parseInt(payload.cantidadPartidos),
      activo: true,
      cancha: canchaObj
    };
    aranceles.unshift(newArancel);
    db.saveAranceles(aranceles);
    return response(newArancel);
  }

  // Aranceles: Update
  if (url === "/aranceles/actualizar" && method === "PUT") {
    const idArancel = Number(getQueryParam("idArancel"));
    const aranceles = db.getAranceles();
    const idx = aranceles.findIndex(a => a.idArancel === idArancel);
    if (idx !== -1) {
      const canchas = db.getCanchas();
      const canchaObj = canchas.find(c => c.idCancha === Number(payload.idCancha)) || null;

      aranceles[idx] = {
        ...aranceles[idx],
        descripcion: payload.descripcion,
        montoTotal: parseFloat(payload.monto),
        monto: parseFloat(payload.monto),
        fechaVigencia: payload.fechaVigencia,
        cantidadPartidos: parseInt(payload.cantidadPartidos),
        cancha: canchaObj
      };
      db.saveAranceles(aranceles);
      return response(aranceles[idx]);
    }
    return response({ message: "Arancel no encontrado" }, 404);
  }

  // Aranceles: Toggle Activo
  const arancelToggleActiveMatch = url.match(/^\/finanzas\/aranceles\/(\d+)\/activo$/);
  if (arancelToggleActiveMatch && method === "PUT") {
    const idArancel = Number(arancelToggleActiveMatch[1]);
    const activo = getQueryParam("activo");

    const aranceles = db.getAranceles();
    const arancel = aranceles.find(a => a.idArancel === idArancel);
    if (arancel) {
      arancel.activo = activo;
      db.saveAranceles(aranceles);
      return response({ success: true });
    }
    return response({ message: "Arancel no encontrado" }, 404);
  }

  // Fallback default error for unmocked routes
  console.warn(`Unmocked route requested: ${method} ${url}`, config);
  return response({ message: "Acción no emulada en modo demo" }, 501);
}
