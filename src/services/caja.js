import { apiClient } from "./client.js";
import { getTransactions } from "./transactions.js";
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

export async function getControlCajaInfo() {
  try {
    const currentCaja = await getCurrentCaja();
    const transactions = await getTransactions();

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
}

export async function getAnnualReportInfo() {
  try {
    const transactions = await getTransactions();
    const loans = await getLoans();

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
            node: "Pagados",
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
            node: "En Curso",
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
            node: "Atrasados",
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
}
