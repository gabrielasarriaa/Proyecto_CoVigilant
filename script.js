/**
 * =============================================================================
 *  CoVigilant — GEA Soluciones IT
 *  script.js — Lógica de front-end del sitio público y del panel administrativo
 * =============================================================================
 *  Evidencia: GA7-220501096-AA4-EV03 (Componente front-end del proyecto
 *  formativo). Este archivo amplía el trabajo de las evidencias anteriores:
 *    - GA4-220501095-AA2-EV04 (Diagrama de Clases UML)
 *    - GA7-220501096-AA3-EV02 (Módulos de software codificados y probados)
 *    - GA6-220501096-AA3-EV02 (Diseño del sitio web en Figma)
 *
 *  Trazabilidad principal de esta entrega (módulo "Órdenes de Trabajo"):
 *    Clase UML "OrdenTrabajo"  ->  atributo estado {PENDIENTE, EN_PROCESO, CERRADA}
 *    Método cambiarEstado()    ->  función cambiarEstadoOrden()
 *    Método calcularCosto()    ->  función calcularCostoOrden()
 *    Método generarFactura()   ->  función generarFacturaOrden()
 *    Método notificarCambioEstado() -> función notificarCambioEstado()
 *
 *  Convenciones de codificación aplicadas:
 *    - camelCase para variables y funciones, PascalCase implícito para datos
 *      que representan entidades (Estado, Factura).
 *    - Cada función pública incluye comentario JSDoc con su propósito.
 *    - Los "números mágicos" de negocio (límites de stock, costos base) se
 *      documentan en el propio comentario de la función que los usa.
 *    - Un solo punto de verdad por dato: el estado de una orden vive en
 *      datosCrud.servicios y se propaga a la interfaz mediante renderTabla().
 * =============================================================================
 */

// ================= SECCIÓN 1: TRADUCCIONES Y ACCESIBILIDAD =================
let idiomaActual = "ES";
let fontSizeActual = 16;
let chart1Instance = null;
let chart2Instance = null;

const diccionario = {
  ES: {
    subtituloHeader: "GEA SOLUCIONES IT",
    subtituloHeaderDash: "GEA SOLUCIONES IT",
    btnIniciarSesion: "Iniciar sesión",
    quienesSomosTitulo: "¿Quiénes Somos?",
    quienesSomosDesc: "Somos un grupo de aprendices del programa ADSO dedicados a brindar soluciones técnicas en seguridad electrónica y soporte informático.",
    nuestrosServicios: "Nuestros Servicios:",
    servicio1: "Instalación de cámaras (CCTV)",
    servicio2: "Mantenimiento de computadores",
    servicio3: "Configuración de redes locales",
    servicio4: "Creación de páginas web básicas",
    contactoEmail: "Contacto E-mail:",
    ubicacion: "Ubicación:",
    ubicacionDetalle: "Centro de Servicios Financieres, Bogotá, D.C., Colombia",
    exploraServicios: "Explora nuestros servicios",
    nuestroEquipo: "Nuestro Equipo",
    loginTitulo: "Iniciar Sesión",
    loginSubtitulo: "Bienvenido al Panel Administrativo de CoVigilant",
    labelCorreo: "Correo electrónico",
    labelPassword: "Contraseña",
    btnEntrar: "Entrar al Sistema",
    footer: "© 2026 CoVigilant - Seguridad Comunitaria (PVA) - Bogotá D.C. Colombia.",
    solicitudTitulo: "Solicita tu servicio o cotización",
    solicitudDesc: "Cuéntanos qué necesitas y nuestro equipo se pondrá en contacto contigo a la brevedad.",
    labelNombre: "Nombre completo",
    labelCorreoSol: "Correo electrónico",
    labelTelefono: "Teléfono",
    labelTipoServicio: "Tipo de servicio",
    optSeleccione: "Selecciona una opción",
    optCCTV: "CCTV",
    optRedes: "Redes",
    optSoporte: "Soporte técnico",
    optWeb: "Desarrollo web",
    labelDireccion: "Dirección / Ubicación",
    labelMensaje: "Detalles de la solicitud",
    btnEnviarSolicitud: "Enviar solicitud",
    whatsappTitulo: "¿Prefieres escribirnos directamente?",
    whatsappDesc: "Contáctanos por WhatsApp y con gusto te atenderemos.",
    labelBtnWhatsapp: "Escríbenos por WhatsApp"
  },
  EN: {
    subtituloHeader: "GEA IT SOLUTIONS",
    subtituloHeaderDash: "GEA IT SOLUTIONS",
    btnIniciarSesion: "Sign In",
    quienesSomosTitulo: "About Us",
    quienesSomosDesc: "We are a group of apprentices from the ADSO program dedicated to providing technical solutions in electronic security and computer support.",
    nuestrosServicios: "Our Services:",
    servicio1: "CCTV Camera Installation",
    servicio2: "Computer Maintenance",
    servicio3: "Local Network Configuration",
    servicio4: "Basic Web Development",
    contactoEmail: "Email Contact:",
    ubicacion: "Location:",
    ubicacionDetalle: "Financial Services Center, Bogota D.C., Colombia",
    exploraServicios: "Explore our services",
    nuestroEquipo: "Our Team",
    loginTitulo: "Login",
    loginSubtitulo: "Welcome to the CoVigilant Administrative Panel",
    labelCorreo: "Email address",
    labelPassword: "Password",
    btnEntrar: "Enter the System",
    footer: "© 2026 CoVigilant - Community Security (PVA) - Bogota D.C. Colombia.",
    solicitudTitulo: "Request your service or quote",
    solicitudDesc: "Tell us what you need and our team will contact you shortly.",
    labelNombre: "Full name",
    labelCorreoSol: "Email address",
    labelTelefono: "Phone",
    labelTipoServicio: "Service type",
    optSeleccione: "Select an option",
    optCCTV: "CCTV",
    optRedes: "Networks",
    optSoporte: "Technical support",
    optWeb: "Web development",
    labelDireccion: "Address / Location",
    labelMensaje: "Request details",
    btnEnviarSolicitud: "Send request",
    whatsappTitulo: "Prefer to write to us directly?",
    whatsappDesc: "Contact us on WhatsApp and we'll be happy to help.",
    labelBtnWhatsapp: "Message us on WhatsApp"
  }
};

document.getElementById("btn-idioma").addEventListener("click", () => {
  idiomaActual = idiomaActual === "ES" ? "EN" : "ES";
  document.getElementById("btn-idioma").innerText = idiomaActual === "ES" ? "EN" : "ES";
  renderTraducciones();
});

document.getElementById("btn-contraste").addEventListener("click", () => {
  document.body.classList.toggle("high-contrast");
});

document.getElementById("btn-fuente").addEventListener("click", () => {
  fontSizeActual = fontSizeActual >= 20 ? 14 : fontSizeActual + 2;
  document.body.style.fontSize = `${fontSizeActual}px`;
});

function renderTraducciones() {
  const data = diccionario[idiomaActual];
  Object.keys(data).forEach(id => {
    const el = document.getElementById(`t-${id}`);
    if (el) el.innerText = data[id];
  });
}

// ================= SECCIÓN 2: CONTROL DE FLUJO PÚBLICO =================
/**
 * Muestra la pantalla pública indicada y oculta las demás (patrón SPA simple
 * basado en clases CSS, sin recargar la página).
 * @param {number} pantallaId Número de la pantalla a mostrar (1 a 4).
 */
function navegar(pantallaId) {
  document.querySelectorAll(".tab-content").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-link-clean").forEach(l => l.classList.remove("active"));
  
  document.getElementById(`pantalla-${pantallaId}`).classList.add("active");
  
  const elNav = document.getElementById(`nav-${pantallaId}`);
  if (elNav) elNav.classList.add("active");
}

// ================= SECCIÓN 3: ESTRUCTURA DE TODOS LOS CAMPOS Y VALIDACIONES MULTI-CAMPO =================
let globalCounter = 10;

// Definición de los campos completos para cada formulario
const camposPorModulo = {
  almacen: ['Código', 'Documento ID / Nombre', 'Cantidad', 'Ubicación Estante', 'Estado'],
  consola: ['Nombre del Producto', 'Categoría', 'Stock / Control'],
  // "Estado" se añade como sexto campo para representar el atributo
  // "estado" de la clase OrdenTrabajo del diagrama de clases (EV04).
  servicios: ['Fecha de Registro', 'Cliente', 'Técnico Asignado', 'Ruta / Dirección', 'Tipo de Servicio', 'Estado'],
  facturacion: ['Código Factura', 'Nombre / Cliente', 'Tipo de Servicio', 'Monto Operación', 'Estado del Pago'],
  devoluciones: ['Código de Ítem', 'Descripción Física', 'Cantidad Retornada', 'Técnico Responsable', 'Observaciones']
};

let datosCrud = {
  almacen: [
    { id: 1, valores: ['ALM-001', '10987654', '15', 'Estante A1', 'Disponible'] }
  ],
  consola: [
    { id: 2, valores: ['Cámara IP HD', 'CCTV', '25'] }
  ],
  servicios: [
    { id: 3, valores: ['2026-03-01', 'Alcaldía Municipal', 'Anderson Tovar', 'Calle 10 #12-45', 'CCTV', 'Cerrada'] },
    { id: 6, valores: ['2026-03-05', 'Colegio San Rafael', 'Esteban Velásquez', 'Cra 15 #45-20', 'Soporte', 'En Proceso'] },
    { id: 7, valores: ['2026-03-08', 'Ferretería El Tornillo', 'Gabriela Sarria', 'Av. Boyacá #70-12', 'Redes', 'Pendiente'] }
  ],
  facturacion: [
    { id: 4, valores: ['FAC-1002', 'Juan Perez', 'Soporte técnico', '$250.000', 'Pagado'] }
  ],
  devoluciones: [
    { id: 5, valores: ['DEV-09', 'Switch 8 Puertos', '2', 'Esteban Velásquez', 'Equipo retornado en óptimas condiciones'] }
  ]
};

let moduloActualCrud = '';
let idEdicionActual = null;

/**
 * Valida de forma estricta los valores ingresados en los campos de los formularios.
 * Las reglas de validación fueron definidas en las Historias de Usuario (HU003,
 * HU004, HU005) y documentadas previamente en la Evidencia GA7-AA3-EV02
 * (Módulos de software codificados y probados).
 *
 * @param {string} modulo  Nombre del módulo CRUD que se está validando
 *                          (almacen, consola, servicios, facturacion, devoluciones).
 * @param {string[]} valores Arreglo con los valores ingresados por el usuario,
 *                          en el mismo orden que camposPorModulo[modulo].
 * @returns {boolean} true si todos los campos son válidos; false en caso contrario.
 */
function validarCamposFormulario(modulo, valores) {
  for (let i = 0; i < valores.length; i++) {
    const nombreCampo = camposPorModulo[modulo][i];
    const valor = valores[i].trim();

    // 1. Validaciones para tipo FECHA (Fecha de Registro)
    if (nombreCampo.toLowerCase().includes('fecha')) {
      if (!valor) {
        alert("Error: Debe ingresar una fecha válida.");
        return false;
      }      let fechaIngresada = new Date(valor + "T00:00:00");
      let hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaIngresada > hoy) {
        alert("Error: No se permiten fechas futuras para agendamiento.");
        return false;
      }
      alert("Fecha válida");
    }

    // 2. Validaciones para DOCUMENTO ID y STOCK / CONTROL (Solo números)
    else if (nombreCampo === 'Documento ID / Nombre' || nombreCampo === 'Documento ID' || nombreCampo === 'Cantidad' || nombreCampo === 'Cantidad Retornada') {
      const esSoloNumeros = /^\d+$/.test(valor);
      if (!esSoloNumeros) {
        alert(`Error en [${nombreCampo}]: El documento / cantidad solo debe contener números.`);
        return false;
      }
      alert("Solo números");
    }

    // 3. Validación para STOCK / CONTROL en la Consola
    else if (nombreCampo === 'Stock / Control') {
      const num = parseFloat(valor);
      if (isNaN(num) || num > 39 || !Number.isInteger(num)) {
        alert("Error: Rango de inventario fuera de los límites permitidos (Máximo 39 enteros).");
        return false;
      }
      alert("Solo números válidos");
    }

    // 4. Validaciones para NOMBRE / PRODUCTO o NOMBRE / CLIENTE (Solo letras, sin caracteres especiales)
    else if (nombreCampo === 'Nombre / Producto' || nombreCampo === 'Nombre / Cliente') {
      const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor);
      if (!soloLetras) {
        alert(`Error en [${nombreCampo}]: No se permiten caracteres especiales ni números.`);
        return false;
      }
      alert("Solo letras");
    }

    // 5. Validaciones para OBSERVACIONES
    else if (nombreCampo === 'Observaciones') {
      const textoLimpio = valor.replace(/^"|"$/g, '');
      if (textoLimpio.length < 10) {
        alert("Error: La observación debe tener al menos 10 caracteres.");
        return false;
      }
    }

    // 6. Campo ESTADO (clase OrdenTrabajo): se diligencia mediante un <select>
    // con valores fijos (Pendiente / En Proceso / Cerrada), por lo que no
    // requiere validación adicional de formato; solo se exige que no esté vacío.
    else if (nombreCampo === 'Estado' && !valor) {
      alert("Error: Debe seleccionar un estado para la orden de trabajo.");
      return false;
    }
  }

  return true;
}

/**
 * Construye dinámicamente el formulario del modal CRUD según el módulo
 * seleccionado y, si se recibe un idTarget, lo precarga en modo edición.
 *
 * @param {string} modulo   Módulo destino (almacen, consola, servicios, ...).
 * @param {?number} idTarget Id del registro a editar; null si es creación.
 */
function abrirModalCrud(modulo, idTarget = null) {
  moduloActualCrud = modulo;
  idEdicionActual = idTarget;
  
  const container = document.getElementById('inputs-dinamicos-container');
  container.innerHTML = '';
  
  const tituloModal = document.getElementById('modal-title');
  tituloModal.innerText = idTarget !== null ? `Editar Registro (ID: ${idTarget})` : `Diligenciar Formulario (${modulo.toUpperCase()})`;

  const campos = camposPorModulo[modulo];
  const valoresPrevios = idTarget !== null ? datosCrud[modulo].find(item => item.id === idTarget) : null;

  campos.forEach((campo, index) => {
    const div = document.createElement('div');
    div.className = 'form-group';
    
    const label = document.createElement('label');
    label.className = 'form-label';
    label.innerText = campo;
    
    // El campo "Estado" (clase OrdenTrabajo) se representa con un <select>
    // de opciones cerradas para impedir estados inválidos desde la UI.
    if (campo === 'Estado') {
      const select = document.createElement('select');
      select.required = true;
      ['Pendiente', 'En Proceso', 'Cerrada'].forEach(opcion => {
        const optEl = document.createElement('option');
        optEl.value = opcion;
        optEl.innerText = opcion;
        select.appendChild(optEl);
      });
      if (valoresPrevios) select.value = valoresPrevios.valores[index];

      div.appendChild(label);
      div.appendChild(select);
      container.appendChild(div);
      return; // Continúa con el siguiente campo del forEach
    }

    const input = document.createElement('input');
    
    // Configuración de tipo de entrada según la naturaleza del campo
    if (campo.toLowerCase().includes('fecha')) {
      input.type = 'date';
    } else {
      input.type = 'text';
    }
    
    input.required = true;
    if (valoresPrevios) input.value = valoresPrevios.valores[index];
    
    div.appendChild(label);
    div.appendChild(input);
    container.appendChild(div);
  });

  document.getElementById('modal-crud').classList.remove('hidden');
}

function cerrarModalCrud() {
  document.getElementById('modal-crud').classList.add('hidden');
}

/**
 * Recolecta los valores del formulario dinámico (inputs y selects), los
 * valida y crea o actualiza el registro correspondiente en datosCrud.
 * @param {Event} event Evento submit del formulario del modal.
 */
function guardarRegistroCrud(event) {
  event.preventDefault();

  // Se incluyen tanto <input> como <select> porque el campo "Estado"
  // del módulo de Órdenes de Trabajo se renderiza como <select>.
  const campos = document.getElementById('inputs-dinamicos-container').querySelectorAll('input, select');
  let nuevosValores = [];
  campos.forEach(campo => nuevosValores.push(campo.value.trim()));

  // Validar todos los campos antes de guardar
  const esValido = validarCamposFormulario(moduloActualCrud, nuevosValores);
  if (!esValido) {
    return; // Cancela el guardado si falla la validación
  }

  if (idEdicionActual !== null) {
    let registro = datosCrud[moduloActualCrud].find(item => item.id === idEdicionActual);
    if (registro) registro.valores = nuevosValores;
  } else {
    let nuevoId = globalCounter++;
    datosCrud[moduloActualCrud].push({ id: nuevoId, valores: nuevosValores });
  }

  cerrarModalCrud();
  
  if (moduloActualCrud === 'consola' || moduloActualCrud === 'almacen') {
    renderTabla('almacen');
    renderTabla('consola');
  } else {
    renderTabla(moduloActualCrud);
  }
}

function eliminarRegistroCrud(modulo, idTarget) {
  if (confirm('¿Desea eliminar este elemento permanentemente?')) {
    datosCrud[modulo] = datosCrud[modulo].filter(item => item.id !== idTarget);
    if (modulo === 'consola' || modulo === 'almacen') {
      renderTabla('almacen');
      renderTabla('consola');
    } else {
      renderTabla(modulo);
    }
  }
}

/**
 * Renderiza en el DOM las filas de la tabla correspondiente a un módulo.
 * Para el módulo "servicios" (clase OrdenTrabajo) añade una insignia visual
 * de estado y los botones de ciclo de vida (cambiar estado / generar factura).
 *
 * @param {string} modulo Módulo cuya tabla debe redibujarse.
 */
function renderTabla(modulo) {
  const tbody = document.getElementById(`tbody-${modulo}`);
  if (!tbody) return;
  tbody.innerHTML = '';
  
  const registros = datosCrud[modulo];

  if (!registros || registros.length === 0) {
    const totalCols = camposPorModulo[modulo].length + 2;
    tbody.innerHTML = `<tr><td colspan="${totalCols}" style="text-align:center; color:#94a3b8; padding:35px; font-style:italic;">No hay registros cargados.</td></tr>`;
    return;
  }

  registros.forEach(reg => {
    const tr = document.createElement('tr');
    
    const tdId = document.createElement('td');
    tdId.innerHTML = `<strong>${reg.id}</strong>`;
    tr.appendChild(tdId);

    reg.valores.forEach((val, index) => {
      const td = document.createElement('td');
      const nombreCampo = camposPorModulo[modulo][index];

      // Columna "Estado" del módulo de Órdenes de Trabajo: se pinta como
      // insignia (badge) en vez de texto plano para dar retroalimentación
      // visual inmediata del ciclo de vida de la orden.
      if (modulo === 'servicios' && nombreCampo === 'Estado') {
        const claseBadge = val === 'Pendiente' ? 'badge-pendiente'
                          : val === 'En Proceso' ? 'badge-proceso'
                          : 'badge-cerrada';
        td.innerHTML = `<span class="badge-estado ${claseBadge}">${val}</span>`;
      } else {
        td.innerText = val;
      }
      tr.appendChild(td);
    });

    const tdAcciones = document.createElement('td');

    if (modulo === 'servicios') {
      // Acciones propias del ciclo de vida de la OrdenTrabajo: avanzar de
      // estado y, solo si ya está "Cerrada", generar la factura asociada.
      const estadoActual = reg.valores[camposPorModulo.servicios.indexOf('Estado')];
      const puedeFacturar = estadoActual === 'Cerrada';
      tdAcciones.innerHTML = `
        <button class="btn-state-table" title="Avanzar estado" onclick="cambiarEstadoOrden(${reg.id})">🔄</button>
        <button class="btn-invoice-table" title="Generar factura" ${puedeFacturar ? '' : 'disabled'} onclick="generarFacturaOrden(${reg.id})">🧾</button>
        <button class="btn-edit-table" onclick="abrirModalCrud('${modulo}', ${reg.id})">✏️</button>
        <button class="btn-delete-table" onclick="eliminarRegistroCrud('${modulo}', ${reg.id})">🗑️</button>
      `;
    } else {
      tdAcciones.innerHTML = `
        <button class="btn-edit-table" onclick="abrirModalCrud('${modulo}', ${reg.id})">✏️</button>
        <button class="btn-delete-table" onclick="eliminarRegistroCrud('${modulo}', ${reg.id})">🗑️</button>
      `;
    }
    tr.appendChild(tdAcciones);
    tbody.appendChild(tr);
  });
}

// ================= SECCIÓN 3.1: CICLO DE VIDA DE LA ORDEN DE TRABAJO =================
// Implementa, en el front-end, los métodos de la clase "OrdenTrabajo" definidos
// en el Diagrama de Clases (GA4-220501095-AA2-EV04): cambiarEstado(),
// calcularCosto(), generarFactura() y notificarCambioEstado().

/**
 * Avanza el estado de una orden de trabajo siguiendo la secuencia definida
 * en la clase OrdenTrabajo: PENDIENTE -> EN_PROCESO -> CERRADA -> PENDIENTE.
 * Equivale al método cambiarEstado(nuevoEstado) del diagrama de clases.
 *
 * @param {number} idTarget Id de la orden de trabajo a actualizar.
 */
function cambiarEstadoOrden(idTarget) {
  const orden = datosCrud.servicios.find(item => item.id === idTarget);
  if (!orden) return;

  const indexEstado = camposPorModulo.servicios.indexOf('Estado');
  const secuenciaEstados = ['Pendiente', 'En Proceso', 'Cerrada'];
  const posicionActual = secuenciaEstados.indexOf(orden.valores[indexEstado]);
  const nuevoEstado = secuenciaEstados[(posicionActual + 1) % secuenciaEstados.length];

  orden.valores[indexEstado] = nuevoEstado;
  notificarCambioEstado(orden, nuevoEstado);
  renderTabla('servicios');
}

/**
 * Simula el método notificarCambioEstado() de la clase OrdenTrabajo:
 * informa al usuario (en un sistema real, notificaría al cliente por
 * correo/SMS, tal como se documentó en la clase Notificacion del
 * diagrama de clases).
 *
 * @param {Object} orden      Registro de la orden de trabajo afectada.
 * @param {string} nuevoEstado Nuevo estado asignado a la orden.
 */
function notificarCambioEstado(orden, nuevoEstado) {
  const cliente = orden.valores[camposPorModulo.servicios.indexOf('Cliente')];
  alert(`Orden #${orden.id} (${cliente}): estado actualizado a "${nuevoEstado}".`);
}

/**
 * Calcula el costo estimado de una orden de trabajo según su tipo de
 * servicio. Equivale al método calcularCosto() de la clase OrdenTrabajo.
 * Los valores son tarifas base referenciales del proyecto formativo.
 *
 * @param {string} tipoServicio Tipo de servicio de la orden (CCTV, Redes, ...).
 * @returns {number} Costo estimado en pesos colombianos (COP).
 */
function calcularCostoOrden(tipoServicio) {
  const tarifasBase = {
    'CCTV': 350000,
    'Redes': 220000,
    'Soporte': 120000,
    'Web': 400000
  };
  return tarifasBase[tipoServicio] || 150000; // Tarifa mínima por defecto
}

/**
 * Genera la factura asociada a una orden de trabajo ya "Cerrada" y la
 * agrega al módulo de Facturación. Equivale al método generarFactura()
 * de la clase OrdenTrabajo, que en el diagrama retorna un objeto Factura.
 *
 * @param {number} idTarget Id de la orden de trabajo a facturar.
 */
function generarFacturaOrden(idTarget) {
  const orden = datosCrud.servicios.find(item => item.id === idTarget);
  if (!orden) return;

  const indexEstado = camposPorModulo.servicios.indexOf('Estado');
  if (orden.valores[indexEstado] !== 'Cerrada') {
    alert('Solo se pueden facturar órdenes en estado "Cerrada".');
    return;
  }

  const cliente = orden.valores[camposPorModulo.servicios.indexOf('Cliente')];
  const tipoServicio = orden.valores[camposPorModulo.servicios.indexOf('Tipo de Servicio')];
  const costo = calcularCostoOrden(tipoServicio);

  const nuevaFactura = {
    id: globalCounter++,
    valores: [
      `FAC-${1000 + globalCounter}`,
      cliente,
      tipoServicio,
      `$${costo.toLocaleString('es-CO')}`,
      'Pendiente'
    ]
  };
  datosCrud.facturacion.push(nuevaFactura);

  alert(`Factura generada para la orden #${orden.id} (Cliente: ${cliente}) por $${costo.toLocaleString('es-CO')}.`);
  renderTabla('facturacion');
}

// ================= SECCIÓN 4: CONTROL ROUTING DEL DASHBOARD =================
/**
 * Cambia de sub-módulo dentro del panel administrativo y refresca los
 * datos (tablas o gráficos) del sub-módulo que se muestra.
 * @param {string} submodulo Identificador del sub-módulo (general, almacen, ...).
 */
function navegarDashboard(submodulo) {
  document.querySelectorAll(".dash-section").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".nav-top-link").forEach(lnk => lnk.classList.remove("active"));

  document.getElementById(`dash-${submodulo}`).classList.add("active");
  document.getElementById(`dash-link-${submodulo}`).classList.add("active");

  if (submodulo === 'general') {
    setTimeout(inicializarGraficos, 50);
  } else if (submodulo === 'almacen') {
    renderTabla('almacen');
    renderTabla('consola');
  } else {
    renderTabla(submodulo);
  }
}

// ================= SECCIÓN 5: CONTROL DE CREDENCIALES =================
/**
 * Valida el inicio de sesión del panel administrativo.
 * NOTA DE ARQUITECTURA: esta es una maqueta de front-end sin backend real
 * (ver GA4-220501095-AA2-EV02, Informe de Entregables). Por eso la regla de
 * acceso se limita a validar el dominio institucional del correo. En la
 * implementación final (Laravel + JWT, según el stack definido en el
 * informe técnico) esta función debe reemplazarse por una llamada a la
 * API de autenticación (POST /api/v1/login) que valide usuario y
 * contraseña contra la base de datos, nunca contra un archivo de texto
 * plano en el cliente.
 * @param {Event} event Evento submit del formulario de login.
 */
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const statusBox = document.getElementById("login-status");

  if (email.endsWith("@soy.sena.edu.co") || email.endsWith("@sena.edu.co")) {
    loginExitoso();
  } else {
    statusBox.innerText = "Acceso denegado. Se requiere un correo institucional SENA.";
    statusBox.className = "status-box error";
    statusBox.classList.remove("hidden");
  }
}

function loginExitoso() {
  document.getElementById("public-content").classList.add("hidden");
  document.getElementById("main-header").classList.add("hidden");
  
  document.getElementById("dashboard-wrapper").classList.remove("hidden");
  navegarDashboard('general');
}

function logoutDashboard() {
  document.getElementById("dashboard-wrapper").classList.add("hidden");
  
  document.getElementById("public-content").classList.remove("hidden");
  document.getElementById("main-header").classList.remove("hidden");
  navegar(1);
}

// ================= SECCIÓN 6: GRÁFICOS (CHART.JS) =================
function inicializarGraficos() {
  if (chart1Instance) chart1Instance.destroy();
  if (chart2Instance) chart2Instance.destroy();

  const ctx1 = document.getElementById('chartServicios').getContext('2d');
  chart1Instance = new Chart(ctx1, {
    type: 'doughnut',
    data: {
      labels: ['CCTV', 'Redes', 'Soporte', 'Desarrollo Web'],
      datasets: [{ data: [40, 25, 20, 15], backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981'] }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  const ctx2 = document.getElementById('chartEfectividad').getContext('2d');
  chart2Instance = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['Mantenimiento', 'Instalaciones', 'Garantías', 'Respuestas'],
      datasets: [{ label: 'Efectividad %', data: [95, 92, 88, 98], backgroundColor: '#475569' }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

// ================= SECCIÓN 7: CAROUSEL PÚBLICO =================
const serviciosData = [
  { titulo: "Circuito Cerrado de Televisión (CCTV)", desc: "Diseño, montaje y monitorización remota en HD.", img: "./img/cctv_v1.png" },
  { titulo: "Estructuración de Redes de Datos", desc: "Instalación de racks, cableado estructurado y switches.", img: "./img/redes_v1.jpg" },
  { titulo: "Soporte Técnico de Computadores", desc: "Mantenimiento predictivo, preventivo y correctivo de hardware.", img: "./img/servicios_v1.jpg" },
  { titulo: "Desarrollo Web Informativo", desc: "Maquetación responsive e interfaces accesibles.", img: "./img/soporte_v1.png" }
];

let slideActual = 0;
function renderSlide() {
  const item = serviciosData[slideActual];
  const imgEl = document.getElementById("carousel-img");
  if (imgEl) imgEl.src = item.img;
  
  const titleEl = document.getElementById("carousel-title");
  if (titleEl) titleEl.innerText = item.titulo;

  const descEl = document.getElementById("carousel-desc");
  if (descEl) descEl.innerText = item.desc;
  
  const dotsContainer = document.getElementById("carousel-dots");
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    serviciosData.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.className = `dot ${idx === slideActual ? 'active' : ''}`;
      dot.onclick = () => { slideActual = idx; renderSlide(); };
      dotsContainer.appendChild(dot);
    });
  }
}

function siguienteSlide() { slideActual = (slideActual + 1) % serviciosData.length; renderSlide(); }
function anteriorSlide() { slideActual = (slideActual - 1 + serviciosData.length) % serviciosData.length; renderSlide(); }
function irAlServicio(idx) { navegar(2); slideActual = idx; renderSlide(); }

// ================= SECCIÓN 8: FORMULARIO DE SOLICITUD DE SERVICIO =================
function handleSolicitud(event) {
  event.preventDefault();
  const statusBox = document.getElementById("solicitud-status");

  statusBox.innerText = idiomaActual === "ES"
    ? "¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto."
    : "Request sent successfully! We will contact you soon.";
  statusBox.className = "status-box success";
  statusBox.classList.remove("hidden");

  document.getElementById("form-solicitud").reset();
}

// ================= SECCIÓN 9: CONTACTO POR WHATSAPP =================
const numeroWhatsapp = "573215583422";

function contactarWhatsapp() {
  const mensaje = idiomaActual === "ES"
    ? "Buenos días, mi nombre es [Nombre]. Me gustaría obtener más información sobre los servicios de CoVigilant (CCTV, redes, soporte técnico o desarrollo web). Quedo atento(a) a su respuesta."
    : "Good morning, my name is [Name]. I would like more information about CoVigilant's services (CCTV, networks, technical support, or web development). I look forward to your response.";

  const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

window.onload = () => { renderSlide(); };