# Documento de requerimientos del software

**UNIVERSIDAD TECNOLÓGICA DE PEREIRA**  
**FACULTAD DE INGENIERÍAS**  
**LABORATORIO DE SOFTWARE**

**DOCUMENTO DE REQUERIMIENTOS DEL SOFTWARE**

**Proyecto:** Sistema de gestión para inmobiliarias  
**Versión:** 1.0  
**Fecha:** Lunes 2 de marzo de 2026

**Equipo de Desarrollo:** Juan José Bautista Muñoz, Daniel Alejandro Moreno Herrera, Emily Perea Córdoba, Isabela Villada Osorio 

# 

# **1\. INTRODUCCIÓN**

**1.1. Propósito**

Este documento describe los requerimientos del sistema de gestión para inmobiliarias. Su objetivo es definir con claridad las necesidades del cliente y los criterios de aceptación del software.

**1.2. Alcance**

El sistema permitirá a la inmobiliaria gestionar inmuebles en arriendo y venta, controlar clientes, administrar contratos, registrar pagos, gestionar procesos de mantenimiento y ofrecer un chatbot de consulta. El software cubrirá actividades operativas, administrativas y de seguimiento, centralizando toda la información en una única plataforma.

**1.3. Definiciones, Acrónimos y Abreviaturas**

**Chatbot:** Herramienta de consulta automatizada para usuarios externos

**Inmueble:** Propiedad registrada en el sistema para su arriendo o venta

**Contrato de Arriendo:** Documento legal que vincula a un arrendatario y un propietario sobre un inmueble mediante el pago de un canon mensual.

**Contrato de Administración:** Contrato entre la inmobiliaria y el propietario para gestionar el arriendo y mantenimiento de una propiedad.

**Promesa de Compraventa**: Acuerdo preliminar donde se pacta el precio, arras y fecha de escrituración para la venta de un inmueble.

**RF:** Requerimiento funcional

**RNF:** Requerimiento no funcional

**RS:** Requerimiento de seguridad

**CU:** Caso de uso

**INT:** Integer (Tipo de dato entero para identificadores).

**FK:** Foreign Key (Llave foránea en la base de datos que referencia otra tabla).

**VARCHAR:** Variable Character (Tipo de dato para cadenas de texto).

**ENUM:** Enumerado (Tipo de dato que permite elegir entre una lista de opciones fijas).

**WCAG:** Web Content Accessibility Guidelines (Estándares de accesibilidad web mencionados en los RNF).

**NIT:** Número de Identificación Tributaria (Identificador para clientes de persona jurídica).

**HTTPS:** Hypertext Transfer Protocol Secure (Protocolo de comunicación segura).

# 

# **2\. DESCRIPCIÓN GENERAL**

**2.1. Perspectiva del Producto**

El Sistema de Gestión de Inmobiliaria funcionará como una solución independiente basada en web, accesible desde navegadores modernos, actuará como una plataforma centralizada que integra todos los procesos principales de una inmobiliaria en un solo entorno digital, donde se reemplazarán ciertos procesos que actualmente se realizan de forma manual, permitiendo una obtener mayor eficiencia, organización y trazabilidad.

Interactuara con módulos internos: administración, propiedades, clientes, contratos, pagos, mantenimiento y chatbot, aplicando las reglas del negocio para asegurar coherencia en todas las operaciones. El chatbot, permitirá a usuarios externos consultar inmuebles, conocer requisitos y generar solicitudes de forma automatizada, ampliando la accesibilidad del servicio.

**2.2. Características del Usuario**

- **Administrador**: Es responsable de gestionar usuarios, roles, parámetros del sistema, plantillas y configuraciones generales. Debe contar con conocimientos básicos en operación de software y comprensión de los procesos internos de la inmobiliaria. Este usuario tiene el nivel más alto de permisos.   
- **Asesor**: Se encarga de registrar clientes, gestionar propiedades y contratos. Interactúa con el sistema para gestionar solicitudes, visitas, mantenimiento y seguimiento de clientes. Su conocimiento técnico requerido es básico, enfocado en el uso operativo del sistema, pero debe tener conocimiento en asesoría de inmuebles.  
- **Cliente(arrendatario/propietario)**: Usuario externo que interactúa mediante el chatbot y el portal web para realizar consultas, solicitar información, registrar solicitudes o agendar visitas. Su uso del sistema es limitado, intuitivo y no requiere conocimientos técnicos .

**2.3. Suposiciones y Dependencias**

* Se asume que la inmobiliaria proveerá acceso a internet estable para garantizar el funcionamiento continuo del sistema web.  
* Los usuarios contarán con dispositivos compatibles como computadores, tablets o smartphones.  
* La empresa deberá suministrar información inicial como inventario de propiedades, datos de clientes y documentos de contratos existentes.  
* El correcto funcionamiento del chatbot dependerá de la estabilidad de su integración tecnológica.  
* Se asume disponibilidad del personal para capacitaciones y validación del software.


# 

# **3\. REQUERIMIENTOS ESPECÍFICOS**

**3.1. Requerimientos Funcionales**

| CÓDIGO | REQUISITO | MÓDULO | PRIORIDAD |
| :---- | :---- | :---- | :---- |
| **RF-01** | El sistema deberá permitir al administrador crear nuevos usuarios del sistema. | Administración | **ALTA** |
| **RF-02** | El sistema deberá permitir al administrador editar la información de los usuarios registrados. | Administración | **ALTA** |
| **RF-03** | El sistema deberá permitir al administrador crear, modificar o eliminar roles dentro del sistema. | Administración | **MEDIA** |
| **RF-04** | El sistema deberá permitir al administrador asignar roles y permisos de los usuarios del sistema. | Administración | **ALTA** |
| **RF-05** | El sistema deberá permitir al administrador consultar la lista de usuarios registrados, mostrando toda la información relacionada. | Administración | **ALTA** |
| **RF-06** | El sistema deberá permitir al administrador configurar los tipos de contrato disponibles en el sistema. | Administración | **ALTA** |
| **RF-07** | El sistema deberá permitir al administrador definir y modificar los estados de los inmuebles. | Administración | **MEDIA** |
| **RF-08** | El sistema deberá permitir al administrador configurar los porcentajes de comisión aplicables a los asesores o a la inmobiliaria. | Administración | **ALTA** |
| **RF-09** | El sistema deberá permitir al administrador asignar un esquema de comisión a uno o varios asesores del sistema.  | Administración | **MEDIA** |
| **RF-10** | El sistema deberá permitir al administrador gestionar plantillas de documentos, como contratos o formularios utilizados por el sistema. | Administración | **BAJA** |
| **RF-11** | El sistema deberá permitir al administrador definir los documentos obligatorios según el tipo de contrato. | Administración | **ALTA** |
| **RF-12** | El sistema deberá permitir al administrador configurar parámetros generales del sistema, necesarios para el correcto funcionamiento de los módulos. | Administración | **MEDIA** |
| **RF-13** | El sistema deberá permitir registrar nuevos inmuebles con información como tipo, modalidad (arriendo, venta o ambos), dirección, ubicación, área, precio y características generales. | Propiedades | **ALTA** |
| **RF-14** | El sistema deberá permitir adjuntar fotografías a cada inmueble registrado. | Propiedades | **MEDIA** |
| **RF-15** | El sistema deberá permitir clasificar los inmuebles según tipo (casa, apartamento, local, etc.). | Propiedades | **ALTA** |
| **RF-16** | El sistema deberá permitir establecer el estado del inmueble (disponible, arrendado, vendido o en mantenimiento). | Propiedades | **ALTA** |
| **RF-17** | El sistema deberá permitir consultar y buscar inmuebles mediante filtros como ubicación, tipo, precio o disponibilidad. | Propiedades | **ALTA** |
| **RF-18** | El sistema deberá permitir editar la información de los inmuebles registrados. | Propiedades | **ALTA** |
| **RF-19** | El sistema deberá mantener un historial de cambios realizados en cada inmueble, incluyendo modificaciones de precio y disponibilidad. | Propiedades | **MEDIA** |
| **RF-20** | El sistema deberá permitir registrar clientes incluyendo información de contacto como nombre, documento, teléfono y correo electrónico. | Clientes | **ALTA** |
| **RF-21** | El sistema deberá permitir clasificar a los clientes como propietarios, arrendatarios o prospectos. | Clientes | **ALTA** |
| **RF-22** | El sistema deberá permitir actualizar la información de contacto de los clientes registrados. | Clientes | **MEDIA** |
| **RF-23** | El sistema deberá permitir registrar el historial de interacciones con los clientes, incluyendo llamadas, mensajes o solicitudes de información. | Clientes | **MEDIA** |
| **RF-24** | El sistema deberá permitir registrar solicitudes de visita de los clientes a los inmuebles disponibles. | Clientes | **ALTA** |
| **RF-25** | El sistema deberá permitir asociar clientes con inmuebles de interés o negociación. | Clientes | **ALTA** |
| **RF-26** | El sistema deberá permitir asociar clientes con contratos relacionados con inmuebles. | Clientes | **MEDIA** |
| **RF-27** | El sistema deberá permitir consultar clientes mediante filtros como nombre, documento o tipo de cliente. | Clientes | **ALTA** |
| **RF-28** | El sistema debe permitir crear y gestionar contratos de arriendo y promesas de compraventa. | Contratos | **ALTA** |
| **RF-29** | El sistema debe alertar sobre vencimientos de contratos y permitir su renovación o finalización. | Contratos | **MEDIA** |
| **RF-30** | El sistema debe permitir la firma digital de contratos. | Contratos | **ALTA** |
| **RF-31** | El sistema debe permitir gestionar los documentos requeridos por tipo de contrato. | Contratos | **ALTA** |
| **RF-32** | El sistema debe permitir registrar la escrituración y finalización de contratos de venta. | Contratos | **MEDIA** |
| **RF-33** | El sistema debe permitir registrar la terminación anticipada de un contrato. | Contratos | **ALTA** |
| **RF-34** | El sistema debe generar automáticamente las cuotas de pago asociadas a un contrato activo. | Pagos | **ALTA** |
| **RF-35** | El sistema debe registrar los pagos realizados sobre los cobros de un contrato. | Pagos | **ALTA** |
| **RF-36** | El sistema debe detectar y gestionar cobros en mora. | Pagos | **ALTA** |
| **RF-37** | El sistema debe calcular intereses de mora sobre cobros vencidos cuando aplique. | Pagos | **MEDIA** |
| **RF-38** | El sistema debe enviar notificaciones y recordatorios de pago a las partes involucradas. | Pagos | **MEDIA** |
| **RF-39** | El sistema debe permitir consultar el estado de cuenta de un contrato. | Pagos | **MEDIA** |
| **RF-40** | El sistema debe permitir generar reportes financieros de ingresos. | Pagos | **MEDIA** |
| **RF-41** | El sistema debe permitir registrar una solicitud de mantenimiento asociada a un inmueble, incluyendo descripción del problema, prioridad y evidencias. | Mantenimiento | **ALTA** |
| **RF-42** | El sistema debe permitir asignar un técnico o proveedor a una solicitud de mantenimiento registrada. | Mantenimiento | **ALTA** |
| **RF-43** | El sistema debe permitir actualizar el estado de una solicitud de mantenimiento (pendiente, en proceso, finalizado o cancelado). | Mantenimiento | **ALTA** |
| **RF-44** | El sistema debe permitir registrar el costo asociado a un mantenimiento realizado en un inmueble. | Mantenimiento | **MEDIA** |
| **RF-45** | El sistema debe permitir consultar el historial de mantenimientos realizados a un inmueble, incluyendo fechas, estado y costos. | Mantenimiento | **MEDIA** |
| **RF-46** | El sistema debe permitir que el cliente consulte inmuebles disponibles mediante filtros como zona, tipo y precio.  | Chatbot | **ALTA** |
| **RF-47** | El sistema debe permitir que el chatbot brinde información sobre los requisitos para arrendar o comprar un inmueble. | Chatbot | **MEDIA** |
| **RF-48** | El sistema debe permitir que el cliente agende visitas a un inmueble disponible indicando fecha y hora.  | Chatbot | **ALTA** |
| **RF-49** | El sistema debe permitir registrar solicitudes de información sobre un inmueble junto con los datos de contacto del cliente. | Chatbot | **MEDIA** |
| **RF-50** | El sistema debe permitir transferir la conversación del chatbot a un asesor humano cuando el cliente lo solicite. | Chatbot | **MEDIA** |

**3.2. Requerimientos No Funcionales**

| CÓDIGO | REQUERIMIENTO | TIPO | PRIORIDAD |
| ----- | ----- | ----- | ----- |
| **RNF-01** | El sistema debe procesar operaciones comunes de registro, consulta y actualización en un tiempo máximo de 2 segundos, incluso cuando hay carga moderada de usuarios. | Rendimiento | **ALTA** |
| **RNF-02** | El sistema debe soportar un mínimo de 300 usuarios concurrentes sin afectar la estabilidad ni generar caídas en el servicio. |  | **ALTA** |
| **RNF-03** | El sistema deberá estar disponible 24 horas al día, 7 días a la semana, permitiendo el acceso a los usuarios en cualquier momento. | Disponibilidad | **ALTA** |
| **RNF-04** | El sistema debe prevenir accesos no autorizados a los datos mediante mecanismos de autenticación y control de permisos | Seguridad | **ALTA** |
| **RNF-05** | Los únicos que pueden acceder a la información, realizar operaciones y hacer cambios en la base de datos con la información de todos los trabajadores son los usuarios administradores. |  | **ALTA** |
| **RNF-06** | El sistema deberá aplicar control de acceso basado en roles, restringiendo las funciones según el tipo de usuario. |  | **ALTA** |
| **RNF-07** | La interfaz debe ser clara e intuitiva para cualquier tipo de usuario externo (investigar estandares WCAG) | Usabilidad | **MEDIA** |
| **RNF-08** | El chatbot deberá ofrecer una interacción clara y sencilla para facilitar las consultas de los clientes externos. |  | **MEDIA** |
| **RNF-09** | El sistema debe ser accesible desde diferentes dispositivos, ya sea computadoras, tablets o smartphone para garantizar su usabilidad cuando sea necesario en diferentes escenarios | Compatibilidad | **ALTA** |
| **RNF-10** | El sistema debe generar copias de seguridad automáticas cada 24 horas para prevenir pérdida de datos. | Confiabilidad | **ALTA** |
| **RNF-11** | En caso de fallos del sistema, deberá existir un mecanismo que permita recuperar la información en el menor tiempo posible. |  | **ALTA** |
| **RNF-12**  | El sistema debe estar documentado para facilitar mantenimiento y actualizaciones con bajo impacto. | Mantenibilidad | **MEDIA** |
| **RNF-13** | El sistema deberá permitir incorporar nuevos módulos o funcionalidades en el futuro sin afectar el funcionamiento actual. | Escalabilidad | **MEDIA** |
| **RNF-14** | La base de datos deberá soportar el crecimiento progresivo de información relacionada con propiedades, clientes, contratos y pagos. |  | **MEDIA** |
| **RNF-15** | El sistema debe ser compatible y capaz de integrarse con otros sistemas y aplicaciones utilizados en el mismo entorno, asegurando la comunicación fluida, el intercambio de datos y la correcta interacción entre componentes. | Interoperabilidad | **ALTA** |
| **RNF-16** | El sistema debe poder ejecutarse en diferentes plataformas, sistemas operativos y dispositivos. | Portabilidad | **BAJA** |

**3.3. Requerimientos de Datos**

Se utilizará la base de datos relacional PostgreSQL alojada en render. A continuación se listan las entidades principales del sistema y un diagrama de entidad relación que detalla las relaciones entre ellas.

**Entidades de datos:** [Documento\_Proyecto](https://docs.google.com/document/d/1A8wj4XmxuYxglSDN5PG_CMVy2mX0hrRn3D9bxRmoZO8/edit?tab=t.uuzhbyiex97m)

**Diagrama entidad relación**

**3.4. Requerimientos de Seguridad**

| CÓDIGO | REQUERIMIENTO | PRIORIDAD |
| ----- | ----- | :---: |
| **RS-01** | El sistema debe requerir autenticación de usuario mediante credenciales (usuario y contraseña) para acceder a la plataforma. | **ALTA** |
| **RS-02** | El sistema debe implementar control de acceso basado en roles, permitiendo que cada usuario acceda únicamente a las funciones autorizadas según su perfil. | **ALTA** |
| **RS-03** | El sistema debe proteger las contraseñas de los usuarios mediante mecanismos de encriptación o hash seguro. | **ALTA** |
| **RS-04** | El sistema debe utilizar protocolos de comunicación seguros (por ejemplo HTTPS) para proteger la información transmitida entre el usuario y el sistema. | **ALTA** |
| **RS-05** | El sistema debe registrar un historial de accesos y actividades realizadas por los usuarios para efectos de auditoría y control. | **MEDIA** |
| **RS-06** | El sistema debe bloquear temporalmente una cuenta después de varios intentos fallidos de inicio de sesión para prevenir accesos no autorizados. | **MEDIA** |
| **RS-07** | El sistema debe garantizar la privacidad de la información personal de los clientes, evitando accesos no autorizados o divulgación de datos. | **ALTA** |
| **RS-08** | El sistema debe realizar copias de seguridad periódicas de la información almacenada para prevenir pérdida de datos ante fallos o ataques. | **MEDIA** |
| **RS-09** | El sistema debe permitir cerrar automáticamente la sesión de los usuarios después de un periodo de inactividad para evitar accesos no autorizados. | **MEDIA** |

**3.5. Restricciones del Sistema**

Limitaciones técnicas o de negocio que influyen en el desarrollo del software.

**Restricciones legales**

* El periodo de gracia para el cálculo de mora se rige de acuerdo a la ley 820 de 2003 (5 días hábiles por defecto).  
* La tasa de interés de mora no puede superar el límite legal vigente.  
* La comisión por venta está fija a 3%.  
* Los intereses de mora solo aplican a inmuebles comerciales, en contratos de arriendo residencial la mora no genera intereses.  
* El sistema debe cumplir con la Ley 1581 de 2012(Habeas Data) en el tratamiento de datos personales de los clientes.

**Restricciones de integración**

* Las notificaciones se harán solo por dos canales: whatsapp y/o correo electrónico.  
* La firma digital dependerá exclusivamente de DocuSign, si no está disponible, el flujo se bloquea.  
* El sistema no incluye integración con pasarelas de pago; los pagos se registran manualmente por el asesor con el soporte de comprobante de pago.

**Restricciones técnicas**

* El sistema será web, no tendrá una aplicación móvil nativa.  
* El sistema depende de conexión a internet estable para su funcionamiento, no funciona en modo offline.  
* Los archivos adjuntos (comprobantes, escrituras, documentos) deben estar en formato PDF, JPG o PNG y no superar los 10 MB por archivo.

**Restricciones de negocio**

* Un contrato no puede activarse sin que todas las partes hayan firmado.  
* No se puede eliminar un tipo de contrato o plantilla que esté en uso.  
* Una propiedad solo puede tener un contrato activo a la vez.  
* No se puede eliminar un cliente que tenga contratos activos.  
* Un contrato de administración solo puede existir vinculado a un contrato de arriendo activo.

**Restricciones de funcionalidad**

* Un contrato solo puede pasar al estado “Enviado a firmas” si todos los documentos requeridos según el tipo de contrato están cargados en el sistema.  
* El sistema no puede generar cuotas de pago hasta que el contrato se encuentre en estado activo.  
* El periodo de gracia de mora es configurable por el administrador; si no se configura el sistema aplica 5 días hábiles por defecto según la ley 820 de 2003\.  
* Un inmueble sólo puede asociarse a un contrato nuevo si se encuentra en estado disponible.  
* La renovación de un contrato genera un nuevo contrato en estado borrador con los datos del anterior y no modifica el contrato original.


# 

# **4\. IDENTIFICACIÓN DE STAKEHOLDERS**

* **Administradores del Sistema:** Tienen el control total. Configuran roles, permisos, parámetros de ley (como la Ley 820 de 2003\) y plantillas de contratos. I

  Interés: Que el sistema sea seguro, centralice la información y permita auditoría (RS-05).

* **Asesores Inmobiliarios:** Usuarios operativos. Registran inmuebles, gestionan clientes, suben documentos de escrituración y generan reportes financieros.

  Interés**:** Agilidad en el registro de datos y que el sistema les avise automáticamente sobre vencimientos o pagos pendientes.

* **Equipo de Desarrollo:** Responsables de la creación, mantenimiento y despliegue del software.

  Interés: Que los requerimientos sean claros, que la arquitectura sea estable y que el sistema sea escalable.

* **Propietarios:** Dueños de los inmuebles.

  Interés: Ver el estado de sus propiedades (arrendado/vendido) y asegurar que los pagos y comisiones se gestionen correctamente.

* **Arrendatarios / Compradores:** Pagan por el uso o adquisición del inmueble.

  Interés: Recibir notificaciones de pago por WhatsApp/Correo, poder firmar digitalmente y usar el chatbot para consultas rápidas.

* **Prospectos:** Personas interesadas que aún no tienen contrato.

  Interés: Que el chatbot y el portal web sean intuitivos (RNF-07) para buscar inmuebles y agendar visitas.

# 

# **5\. MODELOS Y DIAGRAMAS**

**5.1. Diagrama de Casos de Uso**

Representación gráfica de las interacciones de los usuarios con el sistema y casos de uso textuales.

[Diagrama de casos de uso](https://docs.google.com/document/d/1xNTmPnp_ZsTe9WFurOYGpsHYB7xgoZPB5WAB-DM350w/edit?usp=sharing)

# 

# 

# **6\. APROBACIÓN DEL DOCUMENTO**

**6.1. Firmas de Aprobación**

|  Nombre Cargo Firma Emily Perea Córdoba Desarrollo Frontend Juan Jose Bautista Muñoz Product Owner Daniel Alejandro Moreno Herrera Scrum Master Isabela Villada Osorio Desarrollo Backend  |  |  |  |
| ----- | :---- | :---- | :---- |
|  |  |  |  |
|  |  |  |  |

**7\. ANEXOS**

**[Casos de uso](https://docs.google.com/document/d/1pDLOm7ZqNT1FoPEW-KDIeTiTbD1noJj7qrBLevx2mpA/edit?tab=t.alkuv4lr2rnn)**

# Entidades de datos

**ENTIDADES DE DATOS**

**Modulo Contratos**

**Contrato**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único del contrato |
| asesor\_responsable\_id | INT (FK) | Referencia al asesor asignado |
| fecha\_creacion | DATE | Fecha en que se creó el contrato |
| tipo | ENUM | arriendo / administración / compraventa |
| estado | ENUM | borrador / en\_firmas / activo / en\_escrituración / pendiente\_registro /por\_vencer / vencido\_con\_saldos / terminacion\_en\_disputa / terminado\_anticipadamente / finalizado |
| inmueble\_id | INT (FK) | Referencia al inmueble vinculado |

**Contrato de Arriendo**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| contrato\_id | INT (FK) | Referencia al contrato base |
| canon | DECIMAL | Valor mensual del arriendo |
| depósito | DECIMAL | Valor de garantía entregado al inicio |
| fecha\_inicio | DATE | Fecha de inicio del contrato |
| fecha\_fin | DATE | Fecha de vencimiento del contrato |
| arrendatario\_id | INT (FK) | Referencia al cliente arrendatario |
| propietario\_id | INT (FK) | Referencia al cliente propietario |

**Contrato de Administración**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| contrato\_arriendo\_id | INT (FK) | Referencia al contrato de arriendo vinculado |
| comision | DECIMAL | Porcentaje o valor de la comisión de administración |
| fecha\_inicio | DATE | Fecha de inicio del contrato de administración |
| fecha\_fin | DATE | Fecha de vencimiento del contrato de administración |

**Contrato de Promesa de Compraventa**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| contrato\_id | INT (FK) | Referencia al contrato base |
| precio | DECIMAL | Precio total pactado del inmueble |
| valor\_arras | DECIMAL | Pago anticipado como señal de compromiso |
| fecha\_escrituracion | DATE | Fecha acordada para la escrituración |
| forma\_pago | ENUM | contado / credito\_hipotecario / mixto |
| comprador\_id | INT (FK) | Referencia al cliente comprador |
| vendedor\_id | INT (FK) | Referencia al cliente vendedor |

**Cliente**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único del cliente |
| telefono | VARCHAR | Número de contacto (también usado para WhatsApp) |
| correo | VARCHAR | Correo electrónico para notificaciones |
| direccion | VARCHAR | Dirección de residencia o domicilio |

**Cliente Persona Natural**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| cliente\_id | INT (FK) | Referencia al cliente base |
| tipo\_identificacion | ENUM | Cédula de ciudadanía / cédula de extranjería / pasaporte |
| numero\_identificacion | VARCHAR | Número del documento de identidad |
| nombre | VARCHAR | Nombre(s) de la persona |
| apellidos | VARCHAR | Apellidos de la persona |
| fecha\_nacimiento | DATE | Fecha de nacimiento |
| genero | ENUM | Género de la persona |

**Cliente Persona Jurídica**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| cliente\_id | INT (FK) | Referencia al cliente base |
| NIT | VARCHAR | Número de identificación tributaria |
| razon\_social | VARCHAR | Nombre legal de la empresa |
| nombre\_representante\_legal | VARCHAR | Nombre del representante legal |
| cedula\_representante\_legal | VARCHAR | Cédula del representante legal |

**TipoDocumento**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único del tipo de documento |
| nombre | VARCHAR | Nombre del documento (ej: Cédula de ciudadanía) |
| tipo\_persona | ENUM | natural / jurídica / ambos |
| tipo\_inmueble | ENUM | residencial / comercial / ambos |
| requiere\_codeudor | BOOLEAN | Indica si aplica solo cuando hay codeudor |
| obligatorio | BOOLEAN | Indica si el documento es obligatorio |

**Documento**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único del documento |
| tipo\_documento\_id | INT (FK) | Referencia al tipo de documento |
| cliente\_id | INT (FK) | Referencia al cliente (nullable) |
| contrato\_id | INT (FK) | Referencia al contrato (nullable) |
| cargado\_por\_id | INT (FK) | Referencia al asesor que cargó el documento |
| archivo | VARCHAR | Ruta o referencia al archivo almacenado |
| fecha\_carga | DATE | Fecha en que se cargó el documento |
| estado | ENUM | pendiente / recibido / rechazado |

**Firma**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único de la firma |
| cliente\_id | INT (FK) | Referencia al cliente que firmó |
| contrato\_id | INT (FK) | Referencia al contrato firmado |
| estado | ENUM | pendiente / firmado / rechazado |
| fecha\_hora | DATETIME | Fecha y hora en que se realizó la firma |
| referencia\_docusign | VARCHAR | Identificador en DocuSign (pendiente definir) |

**Modulo Pagos y Mora**

**Cobro**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único del cobro |
| contrato\_id | INT (FK) | Referencia al contrato asociado |
| tipo | ENUM | canon / comisión / arras / depósito / penalización / precio\_venta |
| valor | DECIMAL | Valor total del cobro |
| fecha\_limite | DATE | Fecha máxima de pago |
| estado | ENUM | pendiente / pagado / en\_mora |

**Pago**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único del pago |
| cobro\_id | INT (FK) | Referencia al cobro al que aplica |
| valor | DECIMAL | Valor efectivamente pagado |
| fecha | DATE | Fecha en que se registró el pago |
| comprobante | VARCHAR | Archivo del comprobante de pago |
| registrado\_por\_id | INT (FK) | Referencia al asesor que registró el pago |

**InteresMora**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| cobro\_id | INT (FK) | Referencia al cobro en mora |
| tasa\_aplicada | DECIMAL | Tasa de interés aplicada |
| valor\_calculado | DECIMAL | Valor de los intereses calculados |
| fecha\_inicio\_calculo | DATE | Fecha en que inició el cálculo de intereses |
| fecha\_ultimo\_calculo | DATE | Fecha del último recálculo diario |

**NotificacionEnvio**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| cobro\_id | INT (FK) | Referencia al cobro asociado |
| canal | ENUM | correo / whatsapp |
| tipo\_mensaje | ENUM | recordatorio / mora |
| fecha\_envio | DATETIME | Fecha y hora en que se envió la notificación |

**Modulo Administración**

**Usuario**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| nombre | VARCHAR | Nombre del usuario |
| correo | VARCHAR | Correo electrónico (único) |
| contraseña | VARCHAR | Hash de la contraseña |
| estado | ENUM | activo / inactivo |
| fecha\_creacion | DATE | Fecha de registro |

**Rol**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| nombre | VARCHAR | Nombre del rol (único) |
| descripcion | VARCHAR | Descripción del rol |

**UsuarioRol**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| usuario\_id | INT (FK) | Referencia al usuario |
| rol\_id | INT (FK) | Referencia al rol |

**Permiso**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| nombre | VARCHAR | Nombre del permiso |
| descripcion | VARCHAR | Descripción |

**RolPermiso**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| rol\_id | INT (FK) | Referencia al rol |
| permiso\_id | INT (FK) | Referencia al permiso |

**EsquemaComision**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| nombre | VARCHAR | Nombre del esquema |
| porcentaje | DECIMAL | Porcentaje de comisión |
| condiciones | VARCHAR | Condiciones aplicables |
| estado | ENUM | activo / inactivo |

**AsesorComision**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| usuario\_id | INT (FK) | Referencia al asesor |
| esquema\_id | INT (FK) | Referencia al esquema |
| fecha\_asignacion | DATE | Fecha de asignación |

**Modulo Propiedades**

**Inmueble**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| tipo | ENUM | casa / apartamento / local / otro |
| modalidad | ENUM | arriendo / venta / ambos |
| direccion | VARCHAR | Dirección del inmueble |
| ubicacion | VARCHAR | Ciudad / barrio |
| area | DECIMAL | Área en m² |
| precio | DECIMAL | Precio de arriendo o venta |
| estado | ENUM | disponible / arrendado / en\_proceso\_venta / vendido / en\_mantenimiento |
| publicado | BOOLEAN | Si está publicado en el portal |
| propietario\_id | INT (FK) | Referencia al cliente propietario |
| fecha\_registro | DATE | Fecha de registro |

**FotografiaInmueble**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| inmueble\_id | INT (FK) | Referencia al inmueble |
| archivo | VARCHAR | Ruta del archivo |
| fecha\_carga | DATE | Fecha de carga |

**HistorialInmueble**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| inmueble\_id | INT (FK) | Referencia al inmueble |
| campo\_modificado | VARCHAR | Campo que cambió |
| valor\_anterior | VARCHAR | Valor previo |
| valor\_nuevo | VARCHAR | Nuevo valor |
| fecha | DATETIME | Fecha del cambio |
| usuario\_id | INT (FK) | Quién hizo el cambio |

**Modulo Clientes**

**SolicitudVisita**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| cliente\_id | INT (FK) | Referencia al cliente |
| inmueble\_id | INT (FK) | Referencia al inmueble |
| fecha\_hora | DATETIME | Fecha y hora de la visita |
| estado | ENUM | pendiente / confirmada / cancelada |
| asesor\_id | INT (FK) | Asesor asignado |

**InteraccionCliente**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| cliente\_id | INT (FK) | Referencia al cliente |
| tipo | ENUM | llamada / mensaje / visita / solicitud |
| descripcion | VARCHAR | Detalle de la interacción |
| fecha | DATETIME | Fecha de la interacción |
| usuario\_id | INT (FK) | Asesor que registró |

**ClienteInmueble**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| cliente\_id | INT (FK) | Referencia al cliente |
| inmueble\_id | INT (FK) | Referencia al inmueble |
| tipo\_interes | ENUM | propietario / arrendatario / prospecto |

**Modulo Mantenimiento**

**SolicitudMantenimiento**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| inmueble\_id | INT (FK) | Referencia al inmueble |
| descripcion | VARCHAR | Descripción del problema |
| prioridad | ENUM | baja / media / alta |
| estado | ENUM | pendiente / en\_proceso / finalizado / cancelado |
| proveedor\_id | INT (FK) | Técnico o proveedor asignado (nullable) |
| costo | DECIMAL | Costo del mantenimiento (nullable) |
| fecha\_registro | DATE | Fecha de registro |
| registrado\_por\_id | INT (FK) | Usuario que registró |

**EvidenciaMantenimiento**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| solicitud\_id | INT (FK) | Referencia a la solicitud |
| archivo | VARCHAR | Ruta del archivo |
| fecha\_carga | DATE | Fecha de carga |

**Proveedor**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| nombre | VARCHAR | Nombre del proveedor o técnico |
| especialidad | VARCHAR | Tipo de servicio que ofrece |
| telefono | VARCHAR | Contacto |
| correo | VARCHAR | Correo electrónico |

**Modulo Chatbot**

**SolicitudInformacion**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| nombre\_contacto | VARCHAR | Nombre del interesado |
| telefono | VARCHAR | Teléfono de contacto |
| correo | VARCHAR | Correo de contacto |
| inmueble\_id | INT (FK) | Inmueble de interés (nullable) |
| mensaje | VARCHAR | Consulta realizada |
| fecha | DATETIME | Fecha de la solicitud |
| atendido\_por\_id | INT (FK) | Asesor asignado (nullable) |

**ConversacionChatbot**

| Atributo | Tipo | Descripción |
| :---- | :---- | :---- |
| id | INT | Identificador único |
| fecha\_inicio | DATETIME | Inicio de la conversación |
| estado | ENUM | activa / transferida / cerrada |
| asesor\_id | INT (FK) | Asesor al que se transfirió (nullable) |
| solicitud\_id | INT (FK) | Solicitud generada si aplica (nullable) |

