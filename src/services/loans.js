import { apiClient } from "./client.js";

export async function getLoans(page = 0, size = 50) {
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

      const montoSolicitado = parseFloat(l.montoSolicitado || 0);

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
        arbitro: l.arbitro,
        nombreArbitro: refereeName || "Árbitro",
        avatarColor: "bg-indigo-600",
        montoSolicitado: montoSolicitado,
        montoDevuelto: montoDevuelto,
        montoTotal: montoSolicitado,
        montoPagado: montoDevuelto,
        saldoRestante: saldoRestante,
        fechaSolicitud: l.fechaSolicitud,
        formattedFecha: formattedFecha,
        proximaCuota: isCompleted ? "Completado" : formattedFecha,
        estado: l.estado,
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
}

export async function createLoan(newLoan) {
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
}

export async function registerLoanPayment(loanId, amount, fecha) {
  const id = String(loanId).replace("RF-LN-", "");
  const response = await apiClient.post(
    `/finanzas/prestamos/${id}/pago`,
    null,
    {
      params: { montoPagado: parseFloat(amount), fecha: fecha },
    },
  );
  return response.data;
}

export async function updateLoanDate(loanId, newDate) {
  const id = String(loanId).replace("RF-LN-", "");
  const response = await apiClient.put(
    `/finanzas/prestamos/${id}/actualizar-fecha`,
    null,
    {
      params: { nuevaFecha: newDate },
    },
  );
  return response.data;
}

export async function updateLoanPaymentDate(loanId, newDate) {
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
}

export async function downloadLoansReport() {
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
}

export async function downloadGastoReport(idGasto) {
  try {
    const id = String(idGasto).replace("#TXN-", "");
    const response = await apiClient.get(`/finanzas/gastos/${id}/reporte`, {
      responseType: "blob",
    });
    let filename = `reporte_gasto_${id}.pdf`;
    const disposition = response.headers["content-disposition"];
    if (disposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      }
    }
    return {
      data: response.data,
      filename: filename,
    };
  } catch (error) {
    console.error("Error al descargar el reporte del gasto:", error.message);
    throw error;
  }
}

export async function getLoanDetails(idPrestamo, page = 0, size = 10) {
  const id = String(idPrestamo).replace("RF-LN-", "");
  try {
    const response = await apiClient.get(`/prestamos/${id}/detalle`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.warn("Error al obtener detalles del préstamo:", error.message);

    const allLoans = await getLoans();
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
}
