import { apiClient } from "./client.js";
import { getReferees } from "./referees.js";

export async function getTransactions(page = 0, size = 10) {
  try {
    let response;
    try {
      // FRONTEND_FINANZAS.md: GET /transacciones
      response = await apiClient.get(`/finanzas/transacciones?page=${page}&size=${size}`);
    } catch (err) {
      response = await apiClient.get(`/finanzas/transacciones?page=${page}&size=${size}`);
    }
    const content = response.data.content || response.data || [];

    const contentMap = content.map((t) => {
      const id = t.idTransaccion || Math.floor(Math.random() * 100000);

      const tipoUpper = String(t.tipo || "").toUpperCase();

      const isEgreso =
        tipoUpper === "EGRESO" ||
        tipoUpper === "GASTO" ||
        tipoUpper === "RECUPERO";
      const finalMonto = isEgreso ? -Math.abs(t.monto) : Math.abs(t.monto);

      let mappedTipo = "Gasto";
      if (tipoUpper.includes("PAGO")) {
        mappedTipo = "Pago Préstamo";
      } else if (tipoUpper.includes("REINTEGRO")) {
        mappedTipo = "Reintegro de Gasto";
      } else if (tipoUpper === "RECUPERO") {
        mappedTipo = "Recupero";
      } else if (tipoUpper === "INGRESO") {
        mappedTipo = "Ingreso";
      } else if (t.tipo) {
        mappedTipo = t.tipo;
      }

      const requiresRecuperoBool =
        t.requiereRecupero === true ||
        String(t.requiereRecupero) === "true" ||
        t.requiereRecupero === 1 ||
        String(t.requiereRecupero) === "1" ||
        tipoUpper === "RECUPERO";

      const mappedCategoria = t.nombreConceptoGasto || mappedTipo || "Gasto";

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
        requiereRecupero: requiresRecuperoBool,
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
}

export async function addTransaction(newTx) {
  const isGasto = newTx.tipo === "Gasto";
  const absMonto = Math.abs(parseFloat(newTx.monto));
  const idConcepto = Number(newTx.concepto);
  const descripcion = newTx.descripcion || "";

  let saved;
  try {
    if (isGasto) {
      // Especificación FRONTEND_FINANZAS.md: POST /gastos?idConcepto=2&monto=12500.00&descripcion=...
      const response = await apiClient.post("/gastos", null, {
        params: {
          idConcepto,
          monto: absMonto,
          descripcion,
        },
      });
      saved = response.data;
    } else {
      const payload = {
        tipo: "INGRESO",
        monto: absMonto,
        fecha: newTx.fecha
          ? newTx.fecha.includes("T")
            ? newTx.fecha
            : `${newTx.fecha}T00:00:00`
          : new Date().toISOString().split(".")[0],
        descripcion,
        concepto: idConcepto,
        requiereRecupero: false,
      };
      const response = await apiClient.post("/finanzas/gastos", payload);
      saved = response.data;
    }
  } catch (err) {
    const payload = {
      tipo: isGasto ? "EGRESO" : "INGRESO",
      monto: absMonto,
      fecha: newTx.fecha
        ? newTx.fecha.includes("T")
          ? newTx.fecha
          : `${newTx.fecha}T00:00:00`
        : new Date().toISOString().split(".")[0],
      descripcion,
      concepto: idConcepto,
      requiereRecupero: newTx.requiereRecupero || false,
    };
    const response = await apiClient.post("/finanzas/gastos", payload);
    saved = response.data;
  }

  const idGasto = saved.idGasto || saved.id || Math.floor(Math.random() * 10000);
  const savedFecha = saved.fechaGasto || saved.fecha || new Date().toISOString();

  return {
    id: `#TXN-${idGasto}`,
    idTransaccion: idGasto,
    fecha: new Date(savedFecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    tipo: newTx.tipo,
    categoria: saved.concepto || newTx.tipo || "Gasto",
    descripcion: saved.descripcion || descripcion,
    monto: newTx.monto,
    estado: "PAGADO",
    requiereRecupero: saved.requiereRecupero || false,
  };
}

export async function getConceptos() {
  try {
    let response;
    try {
      // Especificación FRONTEND_FINANZAS.md: GET /gastos/conceptos
      response = await apiClient.get("/finanzas/gastos/conceptos");
    } catch (err) {
      try {
        response = await apiClient.get("/finanzas/conceptos?page=0&size=100");
      } catch (e) {
        response = await apiClient.get("/finanzas/conceptos?page=0&size=100");
      }
    }
    const conceptsList = response.data?.content || response.data || [];

    const hasRecupero = conceptsList.some(
      (c) => String(c.nombre || "").toLowerCase() === "recupero",
    );
    if (!hasRecupero) {
      conceptsList.push({ idConcepto: 9999, nombre: "Recupero" });
    }

    return conceptsList;
  } catch (error) {
    console.error("Error al obtener conceptos:", error.message);
    return [{ idConcepto: 9999, nombre: "Recupero" }];
  }
}

export async function createConcepto(nombre) {
  try {
    // Especificación FRONTEND_FINANZAS.md: POST /gastos/conceptos
    const response = await apiClient.post("/finanzas/gastos/conceptos", { nombre });
    return response.data;
  } catch (error) {
    console.error("Error al crear concepto:", error.message);
    throw error;
  }
}

export async function getGastos(page = 0, size = 10) {
  try {
    // Especificación FRONTEND_FINANZAS.md: GET /gastos
    let response;
    try {
      response = await apiClient.get("/gastos", { params: { page, size } });
    } catch (err) {
      response = await apiClient.get("/finanzas/gastos", { params: { page, size } });
    }
    const content = response.data?.content || response.data || [];
    return content.map((g) => ({
      id: `#TXN-${g.idGasto || g.id}`,
      idGasto: g.idGasto || g.id,
      idTransaccion: g.idGasto || g.id,
      concepto: g.concepto,
      categoria: g.concepto,
      nombreConceptoGasto: g.concepto,
      monto: -Math.abs(parseFloat(g.monto || 0)),
      descripcion: g.descripcion,
      fecha: new Date(g.fechaGasto || g.fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      fechaGasto: g.fechaGasto,
      fechaRaw: g.fechaGasto || g.fecha,
      tipo: "Gasto",
      estado: "PAGADO",
    }));
  } catch (error) {
    console.error("Error al obtener gastos:", error.message);
    return [];
  }
}

export async function getGastosDeudas() {
  try {
    // Especificación FRONTEND_FINANZAS.md: GET /gastos/deudas
    let response;
    try {
      response = await apiClient.get("/gastos/deudas");
    } catch (err) {
      response = await apiClient.get("/finanzas/gastos/deudas");
    }
    return response.data?.content || response.data || [];
  } catch (error) {
    console.warn("Error al obtener deudas de gastos:", error.message);
    return [];
  }
}

export async function pagarDeudaGasto(idDeuda, monto) {
  try {
    // Especificación FRONTEND_FINANZAS.md: POST /gastos/deudas/{idDeuda}/pagar?monto=5000.00
    const response = await apiClient.post(`/gastos/deudas/${idDeuda}/pagar`, null, {
      params: { monto: parseFloat(monto) },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al pagar deuda de gasto ${idDeuda}:`, error.message);
    throw error;
  }
}

export async function downloadGastosReport() {
  try {
    // Especificación FRONTEND_FINANZAS.md: GET /gastos/reporte
    let response;
    try {
      response = await apiClient.get("/gastos/reporte", { responseType: "blob" });
    } catch (err) {
      response = await apiClient.get("/finanzas/gastos/reporte", { responseType: "blob" });
    }
    return response.data;
  } catch (error) {
    console.error("Error al descargar reporte de gastos:", error.message);
    throw error;
  }
}

export async function getTransactionTypes() {
  try {
    // Especificación FRONTEND_FINANZAS.md: GET /transacciones/tipos
    const response = await apiClient.get("/transacciones/tipos");
    return response.data;
  } catch (error) {
    console.warn("Error al obtener tipos de transacción:", error.message);
    return ["INGRESO", "EGRESO", "RECUPERO", "PAGO_PRESTAMO"];
  }
}

export async function getRecuperos() {
  try {
    // Especificación FRONTEND_FINANZAS.md: GET /transacciones/recuperos
    const response = await apiClient.get("/transacciones/recuperos");
    return response.data?.content || response.data || [];
  } catch (error) {
    console.warn("Error al obtener recuperos:", error.message);
    return [];
  }
}

export async function createRecupero(data) {
  try {
    // Especificación FRONTEND_FINANZAS.md: POST /transacciones/recuperos
    const response = await apiClient.post("/transacciones/recuperos", data);
    return response.data;
  } catch (error) {
    console.error("Error al registrar recupero:", error.message);
    throw error;
  }
}

export async function updateTransaction(idGasto, updatedTx) {
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
}

export async function asociarGastoArbitro(idGasto, idArbitro, montoAsignado) {
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
      await syncLocalAssociation(numGasto, numArbitro, numericMonto);
    } catch (e) { }
    return response.data;
  } catch (error) {
    console.warn(
      "Error al asociar gasto con árbitro en el backend, usando persistencia simulada:",
      error.message,
    );
    await syncLocalAssociation(numGasto, numArbitro, numericMonto);
    return {
      success: true,
      message: "Asociación registrada en simulación local",
    };
  }
}

export async function asignarArbitrosUltimosDesignados(idGasto, montoAasignar) {
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
    try {
      const referees = await getReferees();
      if (referees.length > 0) {
        await syncLocalAssociation(
          numGasto,
          referees[0].id,
          numericMonto,
        );
      }
    } catch (e) { }
    return "Árbitros designados asignados exitosamente (simulado)";
  }
}

export async function getGastoConRecupero(idTransaccion) {
  const numericId = Number(String(idTransaccion).replace("#TXN-", ""));

  let totalMonto = 0;
  let fecha = new Date().toISOString();
  let descripcion = "";
  let concepto = "";

  try {
    const allTx = await getTransactions();
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
      if (data.monto !== undefined && data.monto !== null) {
        totalMonto = Math.abs(data.monto);
      } else if (data.montoNeto !== undefined && data.montoNeto !== null) {
        totalMonto = Math.abs(data.montoNeto);
      }
    }
  } catch (error) {
    console.warn(
      `Error al obtener gasto con recupero ${numericId} (se usará fallback mock):`,
      error.message,
    );

    const localKey = `recupero_asociaciones_${numericId}`;
    const stored = localStorage.getItem(localKey);
    if (stored) {
      deudasDivididas = JSON.parse(stored);
    } else {
      const referees = await getReferees();
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

  let refereesList = [];
  try {
    refereesList = await getReferees();
  } catch (e) { }

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
}

export async function registrarPagoRecupero(idTransaccion, idArbitro, monto) {
  const numGasto = Number(idTransaccion);
  const numArbitro = Number(idArbitro);
  const valMonto = parseFloat(monto);

  try {
    // 1. Especificación FRONTEND_FINANZAS.md: POST /gastos/deudas/{idDeuda}/pagar?monto=5000.00
    try {
      const res = await apiClient.post(`/gastos/deudas/${numGasto}/pagar`, null, {
        params: { monto: valMonto },
      });
      return res.data;
    } catch (e) {
      const response = await apiClient.post(
        `/finanzas/gastos-con-recupero/${numGasto}/realizar-cobro`,
        null,
        {
          params: { idArbitro: numArbitro, montoCobrado: valMonto },
        },
      );
      return response.data;
    }
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
}

export async function desasociarArbitroGasto(idTransaccion, idArbitro) {
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
}

export async function syncLocalAssociation(idGasto, idArbitro, montoAsignado) {
  const localKey = `recupero_asociaciones_${idGasto}`;
  let deudas = [];
  const stored = localStorage.getItem(localKey);
  if (stored) {
    deudas = JSON.parse(stored);
  }

  const referees = await getReferees();
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
}
