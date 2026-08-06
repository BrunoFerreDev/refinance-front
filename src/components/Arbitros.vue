<template>
  <div
    class="flex-1 flex flex-col md:flex-row h-full overflow-hidden select-none"
  >
    <!-- LEFT SIDE PANEL: Referees Directory List -->
    <div
      :class="[
        'w-full h-full bg-white border-r border-reffinance-border flex flex-col shrink-0 transition-all duration-300',
        selectedReferee ? 'hidden md:flex' : 'flex',
        isSidebarCollapsed ? 'md:w-20' : 'md:w-80',
      ]"
    >
      <!-- Search Input Info inside List -->
      <div
        :class="[
          'p-4 border-b border-reffinance-border bg-slate-50/50 flex items-center justify-between',
          isSidebarCollapsed ? 'flex-col justify-center gap-2' : '',
        ]"
      >
        <div v-if="!isSidebarCollapsed">
          <h2
            class="text-xs font-bold text-slate-400 uppercase tracking-widest"
          >
            Directorio de Árbitros
          </h2>
          <p class="text-[10px] text-slate-400 font-semibold mt-0.5">
            {{ filteredReferees.length }} miembros encontrados
          </p>
        </div>
        <div class="flex items-center space-x-1.5">
          <button
            @click="openCreateModal"
            class="p-1.5 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-md transition-colors"
            title="Nuevo Árbitro"
          >
            <Plus class="w-4 h-4" />
          </button>
          <button
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 transition-colors hidden md:block"
            :title="isSidebarCollapsed ? 'Expandir' : 'Colapsar'"
          >
            <PanelLeftOpen v-if="isSidebarCollapsed" class="w-4 h-4" />
            <PanelLeftClose v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Referees List Grid -->
      <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
        <button
          v-for="ref in filteredReferees"
          :key="ref.id"
          @click="selectReferee(ref)"
          :class="[
            'w-full text-left flex items-center transition-colors',
            isSidebarCollapsed ? 'p-3 justify-center' : 'p-4 space-x-3',
            selectedReferee && selectedReferee.id === ref.id
              ? 'bg-slate-50 border-r-4 border-reffinance-navy'
              : 'hover:bg-slate-50/50',
          ]"
          :title="isSidebarCollapsed ? ref.nombre : ''"
        >
          <!-- <img
            :src="ref.avatarUrl || 'https://via.placeholder.com/150'"
            :alt="ref.nombre"
            /> -->
          <img
            src="https://0.gravatar.com/avatar/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee"
            alt="User avatar"
            class="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div v-if="!isSidebarCollapsed" class="flex-1 min-w-0">
            <h4
              class="font-extrabold text-slate-800 text-sm truncate leading-tight"
            >
              {{ ref.nombre }}
            </h4>
            <p class="text-[10px] font-bold text-slate-400 truncate mt-0.5">
              {{ ref.clasificacion }}
            </p>
          </div>
          <ChevronRight
            v-if="!isSidebarCollapsed"
            class="w-4 h-4 text-slate-300"
          />
        </button>
        <div
          v-if="filteredReferees.length === 0"
          class="p-8 text-center text-xs font-semibold text-slate-400"
        >
          <span v-if="!isSidebarCollapsed">No se encontraron árbitros.</span>
          <span v-else>0</span>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDE PANEL: Detailed Profile View (Basado en screen 3) -->
    <div
      v-if="selectedReferee"
      :class="[
        'flex-1 p-4 sm:p-8 overflow-y-auto space-y-8 bg-slate-50/50',
        selectedReferee ? 'block' : 'hidden md:block',
      ]"
    >
      <!-- Top Actions and Breadcrumbs -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div
          class="flex items-center space-x-2 text-xs font-bold text-slate-400"
        >
          <!-- Back button on mobile -->
          <button
            @click="selectedReferee = null"
            class="px-2.5 py-1.5 bg-slate-200/50 hover:bg-slate-200 text-slate-700 rounded-lg md:hidden mr-2 shrink-0 flex items-center font-bold"
          >
            <ChevronLeft class="w-4 h-4 mr-1" />
            Árbitros
          </button>

          <div class="hidden md:flex items-center space-x-2">
            <span
              class="hover:text-slate-600 cursor-pointer"
              @click="selectedReferee = null"
              >Árbitros</span
            >
            <span>&gt;</span>
            <span class="text-reffinance-navy font-extrabold"
              >Detalle del Perfil</span
            >
          </div>
        </div>
        <div class="flex items-center space-x-3 flex-wrap gap-y-2">
          <button
            @click="editProfile"
            class="px-4 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center whitespace-nowrap"
          >
            <Edit class="w-4 h-4 mr-1.5 shrink-0" />
            Editar Perfil
          </button>
          <button
            @click="openNewLoanModal"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center whitespace-nowrap"
          >
            <Plus class="w-4 h-4 mr-1.5 shrink-0" />
            Solicitar Préstamo
          </button>
        </div>
      </div>

      <!-- Profile Header Hero Card (Basado en screen 3) -->
      <div
        class="bg-white border border-reffinance-border rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center gap-6"
      >
        <img
          src="https://0.gravatar.com/avatar/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee"
          class="w-24 h-24 rounded-xl object-cover border border-slate-200 shadow-sm"
        />
        <!-- :src="selectedReferee.avatarUrl"
          :alt="selectedReferee.nombre" -->

        <div class="flex-1 space-y-4 text-center md:text-left">
          <div class="space-y-1">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <h2
                class="text-2xl font-black text-reffinance-navy font-outfit leading-none"
              >
                {{ selectedReferee.nombre }}
              </h2>
              <span
                class="inline-block self-center px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-extrabold"
              >
                MIEMBRO ACTIVO
              </span>
            </div>
            <p class="text-xs text-slate-400 font-bold">
              ID de Asociación:
              <span class="font-extrabold text-slate-600">{{
                selectedReferee.id
              }}</span>
            </p>
          </div>

          <!-- Metadata grids inside header -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
            <div
              class="flex items-center space-x-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl"
            >
              <Shield class="w-5 h-5 text-reffinance-navy shrink-0" />
              <div>
                <p class="text-[9px] uppercase font-bold text-slate-400">
                  Clasificación
                </p>
                <p class="text-xs font-bold text-slate-700 mt-0.5">
                  {{ selectedReferee.clasificacion }}
                </p>
              </div>
            </div>
            <div
              class="flex items-center space-x-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl"
            >
              <Calendar class="w-5 h-5 text-reffinance-navy shrink-0" />
              <div>
                <p class="text-[9px] uppercase font-bold text-slate-400">
                  Miembro Desde
                </p>
                <p class="text-xs font-bold text-slate-700 mt-0.5">
                  {{ selectedReferee.miembroDesde }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics Row (Basado en screen 3) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Prestado -->
        <div
          class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-3"
        >
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Prestado a la Fecha
          </h3>
          <div class="space-y-1">
            <p class="text-3xl font-extrabold text-reffinance-navy font-outfit">
              ${{ formatNumber(selectedReferee.totalPrestado) }}
            </p>
            <p class="text-emerald-600 text-xs font-semibold">
              ✓
              {{
                selectedReferee.historialPrestamos?.filter(
                  (l) => l.estado === "PAGADO TOTAL",
                ).length || 0
              }}
              préstamos completados con éxito
            </p>
          </div>
        </div>

        <!-- Saldo Pendiente -->
        <div
          class="bg-white border border-reffinance-border p-6 rounded-2xl shadow-sm space-y-3"
        >
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Saldo Pendiente
          </h3>
          <div class="space-y-1">
            <p class="text-3xl font-extrabold text-rose-600 font-outfit">
              ${{ formatNumber(selectedReferee.saldoPendiente) }}
            </p>
            <p class="text-slate-400 text-xs font-semibold">
              Próximo pago:
              {{
                selectedReferee.saldoPendiente > 0
                  ? "28 oct. 2023"
                  : "Sin pagos pendientes"
              }}
            </p>
          </div>
        </div>

        <div
          class="bg-white border border-reffinance-border rounded-2xl p-6 shadow-sm space-y-4"
        >
          <h3
            class="text-sm font-extrabold text-reffinance-navy font-outfit border-b border-slate-100 pb-2"
          >
            Información de Contacto
          </h3>
          <div class="space-y-4 text-xs font-semibold text-slate-600">
            <div class="space-y-1">
              <p
                class="text-[9px] uppercase font-bold text-slate-400 tracking-wider"
              >
                Número de Teléfono
              </p>
              <p class="text-slate-800 font-bold">
                {{ selectedReferee.telefono }}
              </p>
            </div>
            <div class="space-y-1">
              <p
                class="text-[9px] uppercase font-bold text-slate-400 tracking-wider"
              >
                Mensaje
              </p>
              <a
                :href="`https://wa.me/${selectedReferee.telefono}`"
                class="text-reffinance-navy hover:text-reffinance-navy-dark"
                >Enviar Mensaje</a
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Main Columns: Loan Records and Contact/Administrative Info -->
      <div class="">
        <!-- Left Side: Interactive tabs for Loan History / Payment Calendar -->
        <div
          class="bg-white border border-reffinance-border rounded-2xl shadow-sm overflow-hidden lg:col-span-2"
        >
          <!-- Tabs Selection Header -->
          <div
            class="border-b border-reffinance-border bg-slate-50 flex items-center"
          >
            <button
              @click="activeSubTab = 'historial'"
              :class="[
                'px-6 py-4 text-xs font-bold border-b-2 transition-all',
                activeSubTab === 'historial'
                  ? 'border-reffinance-navy text-reffinance-navy bg-white font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800',
              ]"
            >
              Historial de Préstamos
            </button>
            <button
              @click="activeSubTab = 'calendario'"
              :class="[
                'px-6 py-4 text-xs font-bold border-b-2 transition-all',
                activeSubTab === 'calendario'
                  ? 'border-reffinance-navy text-reffinance-navy bg-white font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800',
              ]"
            >
              Calendario de Pagos
            </button>
          </div>

          <!-- Tab Content 1: Loan History Table -->
          <div v-show="activeSubTab === 'historial'" class="flex flex-col">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr
                    class="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider"
                  >
                    <th class="py-3 px-6">ID Préstamo</th>
                    <th class="py-3 px-6">Fecha Solicitud</th>
                    <th class="py-3 px-6">Monto</th>
                    <th class="py-3 px-6 text-center">Estado</th>
                    <th class="py-3 px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-slate-100 text-xs font-medium text-slate-700"
                >
                  <tr
                    v-for="loan in paginatedHistorialPrestamos"
                    :key="loan.id"
                    class="hover:bg-slate-50/50 transition-colors"
                  >
                    <td class="py-3.5 px-6 font-bold text-reffinance-navy">
                      {{ loan.id }}
                    </td>
                    <td class="py-3.5 px-6">{{ loan.fechaSolicitud }}</td>
                    <td
                      class="py-3.5 px-6 font-bold font-outfit text-slate-800 text-sm"
                    >
                      ${{ formatNumber(loan.monto) }}
                    </td>
                    <td class="py-3.5 px-6 text-center">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded-full text-[9px] font-bold border',
                          loan.estado === 'VIGENTE'
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 animate-pulse'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700',
                        ]"
                      >
                        {{ loan.estado }}
                      </span>
                    </td>
                    <td class="py-3.5 px-6 text-center">
                      <button
                        v-if="loan.estado === 'VIGENTE'"
                        @click="openPayLoanModal(loan)"
                        class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-md text-[10px] font-bold transition-colors"
                      >
                        Pagar
                      </button>
                      <span v-else class="text-slate-400 text-[10px] font-semibold">-</span>
                    </td>
                  </tr>
                  <tr v-if="!selectedReferee.historialPrestamos?.length">
                    <td
                      colspan="5"
                      class="text-center py-6 text-slate-400 font-semibold"
                    >
                      Sin préstamos registrados.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination Controls for Loans -->
            <div
              v-if="selectedReferee.historialPrestamos?.length"
              class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500"
            >
              <p>
                Mostrando {{ paginatedHistorialPrestamos.length }} de
                {{ selectedReferee.historialPrestamos.length }} préstamos
              </p>
              <div class="flex items-center space-x-1.5 font-bold">
                <button
                  @click="prevLoansPage"
                  :disabled="currentLoansPage === 1"
                  class="p-1 border border-reffinance-border rounded bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
                >
                  <ChevronLeft class="w-3.5 h-3.5" />
                </button>
                <button
                  v-for="page in totalLoansPages"
                  :key="page"
                  @click="currentLoansPage = page"
                  :class="[
                    'px-2 py-0.5 rounded border transition-all select-none cursor-pointer',
                    currentLoansPage === page
                      ? 'bg-reffinance-navy border-reffinance-navy text-white'
                      : 'bg-white border-reffinance-border text-slate-600 hover:bg-slate-50',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextLoansPage"
                  :disabled="currentLoansPage === totalLoansPages"
                  class="p-1 border border-reffinance-border rounded bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
                >
                  <ChevronRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Tab Content 2: Payment Calendar -->
          <div v-show="activeSubTab === 'calendario'" class="flex flex-col">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr
                    class="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider"
                  >
                    <th class="py-3 px-6">Fecha Vencimiento</th>
                    <th class="py-3 px-6">Monto Cuota</th>
                    <th class="py-3 px-6 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-slate-100 text-xs font-medium text-slate-700"
                >
                  <tr
                    v-for="cuota in paginatedCalendarioPagos"
                    :key="cuota.fecha"
                    class="hover:bg-slate-50/50 transition-colors"
                  >
                    <td class="py-3.5 px-6 font-semibold">{{ cuota.fecha }}</td>
                    <td
                      class="py-3.5 px-6 font-bold font-outfit text-slate-800 text-sm"
                    >
                      ${{ formatNumber(cuota.monto) }}
                    </td>
                    <td class="py-3.5 px-6 text-center">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded-full text-[9px] font-bold border',
                          cuota.estado === 'VENCIDO'
                            ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-700',
                        ]"
                      >
                        {{ cuota.estado }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="!selectedReferee.calendarioPagos?.length">
                    <td
                      colspan="3"
                      class="text-center py-6 text-slate-400 font-semibold"
                    >
                      Sin pagos programados en este momento.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination Controls for Payments -->
            <div
              v-if="selectedReferee.calendarioPagos?.length"
              class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500"
            >
              <p>
                Mostrando {{ paginatedCalendarioPagos.length }} de
                {{ selectedReferee.calendarioPagos.length }} cuotas
              </p>
              <div class="flex items-center space-x-1.5 font-bold">
                <button
                  @click="prevPaymentsPage"
                  :disabled="currentPaymentsPage === 1"
                  class="p-1 border border-reffinance-border rounded bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
                >
                  <ChevronLeft class="w-3.5 h-3.5" />
                </button>
                <button
                  v-for="page in totalPaymentsPages"
                  :key="page"
                  @click="currentPaymentsPage = page"
                  :class="[
                    'px-2 py-0.5 rounded border transition-all select-none cursor-pointer',
                    currentPaymentsPage === page
                      ? 'bg-reffinance-navy border-reffinance-navy text-white'
                      : 'bg-white border-reffinance-border text-slate-600 hover:bg-slate-50',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPaymentsPage"
                  :disabled="currentPaymentsPage === totalPaymentsPages"
                  class="p-1 border border-reffinance-border rounded bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer"
                >
                  <ChevronRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Detail state -->
    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 text-slate-400 select-none"
    >
      <Users class="w-16 h-16 text-slate-300 stroke-1 mb-4" />
      <h3 class="text-lg font-bold font-outfit text-slate-500">
        Seleccione un Árbitro
      </h3>
      <p
        class="text-xs text-slate-400 mt-1 max-w-xs text-center leading-normal"
      >
        Navegue por el directorio del panel de la izquierda para examinar
        balances, notas, contactos e historiales financieros amortizables.
      </p>
    </div>

    <!-- Modal for Create / Edit Referee -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-2xl border border-reffinance-border shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100"
      >
        <!-- Modal Header -->
        <div class="p-6 border-b border-reffinance-border flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 class="text-base font-black text-reffinance-navy font-outfit">
              {{ isEditing ? 'Editar Árbitro' : 'Nuevo Árbitro' }}
            </h3>
            <p class="text-[10px] text-slate-400 font-semibold mt-0.5">
              {{ isEditing ? 'Modifique los datos del perfil' : 'Complete el formulario para registrar un miembro' }}
            </p>
          </div>
          <button
            @click="closeModal"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Modal Body (Scrollable form) -->
        <form @submit.prevent="saveReferee" class="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          <!-- Text Inputs Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre *</label>
              <input
                v-model="form.nombre"
                type="text"
                required
                class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
                placeholder="Nombre"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Apellido *</label>
              <input
                v-model="form.apellido"
                type="text"
                required
                class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
                placeholder="Apellido"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp *</label>
              <input
                v-model="form.whatsapp"
                type="text"
                required
                class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
                placeholder="WhatsApp (ej. +549...)"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría</label>
              <input
                v-model="form.categoria"
                type="text"
                class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
                placeholder="Categoría (ej. Nacional)"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Talle Camiseta</label>
              <input
                v-model="form.talleCamiseta"
                type="text"
                class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
                placeholder="Talle (ej. M, L)"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Talle Short</label>
              <input
                v-model="form.talleShort"
                type="text"
                class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
                placeholder="Talle (ej. M, L)"
              />
            </div>
          </div>

          <!-- Switches / Booleans Grid -->
          <div class="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 space-y-4">
            <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Preferencias y Estado</h4>
            
            <!-- Estado -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-bold text-slate-700">Estado del Árbitro</p>
                <p class="text-[9px] text-slate-400 font-semibold">Determina si está habilitado para designaciones</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer select-none">
                <input
                  v-model="form.estado"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <!-- Disponible Sábado -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-bold text-slate-700">Disponible Sábado</p>
                <p class="text-[9px] text-slate-400 font-semibold">Habilitar para partidos jugados los sábados</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer select-none">
                <input
                  v-model="form.disponibleSabado"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-reffinance-navy"></div>
              </label>
            </div>

            <!-- Disponible Domingo -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-bold text-slate-700">Disponible Domingo</p>
                <p class="text-[9px] text-slate-400 font-semibold">Habilitar para partidos jugados los domingos</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer select-none">
                <input
                  v-model="form.disponibleDomingo"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-reffinance-navy"></div>
              </label>
            </div>

            <!-- Tiene Auto -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-bold text-slate-700">Tiene Auto</p>
                <p class="text-[9px] text-slate-400 font-semibold">Indica si cuenta con movilidad propia</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer select-none">
                <input
                  v-model="form.tieneAuto"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-reffinance-navy"></div>
              </label>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="saveError" class="text-rose-600 font-bold text-center text-xs">
            {{ saveError }}
          </div>

          <!-- Modal Footer Actions -->
          <div class="pt-4 border-t border-reffinance-border flex items-center justify-end space-x-3 bg-slate-50/50 -mx-6 -mb-6 p-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg font-bold transition-all shadow-md disabled:opacity-50"
            >
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Solicitar Préstamo -->
    <div
      v-if="showNewLoanModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      @click.self="closeNewLoanModal"
    >
      <div
        class="bg-white rounded-2xl border border-reffinance-border shadow-2xl max-w-md w-full flex flex-col overflow-hidden"
      >
        <div class="bg-reffinance-navy p-6 text-white flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold font-outfit">Solicitar Préstamo</h3>
            <p class="text-xs text-slate-300">
              Registrar nuevo préstamo para {{ selectedReferee.nombre }}
            </p>
          </div>
          <button
            @click="closeNewLoanModal"
            class="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="submitNewLoan" class="p-6 space-y-4 text-xs">
          <div class="space-y-1.5">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monto Total ($)</label>
            <input
              v-model.number="formNewLoan.montoTotal"
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha de Solicitud</label>
            <input
              v-model="formNewLoan.fechaSolicitud"
              type="date"
              required
              class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
            />
          </div>

          <div v-if="newLoanError" class="text-rose-600 font-bold text-center">
            {{ newLoanError }}
          </div>

          <div class="pt-4 border-t border-reffinance-border flex items-center justify-end space-x-3 bg-slate-50/50 -mx-6 -mb-6 p-6">
            <button
              type="button"
              @click="closeNewLoanModal"
              class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="savingNewLoan"
              class="px-4 py-2 bg-reffinance-navy hover:bg-reffinance-navy-dark text-white rounded-lg font-bold transition-all shadow-md disabled:opacity-50"
            >
              {{ savingNewLoan ? 'Guardando...' : 'Crear Préstamo' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Registrar Pago de Préstamo -->
    <div
      v-if="showPayLoanModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      @click.self="closePayLoanModal"
    >
      <div
        class="bg-white rounded-2xl border border-reffinance-border shadow-2xl max-w-md w-full flex flex-col overflow-hidden"
      >
        <div class="bg-reffinance-navy p-6 text-white flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold font-outfit">Registrar Pago</h3>
            <p class="text-xs text-slate-300">
              Registrar abono de cuota para {{ selectedReferee.nombre }}
            </p>
          </div>
          <button
            @click="closePayLoanModal"
            class="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="submitPayLoan" class="p-6 space-y-4 text-xs">
          <div class="space-y-1.5">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detalles del Préstamo</p>
            <div class="bg-slate-50 p-3 rounded-lg text-xs font-semibold text-slate-600 space-y-1">
              <div class="flex justify-between">
                <span>Monto Total:</span>
                <span class="font-bold text-slate-800">${{ formatNumber(selectedLoanForPayment?.monto) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Saldo Restante:</span>
                <span class="font-bold text-slate-800">${{ formatNumber(selectedLoanForPayment?.saldoRestante) }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monto a Pagar ($)</label>
            <input
              v-model.number="formPayLoan.monto"
              type="number"
              step="0.01"
              required
              :max="selectedLoanForPayment?.saldoRestante"
              placeholder="0.00"
              class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha de Pago</label>
            <input
              v-model="formPayLoan.fecha"
              type="date"
              required
              class="w-full px-3.5 py-2 border border-reffinance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-reffinance-navy focus:border-transparent font-semibold text-slate-700 bg-slate-50/30"
            />
          </div>

          <div v-if="payLoanError" class="text-rose-600 font-bold text-center">
            {{ payLoanError }}
          </div>

          <div class="pt-4 border-t border-reffinance-border flex items-center justify-end space-x-3 bg-slate-50/50 -mx-6 -mb-6 p-6">
            <button
              type="button"
              @click="closePayLoanModal"
              class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="savingPayLoan"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all shadow-md disabled:opacity-50"
            >
              {{ savingPayLoan ? 'Guardando...' : 'Registrar Pago' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ChevronRight,
  ChevronLeft,
  Printer,
  Edit,
  Shield,
  Calendar,
  Star,
  Plus,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from "lucide-vue-next";
import { ref, onMounted, computed, watch } from "vue";
import api from "../services/api";

const props = defineProps({
  searchQuery: {
    type: String,
    default: "",
  },
});

// Reactivos
const isSidebarCollapsed = ref(false);
const referees = ref([]);
const selectedReferee = ref(null);
const activeSubTab = ref("historial");

// Editor de notas
const showNoteEditor = ref(false);
const newNoteContent = ref("");

// Reactivos de paginación
const currentLoansPage = ref(1);
const currentPaymentsPage = ref(1);
const itemsPerPage = 5;

// Resetear páginas de las tablas cuando cambie el árbitro seleccionado
watch(selectedReferee, () => {
  currentLoansPage.value = 1;
  currentPaymentsPage.value = 1;
});

// Propiedades computadas para paginación de Historial de Préstamos
const totalLoansPages = computed(() => {
  const list = selectedReferee.value?.historialPrestamos || [];
  return Math.max(1, Math.ceil(list.length / itemsPerPage));
});

const paginatedHistorialPrestamos = computed(() => {
  const list = selectedReferee.value?.historialPrestamos || [];
  const start = (currentLoansPage.value - 1) * itemsPerPage;
  return list.slice(start, start + itemsPerPage);
});

// Propiedades computadas para paginación de Calendario de Pagos
const totalPaymentsPages = computed(() => {
  const list = selectedReferee.value?.calendarioPagos || [];
  return Math.max(1, Math.ceil(list.length / itemsPerPage));
});

const paginatedCalendarioPagos = computed(() => {
  const list = selectedReferee.value?.calendarioPagos || [];
  const start = (currentPaymentsPage.value - 1) * itemsPerPage;
  return list.slice(start, start + itemsPerPage);
});

// Funciones de navegación de páginas
const nextLoansPage = () => {
  if (currentLoansPage.value < totalLoansPages.value) {
    currentLoansPage.value++;
  }
};

const prevLoansPage = () => {
  if (currentLoansPage.value > 1) {
    currentLoansPage.value--;
  }
};

const nextPaymentsPage = () => {
  if (currentPaymentsPage.value < totalPaymentsPages.value) {
    currentPaymentsPage.value++;
  }
};

const prevPaymentsPage = () => {
  if (currentPaymentsPage.value > 1) {
    currentPaymentsPage.value--;
  }
};

// Cargar información al montar
const loadData = async () => {
  try {
    referees.value = await api.getReferees();

    // Por defecto, seleccionar a Marcus Thorne (basado en screen 3) en desktop
    if (!selectedReferee.value && referees.value.length > 0) {
      if (window.innerWidth >= 768) {
        const thorne = referees.value.find((r) => r.nombre === "Marcus Thorne");
        const initial = thorne || referees.value[0];
        await selectReferee(initial);
      }
    } else if (selectedReferee.value) {
      // Recargar árbitro seleccionado con datos actualizados
      const detailed = await api.getRefereeById(selectedReferee.value.id);
      if (detailed) selectedReferee.value = detailed;
    }
  } catch (err) {
    console.error("Error al cargar directorio de árbitros:", err);
  }
};

onMounted(() => {
  loadData();
});

// Watch para buscar en el buscador global y abrir el perfil del árbitro si coincide
watch(
  () => props.searchQuery,
  (newQuery) => {
    if (newQuery.trim() && referees.value.length > 0) {
      const q = newQuery.toLowerCase();
      const matched = referees.value.find(
        (r) =>
          r.nombre.toLowerCase().includes(q) ||
          String(r.id).toLowerCase().includes(q),
      );
      if (matched && selectedReferee.value?.id !== matched.id) {
        selectReferee(matched);
      }
    }
  },
);

// Filtrado de árbitros del panel izquierdo según buscador
const filteredReferees = computed(() => {
  if (!props.searchQuery.trim()) return referees.value;
  const query = props.searchQuery.toLowerCase();
  return referees.value.filter(
    (r) =>
      r.nombre.toLowerCase().includes(query) ||
      String(r.id).toLowerCase().includes(query) ||
      r.clasificacion.toLowerCase().includes(query),
  );
});

// Seleccionar árbitro
const selectReferee = async (referee) => {
  selectedReferee.value = referee;
  activeSubTab.value = "historial";
  showNoteEditor.value = false;
  newNoteContent.value = "";

  try {
    const detailed = await api.getRefereeById(referee.id);
    if (detailed) {
      selectedReferee.value = detailed;
    }
  } catch (err) {
    console.error("Error al obtener detalle del árbitro:", err);
  }
};

// Crear nota administrativa
const submitNote = async () => {
  if (!newNoteContent.value.trim() || !selectedReferee.value) return;

  try {
    await api.addRefereeNote(selectedReferee.value.id, newNoteContent.value);
    await loadData();
    newNoteContent.value = "";
    showNoteEditor.value = false;
    alert("Nota interna agregada con éxito al registro de auditoría.");
  } catch (err) {
    console.error("Error al guardar nota:", err);
  }
};

// Utilidades
const formatNumber = (num) => {
  if (num === undefined || num === null) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const printReport = () => {
  alert(
    `Preparando impresión de la ficha técnica de ${selectedReferee.value.nombre}...\nGuardado con éxito en Descargas/Ficha_${selectedReferee.value.nombre.replace(" ", "_")}.pdf`,
  );
};

const editProfile = () => {
  if (!selectedReferee.value) return;
  isEditing.value = true;
  saveError.value = "";
  form.value = {
    nombre: selectedReferee.value.nombre_raw || "",
    apellido: selectedReferee.value.apellido_raw || "",
    whatsapp: selectedReferee.value.whatsapp || "",
    categoria: selectedReferee.value.categoria || "",
    talleShort: selectedReferee.value.talleShort || "",
    talleCamiseta: selectedReferee.value.talleCamiseta || "",
    estado: selectedReferee.value.estado !== undefined ? selectedReferee.value.estado : true,
    disponibleSabado: !!selectedReferee.value.disponibleSabado,
    disponibleDomingo: !!selectedReferee.value.disponibleDomingo,
    tieneAuto: !!selectedReferee.value.tieneAuto,
  };
  showModal.value = true;
};

// Modal handlers
const showModal = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const saveError = ref("");
const form = ref({
  nombre: "",
  apellido: "",
  whatsapp: "",
  categoria: "",
  talleShort: "",
  talleCamiseta: "",
  estado: true,
  disponibleSabado: false,
  disponibleDomingo: false,
  tieneAuto: false,
});

const openCreateModal = () => {
  isEditing.value = false;
  saveError.value = "";
  form.value = {
    nombre: "",
    apellido: "",
    whatsapp: "",
    categoria: "",
    talleShort: "",
    talleCamiseta: "",
    estado: true,
    disponibleSabado: false,
    disponibleDomingo: false,
    tieneAuto: false,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveReferee = async () => {
  if (saving.value) return;
  saving.value = true;
  saveError.value = "";
  try {
    const dto = {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      whatsapp: form.value.whatsapp,
      estado: form.value.estado,
      disponibleSabado: form.value.disponibleSabado,
      disponibleDomingo: form.value.disponibleDomingo,
      talleShort: form.value.talleShort,
      talleCamiseta: form.value.talleCamiseta,
      categoria: form.value.categoria,
      tieneAuto: form.value.tieneAuto,
    };
    if (isEditing.value) {
      const updated = await api.updateReferee(selectedReferee.value.id, dto);
      alert("Árbitro actualizado con éxito.");
      await loadData();
      if (selectedReferee.value && selectedReferee.value.id === updated.idArbitro) {
        // reload current detailed referee
        await selectReferee(selectedReferee.value);
      }
    } else {
      const created = await api.createReferee(dto);
      alert("Árbitro creado con éxito.");
      await loadData();
      if (created && created.idArbitro) {
        const found = referees.value.find(r => r.id === created.idArbitro);
        if (found) {
          await selectReferee(found);
        }
      }
    }
    closeModal();
  } catch (err) {
    console.error("Error al guardar árbitro:", err);
    saveError.value = err.response?.data?.message || "Ocurrió un error al guardar.";
  } finally {
    saving.value = false;
  }
};

// Loan and payment reactive state and handlers
const showNewLoanModal = ref(false);
const savingNewLoan = ref(false);
const newLoanError = ref("");
const formNewLoan = ref({
  montoTotal: null,
  fechaSolicitud: "",
});

const openNewLoanModal = () => {
  newLoanError.value = "";
  formNewLoan.value = {
    montoTotal: null,
    fechaSolicitud: new Date().toISOString().split("T")[0],
  };
  showNewLoanModal.value = true;
};

const closeNewLoanModal = () => {
  showNewLoanModal.value = false;
};

const submitNewLoan = async () => {
  if (savingNewLoan.value || !formNewLoan.value.montoTotal) return;
  savingNewLoan.value = true;
  newLoanError.value = "";
  try {
    const payload = {
      arbitro: selectedReferee.value.id,
      montoTotal: parseFloat(formNewLoan.value.montoTotal),
      fechaSolicitud: formNewLoan.value.fechaSolicitud,
    };
    await api.createLoan(payload);
    alert("Solicitud de préstamo enviada y agregada con éxito.");
    await loadData();
    if (selectedReferee.value) {
      await selectReferee(selectedReferee.value);
    }
    closeNewLoanModal();
  } catch (err) {
    console.error("Error al registrar préstamo:", err);
    newLoanError.value = err.response?.data?.message || "Error al solicitar préstamo.";
  } finally {
    savingNewLoan.value = false;
  }
};

const showPayLoanModal = ref(false);
const savingPayLoan = ref(false);
const payLoanError = ref("");
const selectedLoanForPayment = ref(null);
const formPayLoan = ref({
  monto: null,
  fecha: "",
});

const openPayLoanModal = (loan) => {
  selectedLoanForPayment.value = loan;
  payLoanError.value = "";
  formPayLoan.value = {
    monto: loan.saldoRestante,
    fecha: new Date().toISOString().split("T")[0],
  };
  showPayLoanModal.value = true;
};

const closePayLoanModal = () => {
  showPayLoanModal.value = false;
};

const submitPayLoan = async () => {
  if (savingPayLoan.value || !selectedLoanForPayment.value || !formPayLoan.value.monto) return;
  savingPayLoan.value = true;
  payLoanError.value = "";
  try {
    await api.registerLoanPayment(
      selectedLoanForPayment.value.idPrestamoRaw,
      formPayLoan.value.monto,
      formPayLoan.value.fecha,
    );
    alert("Pago registrado con éxito.");
    await loadData();
    if (selectedReferee.value) {
      await selectReferee(selectedReferee.value);
    }
    closePayLoanModal();
  } catch (err) {
    console.error("Error al registrar pago del préstamo:", err);
    payLoanError.value = err.response?.data?.message || "Error al registrar pago.";
  } finally {
    savingPayLoan.value = false;
  }
};
</script>
