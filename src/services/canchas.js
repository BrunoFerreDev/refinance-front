import { apiClient } from "./client.js";

export async function getCanchas(page = 0, size = 100) {
  try {
    const response = await apiClient.get("/canchas", {
      params: { page, size },
    });
    return response.data.content || response.data || [];
  } catch (error) {
    console.warn(
      "Error al obtener canchas, usando simulación local:",
      error.message,
    );
    const localKey = "reffinance_canchas";
    let canchas = localStorage.getItem(localKey);
    if (!canchas) {
      canchas = [
        { idCancha: 1, nombre: "Cancha Principal A" },
        { idCancha: 2, fontAwesomeIcon: null, nombre: "Cancha Auxiliar B" },
        {
          idCancha: 3,
          fontAwesomeIcon: null,
          nombre: "Predio Centenario - 1",
        },
        { idCancha: 4, nombre: "Estadio Municipal" },
      ];
      localStorage.setItem(localKey, JSON.stringify(canchas));
    } else {
      canchas = JSON.parse(canchas);
    }
    return canchas;
  }
}

export async function getAranceles(page = 0, size = 10) {
  try {
    const response = await apiClient.get("/aranceles", {
      params: { page, size },
    });
    const content = response.data.content || response.data || [];
    content.totalPages =
      response.data.totalPages !== undefined ? response.data.totalPages : 1;
    content.totalElements =
      response.data.totalElements !== undefined
        ? response.data.totalElements
        : content.length;
    return content;
  } catch (error) {
    console.warn(
      "Error al obtener aranceles, usando simulación local:",
      error.message,
    );
    const localKey = "reffinance_aranceles";
    let aranceles = localStorage.getItem(localKey);
    if (!aranceles) {
      aranceles = [
        {
          idArancel: 1,
          descripcion: "Arancel Liga Amateur A",
          montoTotal: 15000.0,
          fechaVigencia: "2026-06-01",
          cantidadPartidos: 3,
          activo: true,
          cancha: {
            idCancha: 1,
            nombreCancha: "Cancha Principal A",
            nombre: "Cancha Principal A",
          },
        },
        {
          idArancel: 2,
          descripcion: "Arancel Torneo Relámpago",
          montoTotal: 8500.0,
          fechaVigencia: "2026-05-15",
          cantidadPartidos: 2,
          activo: false,
          cancha: {
            idCancha: 2,
            nombreCancha: "Cancha Auxiliar B",
            nombre: "Cancha Auxiliar B",
          },
        },
      ];
      localStorage.setItem(localKey, JSON.stringify(aranceles));
    } else {
      aranceles = JSON.parse(aranceles);
    }

    const start = page * size;
    const paginated = aranceles.slice(start, start + size);
    paginated.totalPages = Math.max(1, Math.ceil(aranceles.length / size));
    paginated.totalElements = aranceles.length;
    return paginated;
  }
}

export async function createArancel(payload) {
  try {
    const response = await apiClient.post("/aranceles", payload);
    return response.data;
  } catch (error) {
    console.warn(
      "Error al crear arancel, usando simulación local:",
      error.message,
    );
    const localKey = "reffinance_aranceles";
    let aranceles = [];
    const stored = localStorage.getItem(localKey);
    if (stored) {
      aranceles = JSON.parse(stored);
    }

    const canchas = await getCanchas();
    const canchaObj =
      canchas.find((c) => c.idCancha === Number(payload.idCancha)) || null;

    const newArancel = {
      idArancel: Date.now(),
      descripcion: payload.descripcion,
      montoTotal: parseFloat(payload.monto),
      monto: parseFloat(payload.monto),
      fechaVigencia: payload.fechaVigencia,
      cantidadPartidos: parseInt(payload.cantidadPartidos),
      activo: true,
      cancha: canchaObj,
    };

    aranceles.unshift(newArancel);
    localStorage.setItem(localKey, JSON.stringify(aranceles));
    return newArancel;
  }
}

export async function updateArancel(idArancel, payload) {
  try {
    const response = await apiClient.put("/aranceles/actualizar", payload, {
      params: { idArancel },
    });
    return response.data;
  } catch (error) {
    console.warn(
      "Error al actualizar arancel, usando simulación local:",
      error.message,
    );
    const localKey = "reffinance_aranceles";
    const stored = localStorage.getItem(localKey);
    if (stored) {
      const aranceles = JSON.parse(stored);
      const index = aranceles.findIndex(
        (a) => a.idArancel === Number(idArancel),
      );
      if (index !== -1) {
        const canchas = await getCanchas();
        const canchaObj =
          canchas.find((c) => c.idCancha === Number(payload.idCancha)) ||
          null;

        aranceles[index] = {
          ...aranceles[index],
          descripcion: payload.descripcion,
          montoTotal: parseFloat(payload.monto),
          monto: parseFloat(payload.monto),
          fechaVigencia: payload.fechaVigencia,
          cantidadPartidos: parseInt(payload.cantidadPartidos),
          cancha: canchaObj,
        };
        localStorage.setItem(localKey, JSON.stringify(aranceles));
        return aranceles[index];
      }
    }
    return { success: true };
  }
}

export async function toggleArancelActivo(idArancel, activo) {
  try {
    const response = await apiClient.put(
      `/finanzas/aranceles/${idArancel}/activo`,
      null,
      {
        params: { activo },
      },
    );
    return response.data;
  } catch (error) {
    console.warn(
      "Error al cambiar estado de arancel, usando simulación local:",
      error.message,
    );
    const localKey = "reffinance_aranceles";
    const stored = localStorage.getItem(localKey);
    if (stored) {
      const aranceles = JSON.parse(stored);
      const arancel = aranceles.find((a) => a.idArancel === idArancel);
      if (arancel) {
        arancel.activo = activo;
        localStorage.setItem(localKey, JSON.stringify(aranceles));
      }
    }
    return { success: true };
  }
}

export async function createCancha(payload) {
  try {
    const response = await apiClient.post("/canchas", payload);
    return response.data;
  } catch (error) {
    console.warn(
      "Error al crear cancha, usando simulación local:",
      error.message,
    );
    const localKey = "reffinance_canchas";
    let localCanchas = [];
    const stored = localStorage.getItem(localKey);
    if (stored) {
      localCanchas = JSON.parse(stored);
    }
    const newCancha = {
      idCancha: Date.now(),
      nombreCancha: payload.nombreCancha || payload.nombre,
      nombre: payload.nombreCancha || payload.nombre,
      categoria: payload.categoria || null,
      fueraDeJuego: payload.fueraDeJuego || false,
      estado: payload.estado !== undefined ? payload.estado : true,
    };
    localCanchas.push(newCancha);
    localStorage.setItem(localKey, JSON.stringify(localCanchas));
    return newCancha;
  }
}

export async function updateCancha(idCancha, payload) {
  try {
    const response = await apiClient.put(`/canchas/${idCancha}`, payload);
    return response.data;
  } catch (error) {
    console.warn(
      "Error al actualizar cancha, usando simulación local:",
      error.message,
    );
    const localKey = "reffinance_canchas";
    const stored = localStorage.getItem(localKey);
    if (stored) {
      const canchas = JSON.parse(stored);
      const index = canchas.findIndex((c) => c.idCancha === Number(idCancha));
      if (index !== -1) {
        canchas[index] = {
          ...canchas[index],
          nombreCancha: payload.nombreCancha || payload.nombre,
          nombre: payload.nombreCancha || payload.nombre,
          categoria: payload.categoria,
          fueraDeJuego: payload.fueraDeJuego,
          estado: payload.estado,
        };
        localStorage.setItem(localKey, JSON.stringify(canchas));
        return canchas[index];
      }
    }
    return { success: true };
  }
}
