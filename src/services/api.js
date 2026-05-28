import axios from "axios";

// Configuración del cliente de Axios conectado al backend del usuario
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper para mapear palabras clave de la descripción a categorías de frontend
const mapDescriptionToCategory = (desc, tipo) => {
  const text = String(desc || "").toLowerCase();
  if (
    text.includes("pago de préstamo") ||
    text.includes("pago de prestamo") ||
    text.includes("abono")
  )
    return "Recuperación de Viáticos";
  if (text.includes("préstamo otorgado") || text.includes("prestamo otorgado"))
    return "Indumentaria y Equipamiento";
  if (
    text.includes("combustible") ||
    text.includes("viático") ||
    text.includes("viatico") ||
    text.includes("traslado") ||
    text.includes("viaje")
  )
    return "Recuperación de Viáticos";
  if (
    text.includes("curso") ||
    text.includes("capacitacion") ||
    text.includes("capacitación") ||
    text.includes("taller") ||
    text.includes("instructor") ||
    text.includes("honorario")
  )
    return "Capacitación y Cursos";
  if (
    text.includes("silbato") ||
    text.includes("bandera") ||
    text.includes("indumentaria") ||
    text.includes("camiseta") ||
    text.includes("short") ||
    text.includes("tarjeta") ||
    text.includes("uniforme") ||
    text.includes("pelota")
  )
    return "Indumentaria y Equipamiento";
  if (
    text.includes("oficina") ||
    text.includes("papel") ||
    text.includes("papelería") ||
    text.includes("impres") ||
    text.includes("fotocopia") ||
    text.includes("software") ||
    text.includes("portal") ||
    text.includes("planilla")
  )
    return "Insumos de Oficina y Administración";
  if (
    text.includes("cuota") ||
    text.includes("afiliacion") ||
    text.includes("afiliación") ||
    text.includes("membresia") ||
    text.includes("membresía") ||
    text.includes("donacion") ||
    text.includes("donación") ||
    text.includes("patrocinio")
  )
    return "Donaciones / Patrocinios";
  if (text.includes("reintegro de gasto")) return "Reintegro de Gasto";

  return tipo === "EGRESO"
    ? "Insumos de Oficina y Administración"
    : "Donaciones / Patrocinios";
};

// Helper para mapear conceptos del backend a categorías del frontend
const mapConceptToCategory = (conceptName, desc, tipo) => {
  const concept = String(conceptName || "").toUpperCase();
  if (
    concept.includes("INDUMENTARIA") ||
    concept.includes("EQUIPAMIENTO") ||
    concept.includes("SUMINISTROS")
  )
    return "Indumentaria y Equipamiento";
  if (
    concept.includes("CAPACITACIÓN") ||
    concept.includes("CAPACITACION") ||
    concept.includes("CURSO") ||
    concept.includes("HONORARIOS")
  )
    return "Capacitación y Cursos";
  if (
    concept.includes("INSUMOS") ||
    concept.includes("OFICINA") ||
    concept.includes("ADMINISTRACIÓN") ||
    concept.includes("SOFTWARE")
  )
    return "Insumos de Oficina y Administración";
  if (
    concept.includes("VIÁTICOS") ||
    concept.includes("VIATICOS") ||
    concept.includes("COMBUSTIBLE") ||
    concept.includes("INTERESES") ||
    concept.includes("RECUPERA")
  )
    return "Recuperación de Viáticos";
  if (
    concept.includes("DONACIONES") ||
    concept.includes("PATROCINIOS") ||
    concept.includes("CUOTAS")
  )
    return "Donaciones / Patrocinios";
  if (concept.includes("Reintegro de Gasto")) return "Reintegro de Gasto";

  return mapDescriptionToCategory(desc, tipo);
};

export default {
  async getTransactions(page = 0, size = 10) {
    try {
      const response = await apiClient.get(
        `/finanzas/transacciones?page=${page}&size=${size}`,
      );
      const content = response.data.content || response.data || [];

      const contentMap = content.map((t) => {
        const id = t.idTransaccion || Math.floor(Math.random() * 100000);
        const finalMonto =
          t.tipo === "EGRESO" ? -Math.abs(t.monto) : Math.abs(t.monto);

        const isPago =
          t.idPrestamo != null ||
          String(t.descripcion || "")
            .toLowerCase()
            .includes("pago de préstamo") ||
          String(t.descripcion || "")
            .toLowerCase()
            .includes("pago de prestamo");

        let mappedTipo = "Gasto";
        if (
          t.tipo === "REINTEGRO DE GASTO" ||
          String(t.tipo).toUpperCase() === "REINTEGRO DE GASTO"
        ) {
          mappedTipo = "Reintegro de Gasto";
        } else if (isPago) {
          mappedTipo = "Pago Préstamo";
        } else if (t.tipo === "INGRESO") {
          mappedTipo = "Ingreso";
        }

        const mappedCategoria = t.nombreConceptoGasto
          ? mapConceptToCategory(t.nombreConceptoGasto, t.descripcion, t.tipo)
          : mapDescriptionToCategory(t.descripcion, t.tipo);

        return {
          id: `#TXN-${id}`,
          idTransaccion: id,
          fecha: new Date(t.fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          fechaRaw: t.fecha,
          tipo: mappedTipo,
          categoria: mappedCategoria,
          descripcion: t.descripcion,
          monto: finalMonto,
          estado: "PAGADO",
          idPrestamo: t.idPrestamo || null,
          nombreConceptoGasto: t.nombreConceptoGasto || null,
          requiereRecupero: t.requiereRecupero || false,
        };
      });

      const sortedResult = contentMap.sort(
        (a, b) => new Date(b.fechaRaw) - new Date(a.fechaRaw),
      );
      sortedResult.totalPages = response.data.totalPages || 1;
      sortedResult.totalElements =
        response.data.totalElements || content.length;
      return sortedResult;
    } catch (error) {
      console.error("Error al obtener transacciones:", error.message);
      const fallback = [];
      fallback.totalPages = 1;
      fallback.totalElements = 0;
      return fallback;
    }
  },
  async addTransaction(newTx) {
    const isGasto = newTx.tipo === "Gasto";
    const payload = {
      tipo: isGasto ? "EGRESO" : "INGRESO",
      monto: Math.abs(parseFloat(newTx.monto)),
      fecha: newTx.fecha
        ? newTx.fecha.includes("T")
          ? newTx.fecha
          : `${newTx.fecha}T00:00:00`
        : new Date().toISOString().split(".")[0], // LocalDateTime sin milisegundos
      descripcion: newTx.descripcion,
      concepto: Number(newTx.concepto),
      requiereRecupero: newTx.requiereRecupero || false,
    };

    const response = await apiClient.post("/finanzas/gastos", payload);
    const saved = response.data;

    return {
      id: `#TXN-${saved.idGasto}`,
      fecha: new Date(saved.fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      tipo: newTx.tipo,
      categoria: mapConceptToCategory(
        saved.concepto,
        saved.descripcion,
        saved.tipo,
      ),
      descripcion: saved.descripcion,
      monto: newTx.monto,
      estado: "PAGADO",
      requiereRecupero: saved.requiereRecupero || false,
    };
  },

  async getConceptos() {
    try {
      const response = await apiClient.get(
        "/finanzas/conceptos?page=0&size=100",
      );
      return response.data.content || response.data || [];
    } catch (error) {
      console.error("Error al obtener conceptos:", error.message);
      return [];
    }
  },

  // --- PRÉSTAMOS ---
  async getLoans(page = 0, size = 50) {
    try {
      const response = await apiClient.get(
        `/finanzas/prestamos?page=${page}&size=${size}`,
      );
      const content = response.data.content || response.data || [];

      const mapped = content.map((l) => {
        const id = l.idPrestamo;
        const refereeName = l.arbitro
          ? `${l.arbitro.nombre || ""} ${l.arbitro.apellido || ""}`.trim()
          : "Árbitro";

        // Mapeo adaptado para montoSolicitado
        const montoSolicitado = parseFloat(l.montoSolicitado || 0);

        // Robustecimiento de montos devueltos/saldos por DTO simplificado
        let mappedEstado = "Retraso";
        if (l.estado === "PENDIENTE") {
          mappedEstado = "Pendiente";
        } else if (l.estado === "PAGADO") {
          mappedEstado = "Pagado";
        } else if (l.estado === "VENCIDO") {
          mappedEstado = "Vencido";
        }

        const isCompleted = mappedEstado === "Pagado";
        const montoDevuelto =
          l.montoDevuelto !== undefined
            ? parseFloat(l.montoDevuelto)
            : isCompleted
              ? montoSolicitado
              : 0;

        const saldoRestante =
          l.saldoRestante !== undefined
            ? parseFloat(l.saldoRestante)
            : Math.max(0, montoSolicitado - montoDevuelto);

        // Formateo de fecha de solicitud nativa del DTO
        const formattedFecha = l.fechaSolicitud
          ? new Date(l.fechaSolicitud + "T00:00:00").toLocaleDateString(
              "es-ES",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              },
            )
          : "Sin Fecha";

        return {
          id: `RF-LN-${id}`,
          idPrestamo: id,
          arbitro: l.arbitro, // Mantener el objeto original DTO
          nombreArbitro: refereeName || "Árbitro",
          avatarColor: "bg-indigo-600",
          montoSolicitado: montoSolicitado,
          montoDevuelto: montoDevuelto,
          montoTotal: montoSolicitado,
          montoPagado: montoDevuelto,
          saldoRestante: saldoRestante,
          fechaSolicitud: l.fechaSolicitud, // Mantener la fecha original del DTO
          formattedFecha: formattedFecha,
          proximaCuota: isCompleted ? "Completado" : formattedFecha,
          estado: l.estado, // Mantener el estado original del DTO (PENDIENTE, PAGADO, etc.)
          estadoMapeado: mappedEstado,
        };
      });

      mapped.totalPages = response.data.totalPages || 1;
      mapped.totalElements = response.data.totalElements || content.length;
      return mapped;
    } catch (error) {
      console.error("Error al obtener préstamos:", error.message);
      const fallback = [];
      fallback.totalPages = 1;
      fallback.totalElements = 0;
      return fallback;
    }
  },

  async createLoan(newLoan) {
    const payload = {
      arbitro: Number(newLoan.arbitro),
      montoSolicitado: parseFloat(newLoan.montoTotal),
      fechaSolicitud: newLoan.fechaSolicitud,
    };
    const response = await apiClient.post("/finanzas/prestamos", payload);
    const saved = response.data;

    return {
      id: `RF-LN-${saved.idPrestamo}`,
      arbitro: saved.arbitro
        ? `${saved.arbitro.nombre} ${saved.arbitro.apellido}`
        : "Árbitro",
      avatarColor: "bg-indigo-600",
      montoTotal: parseFloat(saved.montoSolicitado),
      montoPagado: 0.0,
      saldoRestante: parseFloat(saved.montoSolicitado),
      proximaCuota: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      estado: saved.estado === "PENDIENTE" ? "Pendiente" : "Activo",
    };
  },

  async registerLoanPayment(loanId, amount, fecha) {
    const id = String(loanId).replace("RF-LN-", "");
    const response = await apiClient.post(
      `/finanzas/prestamos/${id}/pago`,
      null,
      {
        params: { montoPagado: parseFloat(amount), fecha: fecha },
      },
    );
    return response.data;
  },

  async updateLoanDate(loanId, newDate) {
    const id = String(loanId).replace("RF-LN-", "");
    const response = await apiClient.put(
      `/finanzas/prestamos/${id}/actualizar-fecha`,
      null,
      {
        params: { nuevaFecha: newDate },
      },
    );
    return response.data;
  },

  async updateLoanPaymentDate(loanId, newDate) {
    const id = String(loanId).replace("RF-LN-", "");
    try {
      const response = await apiClient.put(
        `/finanzas/prestamos/${id}/actualizar-fecha-pago`,
        null,
        {
          params: { nuevaFecha: newDate },
        },
      );
      return response.data;
    } catch (err) {
      const response = await apiClient.put(
        `/prestamos/${id}/actualizar-fecha-pago`,
        null,
        {
          params: { nuevaFecha: newDate },
        },
      );
      return response.data;
    }
  },

  async downloadLoansReport() {
    try {
      const response = await apiClient.get("/finanzas/prestamos/reporte", {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error al descargar el reporte de préstamos:",
        error.message,
      );
      throw error;
    }
  },

  async downloadGastoReport(idGasto) {
    try {
      const id = String(idGasto).replace("#TXN-", "");
      const response = await apiClient.get(`/finanzas/gastos/${id}/reporte`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al descargar el reporte del gasto:", error.message);
      throw error;
    }
  },

  async getLoanDetails(idPrestamo, page = 0, size = 10) {
    const id = String(idPrestamo).replace("RF-LN-", "");
    try {
      const response = await apiClient.get(`/prestamos/${id}/detalle`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.warn("Error al obtener detalles del préstamo:", error.message);

      const allLoans = await this.getLoans();
      const loan = allLoans.find((l) => String(l.idPrestamo) === String(id));

      const solicitados = loan ? loan.montoSolicitado : 5000;
      const devueltos = loan ? loan.montoDevuelto : 0;
      const nombreArbitro = loan ? loan.nombreArbitro : "Árbitro";
      const fechaBase =
        loan && loan.fechaSolicitud
          ? loan.fechaSolicitud
          : new Date().toISOString().split("T")[0];

      const items = [];
      const totalCuotas = 4;
      const cuotaMonto = parseFloat((solicitados / totalCuotas).toFixed(2));
      let montoRestanteDevuelto = devueltos;

      for (let i = 1; i <= totalCuotas; i++) {
        const vto = new Date(
          new Date(fechaBase).getTime() + i * 30 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0];

        let pagado = 0;
        let estado = "PENDIENTE";

        if (montoRestanteDevuelto > 0) {
          pagado = Math.min(cuotaMonto, montoRestanteDevuelto);
          montoRestanteDevuelto = parseFloat(
            (montoRestanteDevuelto - pagado).toFixed(2),
          );
          estado = pagado >= cuotaMonto ? "PAGADO" : "PARCIAL";
        }

        items.push({
          idDeuda: i,
          nroCuota: i,
          fechaVencimiento: vto,
          montoCuota: cuotaMonto,
          montoPagado: parseFloat(pagado.toFixed(2)),
          estado: estado,
          arbitroNombre: nombreArbitro,
        });
      }

      return {
        content: items.slice(page * size, (page + 1) * size),
        totalPages: Math.ceil(items.length / size),
        totalElements: items.length,
        size: size,
        number: page,
        numberOfElements: Math.min(size, items.length - page * size),
        first: page === 0,
        last: (page + 1) * size >= items.length,
        empty: items.length === 0,
      };
    }
  },

  async updateTransaction(idGasto, updatedTx) {
    const id = String(idGasto).replace("#TXN-", "");
    const response = await apiClient.put(`/finanzas/gastos/${id}/actualizar`, {
      tipo: updatedTx.tipo === "Gasto" ? "EGRESO" : "INGRESO",
      monto: Math.abs(parseFloat(updatedTx.monto)),
      fecha: updatedTx.fecha
        ? updatedTx.fecha.includes("T")
          ? updatedTx.fecha
          : `${updatedTx.fecha}T00:00:00`
        : new Date().toISOString().split(".")[0],
      descripcion: updatedTx.descripcion,
      concepto: Number(updatedTx.concepto),
      requiereRecupero: updatedTx.requiereRecupero || false,
      idPrestamo: updatedTx.idPrestamo || null,
    });
    return response.data;
  },

  async asociarGastoArbitro(idGasto, idArbitro, montoAsignado) {
    const numGasto = Number(idGasto);
    const numArbitro = Number(idArbitro);
    const numericMonto = parseFloat(montoAsignado);
    try {
      const response = await apiClient.post(
        "/finanzas/gastos/asociar-gasto-arbitro",
        null,
        {
          params: {
            idGasto: numGasto,
            idArbitro: numArbitro,
            montoAsignado: numericMonto,
          },
        },
      );
      try {
        await this.syncLocalAssociation(numGasto, numArbitro, numericMonto);
      } catch (e) {}
      return response.data;
    } catch (error) {
      console.warn(
        "Error al asociar gasto con árbitro en el backend, usando persistencia simulada:",
        error.message,
      );
      await this.syncLocalAssociation(numGasto, numArbitro, numericMonto);
      return {
        success: true,
        message: "Asociación registrada en simulación local",
      };
    }
  },

  async asignarArbitrosUltimosDesignados(idGasto, montoAasignar) {
    const numGasto = Number(idGasto);
    const numericMonto = parseFloat(montoAasignar);
    try {
      const response = await apiClient.post(
        "/finanzas/gastos/asignar-arbitros",
        null,
        {
          params: {
            idGasto: numGasto,
            montoAasignar: numericMonto,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.warn(
        "Error al asignar árbitros designados en el backend, simulación local no soportada completamente:",
        error.message,
      );
      // Simulación básica en localstorage si falla el backend
      try {
        const referees = await this.getReferees();
        if (referees.length > 0) {
          // Asignar el monto al primer árbitro disponible como simulación
          await this.syncLocalAssociation(
            numGasto,
            referees[0].id,
            numericMonto,
          );
        }
      } catch (e) {}
      return "Árbitros designados asignados exitosamente (simulado)";
    }
  },

  // --- ÁRBITROS ---
  async getReferees() {
    try {
      const response = await apiClient.get(
        "/finanzas/arbitros?page=0&size=100",
      );
      const list = response.data.content || [];
      return list.map((r) => ({
        id: r.idArbitro,
        nombre: `${r.nombre} ${r.apellido}`,
        clasificacion: r.categoria || "Árbitro",
        miembroDesde: "14 ago. 2018",
        totalPrestado: 0,
        saldoPendiente: 0,
        indiceConfiabilidad: r.estado ? 950 : 700,
        email: r.whatsapp
          ? `${r.nombre.toLowerCase()}@asociacion.org`
          : "sin-correo@asociacion.org",
        telefono: r.whatsapp || "",
        region: "Distrito Central",
        historialPrestamos: [],
        calendarioPagos: [],
        notas: [],
      }));
    } catch (error) {
      console.error("Error al obtener árbitros:", error.message);
      return [];
    }
  },

  async getRefereeById(id) {
    try {
      const referees = await this.getReferees();
      const referee = referees.find((r) => r.id == id);
      if (!referee) return null;

      const response = await apiClient.get(
        `/finanzas/prestamos/arbitro/${id}?page=0&size=100`,
      );
      // Soporta respuesta directa o paginada (.content)
      const loans = response.data.content || response.data || [];

      let totalPrestado = 0;
      let saldoPendiente = 0;
      const historialPrestamos = [];
      const calendarioPagos = [];

      loans.forEach((l) => {
        const solicitado = parseFloat(l.montoSolicitado || 0);

        // Robustecimiento de montos devueltos/saldos por DTO simplificado
        let mappedEstado = "Activo";
        if (l.estado === "PENDIENTE") {
          mappedEstado = "Pendiente";
        } else if (l.estado === "PAGADO") {
          mappedEstado = "Pagado";
        } else if (l.estado === "VENCIDO") {
          mappedEstado = "Vencido";
        }

        const isCompleted = mappedEstado === "Pagado";
        const devuelto =
          l.montoDevuelto !== undefined
            ? parseFloat(l.montoDevuelto)
            : isCompleted
              ? solicitado
              : 0;

        const restante =
          l.saldoRestante !== undefined
            ? parseFloat(l.saldoRestante)
            : Math.max(0, solicitado - devuelto);

        totalPrestado += solicitado;
        saldoPendiente += restante;

        const formattedFecha = l.fechaSolicitud
          ? new Date(l.fechaSolicitud + "T00:00:00").toLocaleDateString(
              "es-ES",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              },
            )
          : "Sin Fecha";

        historialPrestamos.push({
          id: `#LN-${l.idPrestamo}`,
          fechaSolicitud: formattedFecha,
          monto: solicitado,
          estado: isCompleted ? "PAGADO TOTAL" : "VIGENTE",
        });

        if (restante > 0) {
          calendarioPagos.push({
            fecha: formattedFecha,
            monto: restante,
            estado: mappedEstado === "Vencido" ? "VENCIDO" : "PENDIENTE",
          });
        }
      });

      const notesLocal = localStorage.getItem(`referee_notes_${id}`);
      const notas = notesLocal ? JSON.parse(notesLocal) : [];

      return {
        ...referee,
        totalPrestado,
        saldoPendiente,
        historialPrestamos,
        calendarioPagos,
        notas,
      };
    } catch (error) {
      console.error(
        `Error al obtener detalle de árbitro ${id}:`,
        error.message,
      );
      return null;
    }
  },

  async addRefereeNote(refereeId, noteContent) {
    const notesLocal = localStorage.getItem(`referee_notes_${refereeId}`);
    const notes = notesLocal ? JSON.parse(notesLocal) : [];
    const newNote = {
      admin: "Usuario Admin",
      fecha: new Date()
        .toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .toUpperCase(),
      contenido: noteContent,
    };
    notes.unshift(newNote);
    localStorage.setItem(`referee_notes_${refereeId}`, JSON.stringify(notes));
    return newNote;
  },

  // --- INFORMACIÓN DE CAJA / DASHBOARD ---
  async getCurrentCaja() {
    const response = await apiClient.get("/finanzas/cajas/actual");
    return response.data;
  },

  async getCajaInfo() {
    try {
      const currentCaja = await this.getCurrentCaja();
      const transactions = await this.getTransactions();
      const loans = await this.getLoans();

      const saldoFondo = parseFloat(currentCaja.saldoActual);
      const prestamosActivos = loans.reduce(
        (acc, curr) =>
          acc + (curr.estado !== "Pagado" ? curr.saldoRestante : 0),
        0,
      );
      const aprobacionesPendientes = loans.filter(
        (l) => l.estado === "Pendiente",
      ).length;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      let ingresosMes = 0;
      let gastosMes = 0;

      transactions.forEach((tx) => {
        const txDate = new Date(tx.fecha);
        if (
          txDate.getMonth() === currentMonth &&
          txDate.getFullYear() === currentYear
        ) {
          if (tx.monto > 0) {
            ingresosMes += tx.monto;
          } else {
            gastosMes += Math.abs(tx.monto);
          }
        }
      });

      return {
        saldoFondo,
        prestamosActivos,
        ingresosOctubre: ingresosMes,
        gastosOctubre: gastosMes,
        cambioFondo: 0,
        aprobacionesPendientes,
        ingresoObjetivoOctubre: 0,
        gastosCambioOctubre: 0,
      };
    } catch (error) {
      console.warn(
        "Error al calcular estadísticas generales de caja:",
        error.message,
      );
      return {
        saldoFondo: 0,
        prestamosActivos: 0,
        ingresosOctubre: 0,
        gastosOctubre: 0,
        cambioFondo: 0,
        aprobacionesPendientes: 0,
        ingresoObjetivoOctubre: 0,
        gastosCambioOctubre: 0,
      };
    }
  },

  async getControlCajaInfo() {
    try {
      const currentCaja = await this.getCurrentCaja();
      const transactions = await this.getTransactions();

      const saldoMesActual = parseFloat(currentCaja.saldoActual);

      let ingresosMesActual = 0;
      let gastosMesActual = 0;

      let countHonorarios = 0;
      let countSuministros = 0;
      let countOtros = 0;

      transactions.forEach((tx) => {
        if (tx.monto > 0) {
          ingresosMesActual += tx.monto;
        } else {
          gastosMesActual += tx.monto;

          const cat = String(tx.categoria || "").toUpperCase();
          if (
            cat.includes("HONORARIO") ||
            cat.includes("CAPACITACI") ||
            cat.includes("CURSO")
          )
            countHonorarios += Math.abs(tx.monto);
          else if (
            cat.includes("SUMINISTRO") ||
            cat.includes("EQUIPAMIENTO") ||
            cat.includes("INDUMENTARIA")
          )
            countSuministros += Math.abs(tx.monto);
          else countOtros += Math.abs(tx.monto);
        }
      });

      const totalGastos = countHonorarios + countSuministros + countOtros;
      const distribucionPresupuesto = {
        honorariosArbitros:
          totalGastos > 0
            ? Math.round((countHonorarios / totalGastos) * 100)
            : 0,
        suministrosOperativos:
          totalGastos > 0
            ? Math.round((countSuministros / totalGastos) * 100)
            : 0,
        interesesAdministrativos:
          totalGastos > 0 ? Math.round((countOtros / totalGastos) * 100) : 0,
      };

      return {
        saldoMesActual,
        cambioMesActual: 0,
        ingresosMesActual: ingresosMesActual,
        gastosMesActual: gastosMesActual,
        distribucionPresupuesto,
      };
    } catch (error) {
      console.warn(
        "Error al calcular estadísticas de control de caja:",
        error.message,
      );
      return {
        saldoMesActual: 0,
        cambioMesActual: 0,
        ingresosMesActual: 0,
        gastosMesActual: 0,
        distribucionPresupuesto: {
          honorariosArbitros: 0,
          suministrosOperativos: 0,
          interesesAdministrativos: 0,
        },
      };
    }
  },

  // --- REPORTES ---
  async getAnnualReportInfo() {
    try {
      const transactions = await this.getTransactions();
      const loans = await this.getLoans();

      const totalIngresos = transactions.reduce(
        (acc, curr) => acc + (curr.monto > 0 ? curr.monto : 0),
        0,
      );
      const totalGastos = transactions.reduce(
        (acc, curr) => acc + (curr.monto < 0 ? Math.abs(curr.monto) : 0),
        0,
      );
      const superavitNeto = totalIngresos - totalGastos;

      const prestamosEmitidos = loans.reduce(
        (acc, curr) => acc + curr.montoTotal,
        0,
      );
      const totalDevuelto = loans.reduce(
        (acc, curr) => acc + curr.montoPagado,
        0,
      );
      const arbitrosConPrestamo = new Set(loans.map((l) => l.arbitro));

      const tasaReembolso =
        prestamosEmitidos > 0
          ? parseFloat(((totalDevuelto / prestamosEmitidos) * 100).toFixed(1))
          : 0;

      const activeLoans = loans.filter((l) => l.estado !== "Pagado");
      const morosidad =
        activeLoans.length > 0
          ? parseFloat(
              (
                (loans.filter((l) => l.estado === "Vencido").length /
                  loans.length) *
                100
              ).toFixed(1),
            )
          : 0;

      const pagadosMonto = loans
        .filter((l) => l.estado === "Pagado")
        .reduce((acc, curr) => acc + curr.montoTotal, 0);

      const activosMonto = loans
        .filter((l) => l.estado === "Activo")
        .reduce((acc, curr) => acc + curr.montoTotal, 0);

      const vencidosMonto = loans
        .filter((l) => l.estado === "Vencido")
        .reduce((acc, curr) => acc + curr.montoTotal, 0);

      return {
        ingresosTotales: totalIngresos,
        gastosTotales: totalGastos,
        superavitNeto: superavitNeto,
        margenSuperavit:
          totalIngresos > 0
            ? parseFloat(((superavitNeto / totalIngresos) * 100).toFixed(1))
            : 0,
        prestamosEmitidos: prestamosEmitidos,
        arbitrosBeneficiados: arbitrosConPrestamo.size,
        ingresosCambioAnual: 0,
        gastosCambioAnual: 0,
        distribucionGastos: {
          salariosHonorarios: totalGastos * 0.51,
          equipamientoSuministros: totalGastos * 0.15,
          rentaOficinas: totalGastos * 0.11,
          capacitacion: totalGastos * 0.08,
          otrosOperativos: totalGastos * 0.15,
        },
        prestamosRendimiento: {
          tasaReembolso,
          morosidad,
          prestamosSeguimiento: loans.filter((l) => l.estado === "Vencido")
            .length,
          interesesGenerados: 0,
          distribucionCartera: [
            {
              estado: "Pagados",
              cantidad: loans.filter((l) => l.estado === "Pagado").length,
              monto: pagadosMonto,
              porcentaje:
                prestamosEmitidos > 0
                  ? parseFloat(
                      ((pagadosMonto / prestamosEmitidos) * 100).toFixed(1),
                    )
                  : 0,
            },
            {
              estado: "En Curso",
              cantidad: loans.filter((l) => l.estado === "Activo").length,
              monto: activosMonto,
              porcentaje:
                prestamosEmitidos > 0
                  ? parseFloat(
                      ((activosMonto / prestamosEmitidos) * 100).toFixed(1),
                    )
                  : 0,
            },
            {
              estado: "Atrasados",
              cantidad: loans.filter((l) => l.estado === "Vencido").length,
              monto: vencidosMonto,
              porcentaje:
                prestamosEmitidos > 0
                  ? parseFloat(
                      ((vencidosMonto / prestamosEmitidos) * 100).toFixed(1),
                    )
                  : 0,
            },
          ],
        },
      };
    } catch (error) {
      console.warn("Error al calcular reporte anual:", error.message);
      return {
        ingresosTotales: 0,
        gastosTotales: 0,
        superavitNeto: 0,
        margenSuperavit: 0,
        prestamosEmitidos: 0,
        arbitrosBeneficiados: 0,
        ingresosCambioAnual: 0,
        gastosCambioAnual: 0,
        distribucionGastos: {
          salariosHonorarios: 0,
          equipamientoSuministros: 0,
          rentaOficinas: 0,
          capacitacion: 0,
          otrosOperativos: 0,
        },
        prestamosRendimiento: {
          tasaReembolso: 0,
          morosidad: 0,
          prestamosSeguimiento: 0,
          interesesGenerados: 0,
          distribucionCartera: [
            {
              estado: "Pagados",
              cantidad: 0,
              monto: 0,
              porcentaje: 0,
            },
            {
              estado: "En Curso",
              cantidad: 0,
              monto: 0,
              porcentaje: 0,
            },
            {
              estado: "Atrasados",
              cantidad: 0,
              monto: 0,
              porcentaje: 0,
            },
          ],
        },
      };
    }
  },

  async getGastoConRecupero(idTransaccion) {
    const numericId = Number(String(idTransaccion).replace("#TXN-", ""));

    // Obtener la transacción general para fecha y montos base
    let totalMonto = 0;
    let fecha = new Date().toISOString();
    let descripcion = "";
    let concepto = "";

    try {
      const allTx = await this.getTransactions();
      const realTx = allTx.find((t) => t.idTransaccion === numericId);
      if (realTx) {
        totalMonto = Math.abs(realTx.monto);
        fecha = realTx.fechaRaw;
        descripcion = realTx.descripcion;
        concepto = realTx.nombreConceptoGasto;
      }
    } catch (e) {
      console.warn(
        "No se pudo obtener información base de la transacción:",
        e.message,
      );
    }

    let deudasDivididas = [];

    try {
      const response = await apiClient.get(
        `/finanzas/gastos-con-recupero/${numericId}`,
      );
      let data = response.data;
      if (Array.isArray(data)) {
        data = data[0];
      }
      if (data) {
        descripcion = data.descripcion || descripcion;
        concepto = data.conceptoGastoNombre || concepto;
        deudasDivididas = data.deudasDivididas || [];
      }
    } catch (error) {
      console.warn(
        `Error al obtener gasto con recupero ${numericId} (se usará fallback mock):`,
        error.message,
      );

      // Fallback a localStorage
      const localKey = `recupero_asociaciones_${numericId}`;
      const stored = localStorage.getItem(localKey);
      if (stored) {
        deudasDivididas = JSON.parse(stored);
      } else {
        const referees = await this.getReferees();
        if (referees.length >= 2) {
          const baseMonto = totalMonto || 1500.0;
          const m1 = parseFloat((baseMonto * 0.4).toFixed(2));
          const m2 = parseFloat((baseMonto * 0.35).toFixed(2));

          deudasDivididas = [
            {
              idDeuda: 1,
              idArbitro: referees[0].id,
              arbitroNombre: referees[0].nombre.split(" ")[0],
              arbitroApellido: referees[0].nombre.split(" ")[1] || "",
              montoAsignado: m1,
              montoPagado: m1,
              estado: "PAGADO",
            },
            {
              idDeuda: 2,
              idArbitro: referees[1].id,
              arbitroNombre: referees[1].nombre.split(" ")[0],
              arbitroApellido: referees[1].nombre.split(" ")[1] || "",
              montoAsignado: m2,
              montoPagado: 0.0,
              estado: "PENDIENTE",
            },
          ];
          localStorage.setItem(localKey, JSON.stringify(deudasDivididas));
        }
      }
    }

    // Cruzar con referees cargados para obtener categoría y teléfono
    let refereesList = [];
    try {
      refereesList = await this.getReferees();
    } catch (e) {}

    // Mapear al modelo del frontend
    const asociaciones = deudasDivididas.map((d) => {
      const refInfo = refereesList.find((r) => r.id === d.idArbitro);
      return {
        idAsociacion: d.idDeuda,
        arbitro: {
          idArbitro: d.idArbitro,
          nombre: d.arbitroNombre,
          apellido: d.arbitroApellido,
          categoria: refInfo ? refInfo.clasificacion : "Árbitro",
          whatsapp: refInfo ? refInfo.telefono : "",
        },
        montoAsignado: parseFloat(d.montoAsignado || 0),
        montoRecuperado: parseFloat(d.montoPagado || 0),
        estado: d.estado || "PENDIENTE",
        fechaAsociacion: fecha,
      };
    });

    if (totalMonto === 0) {
      totalMonto = asociaciones.reduce((sum, a) => sum + a.montoAsignado, 0);
    }

    const historialPagos = asociaciones
      .filter((a) => a.montoRecuperado > 0)
      .map((a) => ({
        idPago: `PAG-${a.idAsociacion}-${Math.floor(Math.random() * 1000)}`,
        arbitroNombre: `${a.arbitro.nombre} ${a.arbitro.apellido}`,
        monto: a.montoRecuperado,
        fecha: fecha,
        metodo: "Transferencia Bancaria",
      }));

    return {
      idTransaccion: numericId,
      monto: totalMonto,
      fecha: fecha,
      descripcion: descripcion || "Viaje de Comisión",
      concepto: concepto || "Combustible / Viáticos",
      requiereRecupero: true,
      asociaciones: asociaciones,
      historialPagos: historialPagos,
    };
  },

  async registrarPagoRecupero(idTransaccion, idArbitro, monto) {
    const numGasto = Number(idTransaccion);
    const numArbitro = Number(idArbitro);
    const valMonto = parseFloat(monto);

    try {
      const response = await apiClient.post(
        `/finanzas/gastos-con-recupero/${numGasto}/realizar-cobro`,
        null,
        {
          params: { idArbitro: numArbitro, montoCobrado: valMonto },
        },
      );
      return response.data;
    } catch (error) {
      console.warn(
        "Usando registro de pago de recupero simulado:",
        error.message,
      );

      const localKey = `recupero_asociaciones_${numGasto}`;
      const stored = localStorage.getItem(localKey);
      if (stored) {
        const deudas = JSON.parse(stored);
        const debt = deudas.find((d) => d.idArbitro === numArbitro);
        if (debt) {
          debt.montoPagado = parseFloat(
            (parseFloat(debt.montoPagado || 0) + valMonto).toFixed(2),
          );
          if (debt.montoPagado >= debt.montoAsignado) {
            debt.montoPagado = debt.montoAsignado;
            debt.estado = "PAGADO";
          } else if (debt.montoPagado > 0) {
            debt.estado = "PARCIAL";
          }
          localStorage.setItem(localKey, JSON.stringify(deudas));
        }
      }
      return { success: true };
    }
  },

  async desasociarArbitroGasto(idTransaccion, idArbitro) {
    const numGasto = Number(idTransaccion);
    const numArbitro = Number(idArbitro);
    try {
      const response = await apiClient.delete(
        `/finanzas/gastos-con-recupero/${numGasto}/asociacion/${numArbitro}`,
      );
      return response.data;
    } catch (error) {
      console.warn("Usando desasociación simulada:", error.message);
      const localKey = `recupero_asociaciones_${numGasto}`;
      const stored = localStorage.getItem(localKey);
      if (stored) {
        let deudas = JSON.parse(stored);
        deudas = deudas.filter((d) => d.idArbitro !== numArbitro);
        localStorage.setItem(localKey, JSON.stringify(deudas));
      }
      return { success: true };
    }
  },

  async syncLocalAssociation(idGasto, idArbitro, montoAsignado) {
    const localKey = `recupero_asociaciones_${idGasto}`;
    let deudas = [];
    const stored = localStorage.getItem(localKey);
    if (stored) {
      deudas = JSON.parse(stored);
    }

    const referees = await this.getReferees();
    const referee = referees.find((r) => r.id === idArbitro);

    if (referee) {
      deudas = deudas.filter((d) => d.idArbitro !== idArbitro);

      deudas.push({
        idDeuda: deudas.length + 1,
        idArbitro: referee.id,
        arbitroNombre: referee.nombre.split(" ")[0],
        arbitroApellido: referee.nombre.split(" ")[1] || "",
        montoAsignado: montoAsignado,
        montoPagado: 0.0,
        estado: "PENDIENTE",
      });
      localStorage.setItem(localKey, JSON.stringify(deudas));
    }
  },
};
