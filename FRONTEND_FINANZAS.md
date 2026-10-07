# Módulo Frontend: Proyecto de Finanzas y Tesorería

Documentación técnica y especificación de peticiones API HTTP para el proyecto Frontend de **Finanzas y Tesorería**.

---

## 🔒 Autenticación y Autorización

- **Header requerido**: `Authorization: Bearer <TOKEN_JWT>`
- **Roles autorizados**: `SECRETARIO`, `PRESIDENTE`, `SUPERUSER`

---

## 📋 Tabla de Endpoints Disponibles por Dominio

### 💰 Dominio de Préstamos (`/prestamos/**`)

| Método | Endpoint                          | Descripción                                 | Roles Autorizados          |
|:-------|:----------------------------------|:--------------------------------------------|:---------------------------|
| `POST` | `/prestamos`                      | Otorgar y registrar préstamo a un árbitro   | `SECRETARIO`, `PRESIDENTE` |
| `POST` | `/prestamos/{idPrestamo}/pago`    | Registrar entrega/pago de couta de préstamo | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/prestamos`                      | Listar préstamos (filtro por `estado`)      | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/prestamos/arbitro/{idArbitro}`  | Histórico de préstamos de un árbitro        | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/prestamos/{idPrestamo}`         | Detalle cabecera del préstamo               | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/prestamos/{idPrestamo}/detalle` | Detalle paginado de pagos realizados        | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/prestamos/reporte`              | Descargar informe PDF de préstamos          | `SECRETARIO`, `PRESIDENTE` |
| `PUT`  | `/prestamos/{idPrestamo}/fecha`   | Corregir fecha de solicitud de préstamo     | `SECRETARIO`, `PRESIDENTE` |
| `PUT`  | `/prestamos/pagos/{idPago}/fecha` | Corregir fecha de un pago de préstamo       | `SECRETARIO`, `PRESIDENTE` |

---

### 📉 Dominio de Gastos y Conceptos (`/gastos/**`)

| Método | Endpoint                         | Descripción                                  | Roles Autorizados          |
|:-------|:---------------------------------|:---------------------------------------------|:---------------------------|
| `POST` | `/gastos`                        | Registrar gasto institucional / compras      | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/gastos`                        | Listar egresos y gastos registrados          | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/gastos/conceptos`              | Obtener catálogo de conceptos de gastos      | `SECRETARIO`, `PRESIDENTE` |
| `POST` | `/gastos/conceptos`              | Crear nuevo concepto de gasto                | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/gastos/deudas`                 | Listar deudas de gastos imputadas a árbitros | `SECRETARIO`, `PRESIDENTE` |
| `POST` | `/gastos/deudas/{idDeuda}/pagar` | Registrar cobro de deuda de gasto a árbitro  | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/gastos/reporte`                | Descargar informe PDF de gastos              | `SECRETARIO`, `PRESIDENTE` |

---

### 💳 Dominio de Transacciones y Recuperos (`/transacciones/**`)

| Método | Endpoint                   | Descripción                                     | Roles Autorizados          |
|:-------|:---------------------------|:------------------------------------------------|:---------------------------|
| `GET`  | `/transacciones`           | Libro mayor de transacciones (ingresos/egresos) | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/transacciones/tipos`     | Lista de tipos de transacción                   | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/transacciones/recuperos` | Listar cobros por recupero de gastos            | `SECRETARIO`, `PRESIDENTE` |
| `POST` | `/transacciones/recuperos` | Registrar transacción de recupero de gasto      | `SECRETARIO`, `PRESIDENTE` |

---

### 🏦 Dominio de Caja (`/caja/**` / `/finanzas/**`)

| Método | Endpoint                                | Descripción                                  | Roles Autorizados          |
|:-------|:----------------------------------------|:---------------------------------------------|:---------------------------|
| `GET`  | `/caja/saldo-actual`                    | Consultar saldo actual en efectivo           | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/caja/anio/{anio}`                     | Consultar balance de caja por año            | `SECRETARIO`, `PRESIDENTE` |
| `POST` | `/caja/apertura`                        | Realizar apertura de caja anual              | `SECRETARIO`, `PRESIDENTE` |
| `POST` | `/caja/cierre`                          | Realizar cierre de caja                      | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/finanzas/dashboard`                   | Resumen general para dashboard financiero    | `SECRETARIO`, `PRESIDENTE` |
| `GET`  | `/finanzas/totales-arbitro/{idArbitro}` | Total acumulado deudas/préstamos por árbitro | `SECRETARIO`, `PRESIDENTE` |

---

## 🚀 Detalle de Peticiones y Payloads JSON

### 1. Registrar Préstamo a Árbitro

- **Endpoint**: `POST /prestamos?arbitroId=8&montoSolicitado=50000.00&fechaSolicitud=2026-09-23`
- **Respuesta (200 OK)**:

```json
{
  "idPrestamo": 10,
  "nombreArbitro": "Juan Pérez",
  "montoSolicitado": 50000.00,
  "montoDevuelto": 0.00,
  "saldoPendiente": 50000.00,
  "fechaSolicitud": "2026-09-23",
  "estado": "PENDIENTE"
}
```

---

### 2. Registrar Pago de Cuota de Préstamo

- **Endpoint**: `POST /prestamos/10/pago?montoPagado=15000.00&fecha=2026-09-23`
- **Respuesta (200 OK)**:

```json
{
  "idPrestamo": 10,
  "nombreArbitro": "Juan Pérez",
  "montoSolicitado": 50000.00,
  "montoDevuelto": 15000.00,
  "saldoPendiente": 35000.00,
  "fechaSolicitud": "2026-09-23",
  "estado": "PENDIENTE"
}
```

---

### 3. Registrar Gasto

- **Endpoint**: `POST /gastos?idConcepto=2&monto=12500.00&descripcion=Compra%20de%20tarjetas`
- **Respuesta (200 OK)**:

```json
{
  "idGasto": 4,
  "concepto": "Materiales de Trabajo",
  "monto": 12500.00,
  "descripcion": "Compra de tarjetas",
  "fechaGasto": "2026-09-23T16:20:00"
}
```

---

### 4. Pagar Deuda de Gasto de Árbitro

- **Endpoint**: `POST /gastos/deudas/1/pagar?monto=5000.00`
- **Respuesta (200 OK)**:

```json
"Pago de deuda registrado correctamente"
```

---

### 5. Resumen Dashboard Financiero

- **Endpoint**: `GET /finanzas/dashboard`
- **Respuesta (200 OK)**:

```json
{
  "saldoCajaActual": 450000.00,
  "totalIngresosMes": 120000.00,
  "totalEgresosMes": 45000.00,
  "totalPrestamosPendientesCobro": 180000.00,
  "totalDeudasGastosPendientes": 35000.00
}
```
