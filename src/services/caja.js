import { apiClient } from "./client.js";
import { getTransactions, getConceptos } from "./transactions.js";
import { getLoans } from "./loans.js";

export async function getCurrentCaja() {
  const response = await apiClient.get("/finanzas/cajas/actual");
  return response.data;
}

export async function getCajaInfo() {
  try {
    const currentCaja = await getCurrentCaja();
    const transactions = await getTransactions();
    const loans = await getLoans();

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
}

export async function getControlCajaInfo(month, year) {
  try {
    const currentCaja = await getCurrentCaja();
    const transactions = await getTransactions(0, 1000);
    const concepts = await getConceptos();

    const saldoMesActual = parseFloat(currentCaja.saldoActual);

    const targetMonth = month !== undefined ? Number(month) : new Date().getMonth();
    const targetYear = year !== undefined ? Number(year) : new Date().getFullYear();

    let ingresosMesActual = 0;
    let gastosMesActual = 0;

    // Inicializar los gastos por cada concepto de la API en 0
    const conceptExpenses = {};
    concepts.forEach((c) => {
      if (c.nombre) {
        conceptExpenses[c.nombre] = 0;
      }
    });

    transactions.forEach((tx) => {
      const txDate = tx.fechaRaw ? new Date(tx.fechaRaw) : new Date(tx.fecha);
      if (
        !isNaN(txDate.getTime()) &&
        txDate.getMonth() === targetMonth &&
        txDate.getFullYear() === targetYear
      ) {
        if (tx.monto > 0) {
          ingresosMesActual += tx.monto;
        } else {
          const absMonto = Math.abs(tx.monto);
          gastosMesActual += absMonto;

          const conceptName = tx.nombreConceptoGasto || tx.categoria || "Otros";
          
          // Buscar coincidencia en la lista de conceptos de la API
          const matchedConcept = concepts.find(
            (c) =>
              String(c.nombre || "").trim().toLowerCase() ===
              String(conceptName).trim().toLowerCase()
          );

          const key = matchedConcept ? matchedConcept.nombre : conceptName;
          if (conceptExpenses[key] === undefined) {
            conceptExpenses[key] = 0;
          }
          conceptExpenses[key] += absMonto;
        }
      }
    });

    const totalGastos = Object.values(conceptExpenses).reduce((acc, curr) => acc + curr, 0);
    const distribucionPresupuesto = [];

    for (const [nombre, monto] of Object.entries(conceptExpenses)) {
      if (monto > 0) {
        const percentage = totalGastos > 0 ? Math.round((monto / totalGastos) * 100) : 0;
        distribucionPresupuesto.push({
          nombre,
          monto,
          porcentaje: percentage,
        });
      }
    }

    // Ordenar de mayor a menor monto/porcentaje
    distribucionPresupuesto.sort((a, b) => b.monto - a.monto);

    return {
      saldoMesActual,
      cambioMesActual: 0,
      ingresosMesActual,
      gastosMesActual: -gastosMesActual, // mantener negativo como en el comportamiento original
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
      distribucionPresupuesto: [],
    };
  }
}

export async function getAnnualReportInfo() {
  try {
    const transactions = await getTransactions(0, 1000);
    const loans = await getLoans(0, 1000);

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

    // Helper checking functions to normalize state checks
    const isPagado = (l) => {
      const st = String(l.estado || "").toUpperCase();
      return st === "PAGADO" || l.estadoMapeado === "Pagado";
    };

    const isEnCurso = (l) => {
      const st = String(l.estado || "").toUpperCase();
      return (
        st === "ACTIVO" ||
        st === "PENDIENTE" ||
        st === "APROBADO" ||
        l.estadoMapeado === "Activo" ||
        l.estadoMapeado === "Pendiente" ||
        l.estadoMapeado === "En Curso"
      );
    };

    const isAtrasado = (l) => {
      const st = String(l.estado || "").toUpperCase();
      return (
        st === "VENCIDO" ||
        st === "RETRASO" ||
        l.estadoMapeado === "Vencido" ||
        l.estadoMapeado === "Retraso"
      );
    };

    const activeLoans = loans.filter((l) => !isPagado(l));
    const morosidad =
      activeLoans.length > 0
        ? parseFloat(
          (
            (loans.filter(isAtrasado).length /
              loans.length) *
            100
          ).toFixed(1),
        )
        : 0;

    const pagadosMonto = loans
      .filter(isPagado)
      .reduce((acc, curr) => acc + curr.montoTotal, 0);

    const activosMonto = loans
      .filter(isEnCurso)
      .reduce((acc, curr) => acc + curr.montoTotal, 0);

    const vencidosMonto = loans
      .filter(isAtrasado)
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
        prestamosSeguimiento: loans.filter(isAtrasado).length,
        interesesGenerados: 0,
        distribucionCartera: [
          {
            node: "Pagados",
            estado: "Pagados",
            cantidad: loans.filter(isPagado).length,
            monto: pagadosMonto,
            porcentaje:
              prestamosEmitidos > 0
                ? parseFloat(
                  ((pagadosMonto / prestamosEmitidos) * 100).toFixed(1),
                )
                : 0,
          },
          {
            node: "En Curso",
            estado: "En Curso",
            cantidad: loans.filter(isEnCurso).length,
            monto: activosMonto,
            porcentaje:
              prestamosEmitidos > 0
                ? parseFloat(
                  ((activosMonto / prestamosEmitidos) * 100).toFixed(1),
                )
                : 0,
          },
          {
            node: "Atrasados",
            estado: "Atrasados",
            cantidad: loans.filter(isAtrasado).length,
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
}
