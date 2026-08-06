import { apiClient } from "./client.js";

export async function getReferees() {
  try {
    const response = await apiClient.get("/finanzas/arbitros?page=0&size=30");
    const list = response.data.content || [];
    return list.map((r) => ({
      id: r.idArbitro,
      nombre: `${r.nombre} ${r.apellido}`,
      nombre_raw: r.nombre,
      apellido_raw: r.apellido,
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
      // DTO properties
      whatsapp: r.whatsapp || "",
      estado: r.estado !== undefined ? r.estado : true,
      disponibleSabado: !!r.disponibleSabado,
      disponibleDomingo: !!r.disponibleDomingo,
      talleShort: r.talleShort || "",
      talleCamiseta: r.talleCamiseta || "",
      categoria: r.categoria || "",
      tieneAuto: !!r.tieneAuto,
    }));
  } catch (error) {
    console.error("Error al obtener árbitros:", error.message);
    return [];
  }
}

export async function getRefereeById(id) {
  try {
    const referees = await getReferees();
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
        idPrestamoRaw: l.idPrestamo,
        fechaSolicitud: formattedFecha,
        monto: solicitado,
        estado: isCompleted ? "PAGADO TOTAL" : "VIGENTE",
        saldoRestante: restante,
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
    console.error(`Error al obtener detalle de árbitro ${id}:`, error.message);
    return null;
  }
}

export async function addRefereeNote(refereeId, noteContent) {
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
}

export async function createReferee(refereeDto) {
  try {
    const response = await apiClient.post("/arbitros", refereeDto);
    return response.data;
  } catch (error) {
    console.error("Error al crear árbitro:", error.message);
    throw error;
  }
}

export async function updateReferee(id, refereeDto) {
  try {
    const response = await apiClient.put(`/arbitros/${id}`, refereeDto);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar árbitro ${id}:`, error.message);
    throw error;
  }
}
