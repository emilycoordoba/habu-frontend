# Lista de casos de uso

**Lista de Casos de uso**

| Id | Actor Principal | Nombre |
| :---- | :---- | :---- |
| CU\_01 | Administrador | Gestionar usuarios |
| CU\_02 | Administrador | Gestionar roles |
| CU\_03 | Administrador | Asignar roles a usuarios |
| CU\_04 | Administrador | Gestionar permisos |
| CU\_05 | Administrador | Configurar comisiones |
| CU\_06 | Administrador | Asignar comisión a asesor |
| CU\_07 | Administrador | Gestionar estado de inmueble |
| CU\_08 | Administrador | Gestionar tipos de contrato |
| CU\_09 | Administrador | Configurar plantillas de documentos |
| CU\_10 | Administrador | Configurar documentos requeridos |
| CU\_11 | Administrador | Registrar propiedad |
| CU\_12 | Administrador | Editar propiedad |
| CU\_13 | Administrador | Eliminar propiedad |
| CU\_14 | Administrador | Ver historial de propiedad |
| CU\_15 | Administrador | Gestionar fotografías |
| CU\_16 | Administrador | Publicar propiedad |
| CU\_17 | Administrador | Cambiar estado de disponibilidad |
| CU\_18 | Administrador | Registrar Cliente |
| CU\_19 | Administrador | Editar Cliente |
| CU\_20 | Administrador | Eliminar Cliente |
| CU\_21 | Administrador | Historial de Interacciones |
| CU\_ 22 | Administrador | Asociar Cliente a Inmueble |
| CU\_23 | Administrador | Registrar Solicitud de Visita |
| CU\_24 | Administrador | Gestionar Perfil del Cliente |
| CU\_25 | Asesor | Iniciar contrato |
| CU\_26 | Asesor | Crear contrato de arriendo |
| CU\_27 | Asesor | Crear promesa de compraventa |
| CU\_28 | Asesor | Gestionar documentos y enviar a firmas |
| CU\_29 | Sistema, Propietario, Arrendatario | Firmar y activar contrato |
| CU\_30 | Asesor | Registrar escrituración y finalizar venta |
| CU\_31 | Sistema, Asesor | Gestionar vencimiento y renovación |
| CU\_32 | Asesor | Registrar terminación anticipada |
| CU\_33 | Sistema, Asesor | Generar cuotas y registrar pagos |
| CU\_34 | Sistema | Detectar mora y enviar recordatorios |
| CU\_35 | Sistema | Calcular intereses de mora |
| CU\_36 | Asesor | Consultar estado de cuenta |
| CU\_37 | Asesor | Generar reporte de ingresos |
| CU\_38 | Administrador, asesor | Registrar Solicitud de Mantenimiento |
| CU\_39 | Administrador | Asignar Técnico o Proveedor |
| CU\_40 | Administrador, Técnico | Actualizar Estado de Mantenimiento |
| CU\_41 | Administrador | Registrar Costo de Mantenimiento |
| CU\_42 | Administrador, Asesor | Consultar Historial de Mantenimientos |
| CU\_43 | Cliente (Usuario externo) | Consultar Inmuebles Disponibles  |
| CU\_44 | Cliente (Usuario externo) | Brindar Información de Requisitos |
| CU\_45 | Cliente (Usuario externo) | Agendar Visita a Inmueble |
| CU\_46 | Cliente (Usuario externo) | Registrar Solicitud de Información |
| CU\_47 | Cliente (Usuario externo), Asesor | Transferir Conversación a Asesor Humano |

# Diagramas de Casos de uso

**Diagramas de Casos de uso**

![][image1]

![][image2]

![][image3]

![][image4]  
![][image5]  
**![][image6]**

![][image7]

# Módulo de Administración

**Módulo de Administración**

| Código: | CU\_01 |  |  |  |
| ----- | :---- | :---- | ----: | :---- |
| **Nombre:** | Gestionar usuarios |  |  |  |
| **Creado por:** | Isabela Villada Osorio |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | El administrador puede gestionar los usuarios del sistema, permitiendo crear, modificar, consultar, activar o desactivar usuarios. |  |  |
| **Disparador:** |  | El administrador debe dar clic en la opción “Gestión de usuarios” en el módulo de administración del sistema. |  |  |
|  **Pre-condiciones:** |  |  1\. El administrador debe haber ingresado a su cuenta. 2\. El administrador debe tener permisos de gestión de usuarios.  |  |  |
| **Post-condiciones:** |  | 1\. La información del usuario es registrada o actualizada en el sistema. 2\. El estado del usuario queda actualizado. |  |  |
|            **Flujo Normal:** |  | 1\.  Administrador abre la aplicación web e ingresa a su cuenta. 2\.  Administrador accede al módulo de administración. 3\. Administrador selecciona la opción “Gestión de usuarios”. 4\. Administrador crea, modifica, activa, desactiva o consulta un usuario. 5\. El sistema guarda los cambios realizados. 6\. El sistema es actualizado. |  |  |
|  **Flujos Alternativos:**  |  | **Flujo alterno 1**\- La aplicación web no está disponible. **Flujo alterno 2**\- En el paso 4 del flujo normal, si el administrador intenta crear un usuario con un correo o identificación ya registrada, el sistema muestra una alerta y no permite el registro. **Flujo alterno 3** \- En el paso 5 del flujo normal, cuando el administrador realiza cambios en el sistema y los cambios no son guardados en el sistema, el sistema le avisa al administrador que los datos no fueron guardados. |  |  |

| Código: | CU\_02 |  |  |  |
| ----- | :---- | :---- | ----: | :---- |
| **Nombre:** | Gestionar roles |  |  |  |
| **Creado por:** | Isabela Villada Osorio |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | El administrador puede crear, modificar, consultar o eliminar roles dentro del sistema para definir niveles de acceso y responsabilidades. |  |  |
| **Disparador:** |  | El administrador debe dar clic en la opción “Gestión de roles” en el módulo de administración |  |  |
|  **Pre-condiciones:** |  |  1\. El administrador debe haber ingresado a su cuenta. 2\. El administrador debe tener permisos para administrar roles.  |  |  |
| **Post-condiciones:** |  | 1\. El rol es creado, actualizado o eliminado en el sistema. 2\. El sistema es actualizado. |  |  |
|            **Flujo Normal:** |  | 1\.  Administrador abre la aplicación web e ingresa a su cuenta. 2\.  Administrador accede al módulo de administración. 3\. Administrador selecciona la opción “Gestión de roles”. 4\. Administrador crea, edita o elimina un rol. 5\. El sistema valida la información ingresada.  6\. El sistema guarda los cambios realizados. 7\. El sistema es actualizado.  |  |  |
|  **Flujos Alternativos:**  |  | **Flujo alterno 1**\- La aplicación web no está disponible. **Flujo alterno 2**\- En el paso 4 del flujo normal, si el administrador intenta crear un rol con un nombre ya registrado, el sistema muestra un mensaje de error. **Flujo alterno 3** \- En el paso 5 del flujo normal, si la información es incompleta o incorrecta, el sistema solicita corrección antes de guardar. **Flujo alterno 4** \- En el paso 6 del flujo normal, cuando el administrador realiza cambios en el sistema y los cambios no son guardados en el sistema, el sistema le avisa al administrador que los datos no fueron guardados. |  |  |

| Código: | CU\_03 |  |  |  |
| ----- | :---- | :---- | ----: | :---- |
| **Nombre:** | Asignar roles a usuarios |  |  |  |
| **Creado por:** | Isabela Villada Osorio |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | El administrador puede asignar roles a los usuarios del sistema |  |  |
| **Disparador:** |  | El administrador debe dar clic en la opción “Asignación de roles” en el módulo de administración |  |  |
|  **Pre-condiciones:** |  | 1\. El administrador debe haber ingresado a su cuenta.2\. Deben existir roles previamente creados.3\. Deben existir usuarios registrados en el sistema. |  |  |
| **Post-condiciones:** |  | 1\. El usuario queda asociado a un rol específico.2\. La asignación queda registrada en el sistema. |  |  |
|            **Flujo Normal:** |  | 1\.  Administrador abre la aplicación web e ingresa a su cuenta. 2\.  Administrador accede al módulo de administración. 3\. Administrador selecciona la opción “Asignación de roles”. 4\. El sistema muestra la lista de usuarios. 5\. Administrador selecciona un usuario. 6\. El sistema muestra los roles disponibles. 7\. Administrador asigna uno o varios roles al usuario seleccionado previamente. 8\. El sistema valida la información. 9\. El sistema guarda los cambios. 10\. El sistema es actualizado. |  |  |
|  **Flujos Alternativos:**  |  | **Flujo alterno 1**\- La aplicación web no está disponible. **Flujo alterno 2** \- En el paso 7 del flujo normal, si el rol no está disponible, el sistema notifica al administrador. **Flujo alterno 3** \- En el paso 9 del flujo normal, si ocurre un error en la base de datos, el sistema informa al administrador y no se aplican los cambios |  |  |

| Código: | CU\_04 |  |  |  |
| ----- | :---- | :---- | ----: | :---- |
| **Nombre:** | Gestionar permisos |  |  |  |
| **Creado por:** | Isabela Villada Osorio |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | El administrador puede crear, modificar o eliminar permisos del sistema y asociarlos a roles específicos. |  |  |
| **Disparador:** |  | El administrador debe dar clic en la opción “Gestión de permisos” en el módulo de administración |  |  |
|  **Pre-condiciones:** |  | 1\. El administrador debe haber ingresado a su cuenta.2\. Deben existir roles previamente creados. |  |  |
| **Post-condiciones:** |  | 1\. El permiso queda creado, actualizado o eliminado del sistema.2\. La asignación de los permisos a los roles queda registrada en el sistema. |  |  |
|            **Flujo Normal:** |  | 1\.  Administrador abre la aplicación web e ingresa a su cuenta. 2\.  Administrador accede al módulo de administración. 3\. Administrador selecciona la opción “Gestión de permisos”. 4\. El sistema muestra la lista de permisos existentes. 5\. Administrador crea, edita o elimina un permiso. 6\. Administrador asocia el permiso a uno o varios roles. 7\. El sistema valida la información. 8\. El sistema guarda los cambios. 9\. El sistema es actualizado. |  |  |
|  **Flujos Alternativos:**  |  | **Flujo alterno 1**\- La aplicación web no está disponible. **Flujo alterno 2** \- En el paso 6 del flujo normal, si el rol no está disponible, el sistema notifica al administrador e impide la asociación. **Flujo alterno 3** \- En el paso 8 del flujo normal, si ocurre un error en la base de datos, el sistema informa al administrador y no se aplican los cambios |  |  |

| Código: | CU\_05 |  |  |  |
| ----- | :---- | :---- | ----: | :---- |
| **Nombre:** | Configurar comisiones |  |  |  |
| **Creado por:** | Isabela Villada Osorio |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | El administrador puede crear, modificar, consultar o eliminar esquemas de comisión. Cada esquema define: el tipo de comisión (administración mensual / colocación / venta), el porcentaje que la inmobiliaria cobra al cliente (`porcentaje_inmobiliaria`) y el porcentaje de ese cobro que recibe el asesor (`porcentaje_asesor`). Distintos asesores pueden tener esquemas distintos del mismo tipo para reflejar diferencias de antigüedad o desempeño. |  |  |
| **Disparador:** |  | El administrador debe dar clic en la opción “Configuración de comisiones” en el módulo de administración |  |  |
|  **Pre-condiciones:** |  | 1\. El administrador debe haber ingresado a su cuenta.2\. El administrador debe tener permisos para configurar parámetros del sistema. |  |  |
| **Post-condiciones:** |  | 1\. El esquema de comisión queda registrado o actualizado en el sistema.2\. Los parámetros de comisión quedan disponibles para ser asignados a los asesores. |  |  |
|            **Flujo Normal:** |  | 1\. Administrador accede al módulo de administración y selecciona “Comisiones”. 2\. El sistema muestra la lista de esquemas existentes con tipo, porcentaje al cliente y porcentaje al asesor. 3\. Administrador crea, edita o elimina un esquema. 4\. Al crear o editar, el administrador define: nombre, tipo (administración / colocación / venta), porcentaje que cobra la inmobiliaria al cliente, y porcentaje que recibe el asesor de ese cobro. 5\. El sistema muestra un simulador en tiempo real con el desglose (cobro al propietario, ganancia del asesor, neto inmobiliaria). 6\. El sistema valida que ambos porcentajes estén entre 0 y 100. 7\. El sistema guarda los cambios. |  |  |
|  **Flujos Alternativos:**  |  | **Flujo alterno 1**\- La aplicación web no está disponible. **Flujo alterno 2**\- En el paso 5 del flujo normal, si el administrador intenta eliminar un esquema de comisión que ya está asignado a uno o más asesores, el sistema impide la eliminación y notifica que está en uso. **Flujo alterno 3** \- En el paso 7 del flujo normal, si ocurre un error en la base de datos, el sistema informa al administrador y no se aplican los cambios |  |  |

| Código: | CU\_06 |  |  |  |
| ----- | :---- | :---- | ----: | :---- |
| **Nombre:** | Asignar comisión a asesor |  |  |  |
| **Creado por:** | Isabela Villada Osorio |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | El administrador puede asignar un esquema de comisión previamente configurado a uno o varios asesores del sistema. |  |  |
| **Disparador:** |  | El administrador debe dar clic en la opción “Asignar comisión a asesor” en el módulo de administración |  |  |
|  **Pre-condiciones:** |  | 1\. El administrador debe haber ingresado a su cuenta.2\. Deben existir esquemas de comisión previamente configurados.3\. Deben existir asesores registrados en el sistema. |  |  |
| **Post-condiciones:** |  | 1\. El asesor queda vinculado a un esquema de comisión.2\. La asignación queda registrada en el sistema. |  |  |
|            **Flujo Normal:** |  | 1\. Administrador accede al módulo de administración y selecciona “Comisiones”. 2\. El sistema muestra la lista de esquemas en el panel izquierdo. 3\. Administrador selecciona un esquema. 4\. El sistema muestra en el panel derecho el desglose de tasas y los asesores actualmente asignados. 5\. Administrador asigna un asesor disponible al esquema o quita una asignación existente. 6\. El sistema registra la asignación con la fecha del día. |  |  |
|  **Flujos Alternativos:**  |  | **Flujo alterno 1**\- La aplicación web no está disponible. **Flujo alterno 2**\- En el paso 4 del flujo normal, si el esquema de comisión fue eliminado o no está activo, el sistema impide la asignación y notifica al administrador. **Flujo alterno 3** \- En el paso 7 del flujo normal, si ocurre un error en la base de datos, el sistema informa al administrador y no se aplican los cambios |  |  |

| Código: | CU\_07 |  |  |  |
| ----- | :---- | :---- | ----: | :---- |
| **Nombre:** | Gestionar estado de inmueble |  |  |  |
| **Creado por:** | Isabela Villada Osorio |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | El administrador puede crear, modificar, consultar o eliminar estados que puede tener un inmueble dentro del sistema, ya sea disponible, reservado, vendido o arrendado. |  |  |
| **Disparador:** |  | El administrador debe dar clic en la opción “Estados de inmuebles” en el módulo de administración |  |  |
|  **Pre-condiciones:** |  | 1\. El administrador debe haber ingresado a su cuenta.2\. El administrador debe tener permisos para configurar parámetros del sistema. |  |  |
| **Post-condiciones:** |  | 1\. El estado de inmueble queda registrado, eliminado o actualizado en el sistema.2\. Los cambios quedan guardados en la base de datos |  |  |
|            **Flujo Normal:** |  | 1\.  Administrador abre la aplicación web e ingresa a su cuenta. 2\.  Administrador accede al módulo de administración. 3\. Administrador selecciona la opción “Estados de inmuebles”. 4\. El sistema muestra los estados. 5\. Administrador crea, edita o elimina el estado de un inmueble. 6\. El sistema valida la información. 7\. El sistema guarda los cambios. 8\. El sistema es actualizado. |  |  |
|  **Flujos Alternativos:**  |  | **Flujo alterno 1**\- La aplicación web no está disponible. **Flujo alterno 2** \- En el paso 7 del flujo normal, si ocurre un error en la base de datos, el sistema informa al administrador y no se aplican los cambios. |  |  |

| Código: | CU\_08 |  |  |  |
| ----- | :---- | :---- | ----: | :---- |
| **Nombre:** | Gestionar tipos de contrato |  |  |  |
| **Creado por:** | Isabela Villada Osorio |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | El administrador puede crear, modificar, consultar o eliminar los tipos de contrato que maneja el sistema. |  |  |
| **Disparador:** |  | El administrador debe dar clic en la opción “Tipos de contrato” en el módulo de administración |  |  |
|  **Pre-condiciones:** |  | 1\. El administrador debe haber ingresado a su cuenta.2\. El administrador debe tener permisos para configurar parámetros del sistema. |  |  |
| **Post-condiciones:** |  | 1\. El tipo de contrato queda registrado, eliminado o actualizado en el sistema.2\. Los cambios quedan almacenados en la base de datos. |  |  |
|            **Flujo Normal:** |  | 1\.  Administrador abre la aplicación web e ingresa a su cuenta. 2\.  Administrador accede al módulo de administración. 3\. Administrador selecciona la opción “Tipos de contrato”. 4\. El sistema muestra los tipos de contrato existentes. 5\. Administrador crea, edita o elimina un tipo de contrato. 6\. El sistema valida la información. 7\. El sistema guarda los cambios. 8\. El sistema es actualizado. |  |  |
|  **Flujos Alternativos:**  |  | **Flujo alterno 1**\- La aplicación web no está disponible. **Flujo alterno 2**\- En el paso 5 del flujo normal, si el administrador intenta eliminar un tipo de contrato que está asociado a uno o más registros, el sistema impide la eliminación y notifica que está en uso. **Flujo alterno 3** \- En el paso 7 del flujo normal, si ocurre un error en la base de datos, el sistema informa al administrador y no se aplican los cambios |  |  |

| Código: | CU\_09 |  |  |  |
| ----- | :---- | :---- | ----: | :---- |
| **Nombre:** | Configurar plantillas de documentos |  |  |  |
| **Creado por:** | Isabela Villada Osorio |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | El administrador puede crear, modificar, consultar o eliminar plantillas de documentos utilizadas en los procesos contractuales del sistema. |  |  |
| **Disparador:** |  | El administrador debe dar clic en la opción “Plantillas de documentos” en el módulo de administración |  |  |
|  **Pre-condiciones:** |  | 1\. El administrador debe haber ingresado a su cuenta.2\. El administrador debe tener permisos para administrar documentos del sistema. |  |  |
| **Post-condiciones:** |  | 1\. La plantilla queda registrada, eliminada o actualizada en el sistema.2\. La plantilla queda disponible para ser usada en la generación de contratos. |  |  |
|            **Flujo Normal:** |  | 1\.  Administrador abre la aplicación web e ingresa a su cuenta. 2\.  Administrador accede al módulo de administración. 3\. Administrador selecciona la opción “Plantillas de documentos”. 4\. El sistema muestra las plantillas existentes. 5\. Administrador crea, edita o elimina una plantilla. 6\. El sistema valida la información. 7\. El sistema guarda los cambios. 8\. El sistema es actualizado. |  |  |
|  **Flujos Alternativos:**  |  | **Flujo alterno 1**\- La aplicación web no está disponible. **Flujo alterno 2**\- En el paso 5 del flujo normal, si el administrador intenta crear una plantilla con un nombre ya registrado, el sistema muestra un mensaje de error. **Flujo alterno 3** \- En el paso 5 del flujo normal, si el administrador intenta eliminar una plantilla que está asociada a contratos activos, el sistema impide la eliminación y notifica que está en uso. **Flujo alterno 3 \-** En el paso 7 del flujo normal, si ocurre un error en la base de datos, el sistema informa al administrador y no se aplican los cambios. |  |  |

| Código: | CU\_10 |  |  |  |
| ----- | :---- | :---- | ----: | :---- |
| **Nombre:** | Configurar documentos requeridos |  |  |  |
| **Creado por:** | Isabela Villada Osorio |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | El administrador puede definir qué documentos son obligatorios según el tipo de contrato, asegurando cumplir los requisitos documentales del proceso. |  |  |
| **Disparador:** |  | El administrador debe dar clic en la opción “Documentos requeridos” en el módulo de administración |  |  |
|  **Pre-condiciones:** |  | 1\. El administrador debe haber ingresado a su cuenta.2\. Deben existir tipos de contrato previamente configurados.3\. Deben existir plantillas creadas en el sistema. |  |  |
| **Post-condiciones:** |  | 1\. Los documentos quedan asociados a un tipo de contrato. 2\. El sistema es actualizado. |  |  |
|            **Flujo Normal:** |  | 1\.  Administrador abre la aplicación web e ingresa a su cuenta. 2\.  Administrador accede al módulo de administración. 3\. Administrador selecciona la opción “Documentos requeridos”. 4\. El sistema muestra la lista de tipos de contrato disponibles. 5\. Administrador selecciona un tipo de contrato. 6\. El sistema muestra la lista de documentos disponibles. 7\. Administrados selecciona los documentos que serán obligatorios para ese tipo de contrato. 8\. El sistema valida la información. 9\. El sistema guarda la asignación. 10\. El sistema es actualizado. |  |  |
|  **Flujos Alternativos:**  |  | **Flujo alterno 1**\- La aplicación web no está disponible. **Flujo alterno 2**\- En el paso 6 del flujo normal, si no existen documentos registrados en el sistema, el sistema notifica al administrador que debe crear plantillas primero. **Flujo alterno 3** \- En el paso 9 del flujo normal, si ocurre un error en la base de datos, el sistema informa al administrador y no se aplica la configuración. |  |  |

**Diagrama de casos de uso**

![][image8]

# Módulo de Propiedades

**Módulo de Propiedades**

| Código: | CU\_11 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Registrar propiedad |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Este caso de uso describe el proceso mediante el cual el administrador realiza la acción: registrar propiedad. |  |  |
| **Disparador:** |  | El administrador selecciona la opción correspondiente en el sistema. |  |  |
| **Pre-condiciones:** |  | 1\. El administrador debe haber iniciado sesión. |  |  |
| **Post-condiciones:** |  | 1\. El sistema guarda los cambios realizados. 2\. La información queda disponible para consultas. |  |  |
| **Flujo Normal:** |  | 1\. El administrador accede al módulo. 2\. Selecciona la opción 'Registrar propiedad'. 3\. Ingresa o modifica la información requerida. 4\. Confirma la operación. 5\. El sistema registra la acción. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- El sistema no está disponible. **Flujo alterno 2** \- Los datos ingresados no son válidos y el sistema muestra un error. |  |  |

| Código: | CU\_12 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Editar propiedad |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Este caso de uso describe el proceso mediante el cual el administrador realiza la acción: editar propiedad. |  |  |
| **Disparador:** |  | El administrador selecciona la opción correspondiente en el sistema. |  |  |
| **Pre-condiciones:** |  | 1\. El administrador debe haber iniciado sesión. |  |  |
| **Post-condiciones:** |  | 1\. El sistema guarda los cambios realizados. 2\. La información queda disponible para consultas. |  |  |
| **Flujo Normal:** |  | 1\. El administrador accede al módulo. 2\. Selecciona la opción 'Editar propiedad'. 3\. Ingresa o modifica la información requerida. 4\. Confirma la operación. 5\. El sistema registra la acción. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- El sistema no está disponible. **Flujo alterno 2** \- Los datos ingresados no son válidos y el sistema muestra un error. |  |  |

| Código: | CU\_13 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Eliminar propiedad |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Este caso de uso describe el proceso mediante el cual el administrador realiza la acción: eliminar propiedad. |  |  |
| **Disparador:** |  | El administrador selecciona la opción correspondiente en el sistema. |  |  |
| **Pre-condiciones:** |  | 1\. El administrador debe haber iniciado sesión. |  |  |
| **Post-condiciones:** |  | 1\. El sistema guarda los cambios realizados. 2\. La información queda disponible para consultas. |  |  |
| **Flujo Normal:** |  | 1\. El administrador accede al módulo. 2\. Selecciona la opción 'Eliminar propiedad'. 3\. Ingresa o modifica la información requerida. 4\. Confirma la operación. 5\. El sistema registra la acción. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- El sistema no está disponible. **Flujo alterno 2** \- Los datos ingresados no son válidos y el sistema muestra un error. |  |  |

| Código: | CU\_14 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Ver historial de propiedad |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Este caso de uso describe el proceso mediante el cual el administrador realiza la acción: ver historial de propiedad. |  |  |
| **Disparador:** |  | El administrador selecciona la opción correspondiente en el sistema. |  |  |
| **Pre-condiciones:** |  | 1\. El administrador debe haber iniciado sesión. |  |  |
| **Post-condiciones:** |  | 1\. El sistema guarda los cambios realizados. 2\. La información queda disponible para consultas. |  |  |
| **Flujo Normal:** |  | 1\. El administrador accede al módulo. 2\. Selecciona la opción 'Ver historial de propiedad'. 3\. Ingresa o modifica la información requerida. 4\. Confirma la operación. 5\. El sistema registra la acción. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- El sistema no está disponible. **Flujo alterno 2** \- Los datos ingresados no son válidos y el sistema muestra un error. |  |  |

| Código: | CU\_15 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Gestionar fotografías |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Este caso de uso describe el proceso mediante el cual el administrador realiza la acción: gestionar fotografías. |  |  |
| **Disparador:** |  | El administrador selecciona la opción correspondiente en el sistema. |  |  |
| **Pre-condiciones:** |  | 1\. El administrador debe haber iniciado sesión. |  |  |
| **Post-condiciones:** |  | 1\. El sistema guarda los cambios realizados. 2\. La información queda disponible para consultas. |  |  |
| **Flujo Normal:** |  | 1\. El administrador accede al módulo. 2\. Selecciona la opción 'Gestionar fotografías'. 3\. Ingresa o modifica la información requerida. 4\. Confirma la operación. 5\. El sistema registra la acción. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- El sistema no está disponible. **Flujo alterno 2** \- Los datos ingresados no son válidos y el sistema muestra un error. |  |  |

| Código: | CU\_16 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Publicar propiedad |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Este caso de uso describe el proceso mediante el cual el administrador realiza la acción: publicar propiedad. |  |  |
| **Disparador:** |  | El administrador selecciona la opción correspondiente en el sistema. |  |  |
| **Pre-condiciones:** |  | 1\. El administrador debe haber iniciado sesión. |  |  |
| **Post-condiciones:** |  | 1\. El sistema guarda los cambios realizados. 2\. La información queda disponible para consultas. |  |  |
| **Flujo Normal:** |  | 1\. El administrador accede al módulo. 2\. Selecciona la opción 'Publicar propiedad'. 3\. Ingresa o modifica la información requerida. 4\. Confirma la operación. 5\. El sistema registra la acción. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- El sistema no está disponible. **Flujo alterno 2** \- Los datos ingresados no son válidos y el sistema muestra un error. |  |  |

| Código: | CU\_17 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Cambiar estado de disponibilidad |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Este caso de uso describe el proceso mediante el cual el administrador realiza la acción: cambiar estado de disponibilidad. |  |  |
| **Disparador:** |  | El administrador selecciona la opción correspondiente en el sistema. |  |  |
| **Pre-condiciones:** |  | 1\. El administrador debe haber iniciado sesión. |  |  |
| **Post-condiciones:** |  | 1\. El sistema guarda los cambios realizados. 2\. La información queda disponible para consultas. |  |  |
| **Flujo Normal:** |  | 1\. El administrador accede al módulo. 2\. Selecciona la opción 'Cambiar estado de disponibilidad'. 3\. Ingresa o modifica la información requerida. 4\. Confirma la operación. 5\. El sistema registra la acción. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- El sistema no está disponible. **Flujo alterno 2** \- Los datos ingresados no son válidos y el sistema muestra un error. |  |  |

**Diagrama de casos de uso**

![][image9]

# Módulo de Clientes

**Módulo de Clientes**

| Código: | CU\_18 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Registrar Cliente |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Registro de propietarios, arrendatarios o prospectos. |  |  |
| **Disparador:** |  | Seleccionar "Registrar cliente". |  |  |
| **Pre-condiciones:** |  | 1\. Administrador autenticado. |  |  |
| **Post-condiciones:** |  | 1\. Cliente añadido a la base de datos. |  |  |
| **Flujo Normal:** |  | 1\. Abrir módulo de clientes. 2\. Elegir "Registrar cliente". 3\. Ingresar datos. 4\. Confirmar. 5\. El sistema registra. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Campos incompletos. **Flujo alterno 2** \- Cliente ya existente. |  |  |

| Código: | CU\_19 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Editar Cliente |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Modifica datos personales o de contacto. |  |  |
| **Disparador:** |  | Seleccionar "Editar". |  |  |
| **Pre-condiciones:** |  | 1\. Cliente registrado. |  |  |
| **Post-condiciones:** |  | 1\. Datos actualizados. |  |  |
| **Flujo Normal:** |  | 1\. Buscar cliente. 2\. Selecciona "Editar". 3\. Cambia datos. 4\. Guarda. 5\. Sistema actualiza. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Información inválida. |  |  |

| Código: | CU\_20 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Eliminar Cliente |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Elimina un registro de cliente. |  |  |
| **Disparador:** |  | Opción "Eliminar". |  |  |
| **Pre-condiciones:** |  | 1\. El cliente no puede tener contratos activos. |  |  |
| **Post-condiciones:** |  | 1\. Cliente eliminado del sistema. |  |  |
| **Flujo Normal:** |  | 1\. Buscar cliente. 2\. Seleccionar "Eliminar". 3\. Confirmar. 4\. El sistema borra el registro. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Cliente con contratos: no puede eliminarse. |  |  |

| Código: | CU\_21 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Historial de Interacciones |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Consulta llamadas, visitas y mensajes previos. |  |  |
| **Disparador:** |  | Click en "Historial". |  |  |
| **Pre-condiciones:** |  | 1\. Cliente existente. |  |  |
| **Post-condiciones:** |  | 1\. Se muestran las interacciones. |  |  |
| **Flujo Normal:** |  | 1\. Selecciona cliente. 2\. Abre historial. 3\. Se muestra información. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Sin historial disponible. |  |  |

| Código: | CU\_22 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Asociar Cliente a Inmueble |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Asigna un cliente a una propiedad como propietario o arrendatario. |  |  |
| **Disparador:** |  | Seleccionar "Asociar". |  |  |
| **Pre-condiciones:** |  | 1\. Propiedad registrada. 2\. Cliente registrado. |  |  |
| **Post-condiciones:** |  | 1\. Asociación creada. |  |  |
| **Flujo Normal:** |  | 1\. Selecciona cliente. 2\. Selecciona propiedad. 3\. Configura asociación. 4\. Guarda. 5\. Sistema registra vínculo. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Inmueble ya asociado. |  |  |

| Código: | CU\_23 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Registrar Solicitud de Visita |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Registra que un cliente solicita visitar una propiedad. |  |  |
| **Disparador:** |  | Opción "Registrar visita". |  |  |
| **Pre-condiciones:** |  | 1\. Cliente registrado. 2\. Inmueble disponible. |  |  |
| **Post-condiciones:** |  | 1\. Visita agendada o registrada. |  |  |
| **Flujo Normal:** |  | 1\. Selecciona cliente. 2\. Selecciona propiedad. 3\. Ingresa fecha/hora. 4\. Guarda. 5\. Sistema registra. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Horario no disponible. |  |  |

| Código: | CU\_24 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Gestionar Perfil del Cliente |  |  |  |
| **Creado por:** | Juan Jose Buatista |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Gestiona preferencias, tipo de cliente, requisitos y documentación. |  |  |
| **Disparador:** |  | Opción "Gestionar perfil". |  |  |
| **Pre-condiciones:** |  | 1\. Opción "Gestionar perfil". |  |  |
| **Post-condiciones:** |  | 1\. Perfil actualizado. |  |  |
| **Flujo Normal:** |  | 1\. Selecciona cliente. 2\. Entra al perfil. 3\. Modifica preferencias/documentos. 4\. Guarda. 5\. Sistema actualiza. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Documentos no válidos. |  |  |

**Diagrama de casos de uso**

![][image10]

# Módulo de Contratos

**Módulo de Contratos**

| Código: | CU-25 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Iniciar contrato |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Asesor |  |  |
| **Descripción:** |  | Permite al asesor crear un contrato seleccionando el inmueble, el tipo y vinculando las partes involucradas. |  |  |
| **Disparador:** |  | El asesor selecciona la opción de crear un nuevo contrato. |  |  |
| **Pre-condiciones:** |  | 1\. Inmueble registrado y disponible. 2\. Propietario registrado en el sistema. 3\. Arrendatario o comprador registrado o a registrar. |  |  |
| **Post-condiciones:** |  | 1\. Contrato en estado Borrador con partes vinculadas. 2\. El sistema redirige al flujo según el tipo de contrato seleccionado. |  |  |
| **Flujo Normal:** |  | 1\. El asesor selecciona crear un nuevo contrato. 2\. El sistema muestra los inmuebles disponibles. 3\. El asesor selecciona el inmueble. 4\. El sistema carga automáticamente los datos del propietario. 5\. El asesor selecciona el tipo de contrato (arriendo o venta). 6\. El asesor registra o busca al arrendatario o comprador. 7\. El asesor confirma los datos básicos. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Arrendatario no registrado: se registra en el momento. **Flujo alterno 2** \- Datos del propietario incompletos: sistema alerta y permite completarlos. **Flujo alterno 3** \- No hay inmuebles disponibles: sistema notifica y bloquea. **Flujo alterno 4** \- Asignar a otro asesor: el responsable puede cambiarse. |  |  |

| Código: | CU-26 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Crear contrato de arriendo |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Asesor |  |  |
| **Descripción:** |  | Permite completar las condiciones específicas del contrato de arriendo y generar el PDF prellenado con espacios de firma. |  |  |
| **Disparador:** |  | Sistema redirige desde CU-C1 tras seleccionar arriendo como tipo de contrato. |  |  |
| **Pre-condiciones:** |  | 1\. Contrato en estado Borrador. 2\. Tipo de contrato: arriendo. 3\. Plantilla parametrizada en el módulo de administración. |  |  |
| **Post-condiciones:** |  | 1\. Contrato en Borrador con condiciones completas y PDF generado. 2\. Contrato de administración vinculado generado si aplica. 3\. Cobro de comisión por corretaje generado automáticamente. |  |  |
| **Flujo Normal:** |  | 1\. El sistema carga la plantilla de arriendo (residencial o comercial). 2\. El asesor completa canon, fechas, duración y depósito si aplica. 3\. El sistema pregunta si el propietario desea servicio de administración. 4\. El asesor confirma la información. 5\. El sistema genera el PDF y el cobro de comisión por corretaje. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Inmueble comercial: se carga plantilla con cláusulas comerciales. **Flujo alterno 2** \- Sin administración: no se genera contrato de administración. **Flujo alterno 3** \- Campos incompletos: sistema bloquea y resalta pendientes. |  |  |

| Código: | CU-27 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Crear promesa de compraventa |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Asesor |  |  |
| **Descripción:** |  | Permite completar las condiciones de la promesa de compraventa y generar el PDF prellenado. |  |  |
| **Disparador:** |  | Sistema redirige desde CU-C1 tras seleccionar venta como tipo de contrato. |  |  |
| **Pre-condiciones:** |  | 1\. Contrato en estado Borrador. 2\. Tipo de contrato: venta. 3\. Plantilla parametrizada en el módulo de administración. |  |  |
| **Post-condiciones:** |  | 1\. Promesa en Borrador con PDF generado. 2\. Cobro de arras registrado como pendiente. 3\. Cobro de comisión del 3% generado automáticamente. |  |  |
| **Flujo Normal:** |  | 1\. El sistema carga la plantilla de promesa de compraventa. 2\. El asesor completa precio, arras, forma de pago y fecha de escrituración. 3\. El asesor confirma la información. 4\. El sistema genera el PDF. 5\. El sistema registra el cobro de arras y la comisión del 3%. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Crédito hipotecario: se registra entidad y fecha estimada de aprobación. **Flujo alterno 2** \- Arras en fecha posterior: el cobro se programa para esa fecha. **Flujo alterno 3** \- Campos incompletos: sistema bloquea y resalta pendientes. **Flujo alterno 4** \- Condiciones cambian tras firmar: el asesor registra las modificaciones y el sistema genera un documento de otrosí vinculado al contrato original. |  |  |

| Código: | CU-28 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Gestionar documentos y enviar a firmas |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Asesor |  |  |
| **Descripción:** |  | Permite cargar los documentos requeridos según el tipo de contrato y enviar el contrato a DocuSign para firma digital. |  |  |
| **Disparador:** |  | El asesor accede a la gestión de documentos de un contrato en estado Borrador. |  |  |
| **Pre-condiciones:** |  | 1\. Contrato en estado Borrador. 2\. Lista de documentos parametrizada en el módulo de administración. 3\. Correo y WhatsApp de las partes registrados. |  |  |
| **Post-condiciones:** |  | 1\. Documentos cargados y verificados. 2\. Contrato cambia a estado Enviado a firmas. 3\. Partes notificadas con enlace de firma por correo y WhatsApp. |  |  |
| **Flujo Normal:** |  | 1\. El asesor accede al contrato en Borrador. 2\. El sistema muestra la lista de chequeo según perfil del arrendatario. 3\. El asesor carga cada documento y el sistema los marca como recibidos. 4\. El asesor selecciona enviar a firmas. 5\. El sistema envía el contrato a DocuSign y notifica a las partes. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Documento faltante: el sistema bloquea el avance. **Flujo alterno 2** \- Formato no válido: el sistema solicita nuevo archivo. **Flujo alterno 3** \- Perfil del arrendatario no definido: el sistema solicita especificarlo. **Flujo alterno 4** \- Correo o WhatsApp no registrado: sistema alerta al asesor y permite registrarlo. **Flujo alterno 5** \- Fallo con DocuSign: sistema permite reintentar. **Flujo alterno 6** \- Asesor cancela el envío: contrato permanece en Borrador. |  |  |

| Código: | CU-29 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Firmar y activar contrato |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Sistema, Propietario, Arrendatario |  |  |
| **Descripción:** |  | El sistema registra cada firma realizada en DocuSign y activa el contrato automáticamente cuando todas las partes han firmado. |  |  |
| **Disparador:** |  | Una de las partes firma el contrato desde el enlace recibido. |  |  |
| **Pre-condiciones:** |  | 1\. Contrato en estado Enviado a firmas. 2\. Partes con acceso al enlace de DocuSign. |  |  |
| **Post-condiciones:** |  | 1\. Firmas registradas y contrato en estado activo. 2\. Si es arriendo: inmueble cambia a Arrendado. Si es compraventa: inmueble cambia a En proceso de venta. 3\. Cuotas generadas en el módulo de pagos. 4\. PDF firmado almacenado y enviado a las partes. |  |  |
| **Flujo Normal:** |  | 1\. La parte accede al enlace y firma digitalmente en DocuSign. 2\. DocuSign notifica al sistema y este registra la firma. 3\. El sistema actualiza el estado del contrato y notifica al asesor. 4\. Al firmar ambas partes, el sistema cambia el contrato a Activo. 5\. El sistema actualiza el inmueble, almacena el PDF y genera las cuotas. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Parte no encuentra el enlace: asesor puede reenviar. **Flujo alterno 2** \- Parte rechaza firmar: asesor gestiona la situación. **Flujo alterno 3** \- Enlace expirado: asesor genera nuevo envío. **Flujo alterno 4** \- Fallo en notificación de DocuSign: asesor sincroniza o activa manualmente. **Flujo alterno 5** \- Fallo en procesos internos: el sistema muestra el error y permite reintentar. |  |  |

| Código: | CU-30 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Registrar escrituración y finalizar venta |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Asesor |  |  |
| **Descripción:** |  | Permite registrar la escrituración, los pagos del proceso de venta y cerrar formalmente el contrato actualizando el inmueble a Vendido. |  |  |
| **Disparador:** |  | Las partes proceden a la escrituración o se genera un pago asociado al contrato de venta. |  |  |
| **Pre-condiciones:** |  | 1\. Contrato de venta en estado Activo. 2\. Arras registradas como pagadas. |  |  |
| **Post-condiciones:** |  | 1\. Escrituración y pagos registrados. 2\. Contrato cambia a Finalizado. 3\. Inmueble cambia a Vendido. 4\. Partes notificadas por correo y WhatsApp. |  |  |
| **Flujo Normal:** |  | 1\. El asesor registra la fecha, notaría y sube la escritura pública. 2\. El sistema avanza el contrato a etapa de escrituración. 3\. El asesor registra los pagos pendientes (arras, precio total). 4\. El asesor sube el certificado de tradición actualizado. 5\. El sistema finaliza el contrato y cambia el inmueble a Vendido. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Escrituración fuera de plazo: el sistema genera una alerta al asesor. Si la forma de pago es crédito hipotecario, la alerta es informativa. Si es contado o mixto, la alerta indica posible incumplimiento de la fecha pactada.  **Flujo alterno 2** \- Una parte no se presenta: se registra incumplimiento. El asesor gestiona una nueva fecha de escrituración o inicia la terminación anticipada del contrato. **Flujo alterno 3** \- Documento de escritura no disponible aún: asesor lo sube después, continúa en estado de escrituración. **Flujo alterno 4** \- Pagos pendientes al finalizar: sistema bloquea hasta resolverlos. **Flujo alterno 5** \- Certificado de tradición no disponible: contrato queda en Pendiente de registro. **Flujo alterno 6** \- Pago parcial: sistema registra abono y actualiza saldo. |  |  |

| Código: | CU-31 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Gestionar vencimiento y renovación |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Sistema, Asesor |  |  |
| **Descripción:** |  | El sistema alerta sobre contratos próximos a vencer y permite al asesor renovarlos o finalizarlos por vencimiento. |  |  |
| **Disparador:** |  | El sistema detecta un contrato dentro del periodo de anticipación configurado o en su fecha de vencimiento. |  |  |
| **Pre-condiciones:** |  | 1\. Contrato de arriendo o administración en estado Activo o Por vencer. 2\. Anticipación de alertas parametrizada. 3\. Asesor responsable asignado. |  |  |
| **Post-condiciones:** |  | 1\. Contrato en estado Por vencer con asesor notificado. 2\. Según decisión: nuevo contrato en Borrador o contrato Finalizado. 3\. Inmueble actualizado según resultado. |  |  |
| **Flujo Normal:** |  | 1\. El sistema detecta contratos dentro del periodo de anticipación. 2\. El sistema cambia el estado a Por vencer y notifica al asesor. 3\. El asesor decide renovar o dejar vencer. 4\. Si renueva: el sistema genera nuevo contrato en Borrador con datos anteriores. 5\. Si vence: el sistema finaliza el contrato y actualiza el inmueble. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Contrato de venta: no aplica. **Flujo alterno 2** \- Asesor desactivado sin reasignación: notificación al administrador. **Flujo alterno 3** \- Múltiples contratos venciendo: notificación consolidada. **Flujo alterno 4** \- Arrendatario o propietario no quiere renovar: contrato pasa a finalización. **Flujo alterno 5** \- Saldos pendientes al vencer: estado Vencido con saldos, mora continúa. **Flujo alterno 6** \- Renovación en curso al vencer: sistema espera el resultado. |  |  |

| Código: | CU-32 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Registrar terminación anticipada |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Asesor |  |  |
| **Descripción:** |  | Permite registrar la terminación anticipada de contratos de arriendo, venta o administración, aplicando penalizaciones o reglas de arras según corresponda. |  |  |
| **Disparador:** |  | Una de las partes solicita terminar el contrato antes de su fecha de vencimiento o de escrituración en el caso de un contrato de venta. |  |  |
| **Pre-condiciones:** |  | 1\. Contrato en estado Activo  o En escrituración. 2\. Solicitud de una de las partes involucradas. |  |  |
| **Post-condiciones:** |  | 1\. Terminación registrada en el sistema. 2\. Penalización o arras registradas en módulo de pagos si aplica. 3\. Contrato cambia a Finalizado. 4\. Inmueble cambia a Disponible. |  |  |
| **Flujo Normal:** |  | 1\. El asesor accede al contrato activo o en escrituración y selecciona terminar anticipadamente. 2\. El asesor indica quién solicita y selecciona la causa. 3\. El sistema calcula si aplica penalización, arras o cláusula penal según el tipo. 4\. El asesor confirma y registra la fecha de entrega si aplica. 5\. El sistema genera los cobros, notifica a las partes y finaliza el contrato. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Arriendo sin penalización: causa imputable al arrendador. **Flujo alterno 2** \- Sin preaviso del arrendatario: sistema calcula cánones restantes. **Flujo alterno 3** \- Retracto del comprador: pérdida de arras a favor del vendedor. **Flujo alterno 4** \- Retracto del vendedor: devolución de arras al doble. **Flujo alterno 5** \- Parte no acepta penalización: estado Terminación en disputa. **Flujo alterno 6** \- Administración con arriendo vinculado: asesor decide si el propietario asume la gestión o termina formalmente solo el de arriendo. |  |  |

**Diagrama de casos de uso**

![][image11]

# Módulo de Pagos y Mora

**Módulo de Pagos y Mora**

| Código: | CU-33 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Generar cuotas y registrar pagos |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Sistema, Asesor |  |  |
| **Descripción:** |  | El sistema genera automáticamente las cuotas mensuales de arriendo y permite al asesor registrar cualquier pago vinculado a un contrato activo, incluyendo la gestión de comisiones de administración. |  |  |
| **Disparador:** |  | Proceso diario identifica contratos con cuota a generar, o el asesor registra un pago recibido. |  |  |
| **Pre-condiciones:** |  | 1\. Contrato en estado Activo. 2\. Condiciones de pago definidas en el contrato. 3\. Cobro pendiente registrado si se va a registrar pago. |  |  |
| **Post-condiciones:** |  | 1\. Cuota o pago registrado en el módulo de pagos. 2\. Cobro cambia a estado Pagado. 3\. Recibo o comprobante enviado por correo y WhatsApp. 4\. Comisión de administración descontada si aplica. |  |  |
| **Flujo Normal:** |  | 1\. El sistema genera la cuota mensual según las condiciones del contrato. 2\. El sistema notifica al arrendatario sobre la cuota generada. 3\. El asesor accede al contrato y selecciona registrar pago. 4\. El asesor selecciona el cobro, registra valor, fecha y sube comprobante. 5\. El sistema registra el pago, descuenta comisión si aplica y envía el recibo. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Primera cuota: valor proporcional a los días del mes. **Flujo alterno 2** \- Canon ajustado por IPC: cuota generada con nuevo valor. **Flujo alterno 3** \- Depósito inicial: registrado como cobro único. **Flujo alterno 4** \- Valor no coincide: sistema alerta al asesor. **Flujo alterno 5** \- Pago parcial: sistema registra abono y actualiza saldo. **Flujo alterno 6** \- Pago por entidad financiera: asesor registra banco y soporte. **Flujo alterno 7** \- Con administración: sistema descuenta comisión y calcula neto al propietario. |  |  |

| Código: | CU-34 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Detectar mora y enviar recordatorios |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Sistema |  |  |
| **Descripción:** |  | El sistema detecta cobros vencidos fuera del periodo de gracia, los marca en mora y envía recordatorios automáticos al arrendatario y al asesor. |  |  |
| **Disparador:** |  | Proceso diario identifica cobros pendientes con fecha límite superada, o cobros próximos a vencer. |  |  |
| **Pre-condiciones:** |  | 1\. Cobro pendiente en módulo de pagos. 2\. Fecha límite más periodo de gracia superada. 3\. Arrendatario con correo y WhatsApp registrados. |  |  |
| **Post-condiciones:** |  | 1\. Cobro cambia a estado En mora. 2\. Arrendatario y asesor notificados. 3\. Envío registrado vinculado al cobro. |  |  |
| **Flujo Normal:** |  | 1\. El sistema revisa diariamente los cobros pendientes. 2\. El sistema identifica cobros con fecha límite superada y los marca En mora. 3\. El sistema envía recordatorio preventivo antes del vencimiento si aplica. 4\. El sistema envía notificación de mora al arrendatario y al asesor. 5\. El sistema registra los envíos vinculados al cobro. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Pago dentro del periodo de gracia: no se genera mora. **Flujo alterno 2** \- Múltiples cuotas en mora: notificación consolidada. **Flujo alterno 3** \- Sin periodo configurado: se usan 5 días según Ley 820 de 2003\. **Flujo alterno 4** \- Cobro pagado antes del recordatorio: proceso cancelado. **Flujo alterno 5** \- Sin correo o WhatsApp: asesor actualiza los datos. |  |  |

| Código: | CU-35 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Calcular intereses de mora |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Sistema |  |  |
| **Descripción:** |  | El sistema calcula los intereses de mora sobre cobros vencidos en inmuebles comerciales o contratos con intereses expresamente pactados. |  |  |
| **Disparador:** |  | CU-P2 detecta mora en inmueble comercial o contrato con intereses pactados. |  |  |
| **Pre-condiciones:** |  | 1\. Cobro en estado En mora. 2\. Inmueble comercial o intereses pactados en el contrato. 3\. Tasa de interés registrada o tasa legal disponible. |  |  |
| **Post-condiciones:** |  | 1\. Intereses registrados como cobro adicional. 2\. Total adeudado actualizado sumando capital e intereses. |  |  |
| **Flujo Normal:** |  | 1\. CU-P2 solicita el cálculo de intereses. 2\. El sistema verifica la tasa pactada o aplica el 6% anual legal. 3\. El sistema calcula intereses con fórmula de interés simple. 4\. El sistema registra los intereses vinculados al cobro en mora. 5\. El sistema recalcula diariamente mientras el cobro permanezca en mora. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Inmueble residencial sin intereses pactados: no se calculan. **Flujo alterno 2** \- Pago parcial en mora: intereses se aplican primero, luego capital. **Flujo alterno 3** \- Pago total: sistema detiene cálculo y marca como Pagado. **Flujo alterno 4** \- Tasa supera límite legal: sistema aplica la tasa máxima permitida. |  |  |

| Código: | CU-36 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Consultar estado de cuenta |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Asesor |  |  |
| **Descripción:** |  | Permite consultar el estado de cuenta de un contrato con historial de pagos, cobros pendientes, mora e intereses. |  |  |
| **Disparador:** |  | El asesor solicita consultar el estado de cuenta desde el sistema. |  |  |
| **Pre-condiciones:** |  | 1\. Contrato existente en el sistema. |  |  |
| **Post-condiciones:** |  | 1\. Estado de cuenta actualizado visible para el asesor. 2\. Asesor puede descargar o compartir con las partes. |  |  |
| **Flujo Normal:** |  | 1\. El asesor accede al contrato en el sistema. 2\. El asesor selecciona consultar estado de cuenta. 3\. El sistema recopila pagos, cobros pendientes, mora e intereses. 4\. El sistema muestra el detalle cronológico con saldo total pendiente. 5\. El asesor puede filtrar, descargar en PDF o compartir por correo y WhatsApp. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Sin movimientos: sistema muestra cobros programados. **Flujo alterno 2** \- Compartir con partes: sistema genera y envía PDF. **Flujo alterno 3** \- Con intereses: capital e intereses mostrados desglosados. |  |  |

| Código: | CU-37 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Generar reporte de ingresos |  |  |  |
| **Creado por:** | Emily Perea Córdoba |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 24/02/2026 |  | **Fecha de última actualización:** | 24/02/2026 |
| **Actores:** |  | Asesor |  |  |
| **Descripción:** |  | Permite generar reportes financieros de ingresos de la inmobiliaria filtrando por inmueble, cliente o periodo. |  |  |
| **Disparador:** |  | El asesor solicita generar un reporte desde el módulo de pagos. |  |  |
| **Pre-condiciones:** |  | 1\. Pagos registrados en el sistema. 2\. Filtros disponibles en el módulo de pagos. |  |  |
| **Post-condiciones:** |  | 1\. Reporte generado según filtros aplicados. 2\. Asesor puede descargar o compartir. |  |  |
| **Flujo Normal:** |  | 1\. El asesor accede al módulo de pagos y selecciona generar reporte. 2\. El asesor aplica los filtros deseados y confirma. 3\. El sistema recopila los pagos correspondientes. 4\. El sistema consolida ingresos por tipo (cánones, comisiones, penalizaciones). 5\. El asesor descarga el reporte en PDF o Excel. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Sin ingresos para el filtro: sistema sugiere ampliar búsqueda. **Flujo alterno 2** \- Comparar periodos: sistema permite seleccionar dos periodos. **Flujo alterno 3** \- Cobros en mora incluidos: diferenciados de ingresos efectivos. |  |  |

**Diagrama de casos de uso**

![][image12]

# Módulo de Mantenimiento

**Módulo de Mantenimiento**

| Código: | CU\_38 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Registrar Solicitud de Mantenimiento |  |  |  |
| **Creado por:** | Daniel Moreno |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador, asesor |  |  |
| **Descripción:** |  | Registro de una nueva solicitud de mantenimiento asociada a un inmueble. |  |  |
| **Disparador:** |  | Seleccionar "Nueva solicitud de mantenimiento". |  |  |
| **Pre-condiciones:** |  | 1\. Usuario autenticado. 2\. El inmueble debe estar registrado en el sistema. |  |  |
| **Post-condiciones:** |  | 1\. Solicitud registrada con estado "Pendiente". |  |  |
| **Flujo Normal:** |  | 1\. Abrir módulo de mantenimiento. 2\. Seleccionar "Nueva solicitud". 3\. Elegir inmueble. 4\. Ingresar descripción del problema. 5\. Asignar prioridad. 6\. Adjuntar evidencias (opcional). 7\. Confirmar registro. 8\. El sistema guarda la solicitud. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Campos obligatorios incompletos. **Flujo alterno 2** \- Inmueble no existente. |  |  |

| Código: | CU\_39 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Asignar Técnico o Proveedor |  |  |  |
| **Creado por:** | Daniel Moreno |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Asignar un proveedor o técnico a una solicitud de mantenimiento. |  |  |
| **Disparador:** |  | Seleccionar "Asignar técnico". |  |  |
| **Pre-condiciones:** |  | 1\. Solicitud registrada. 2\. Proveedor registrado en el sistema. |  |  |
| **Post-condiciones:** |  | 1\. Solicitud cambia a estado "En proceso". 2\. Técnico asignado correctamente. |  |  |
| **Flujo Normal:** |  | 1\. Buscar solicitud pendiente. 2\. Seleccionar "Asignar técnico". 3\. Elegir proveedor de la lista. 4\. Confirmar asignación. 5\. El sistema actualiza el estado. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- No hay proveedores disponibles. **Flujo alterno 2** \- Solicitud ya asignada. |  |  |

| Código: | CU\_40 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Actualizar Estado de Mantenimiento |  |  |  |
| **Creado por:** | Daniel Moreno |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador, Técnico |  |  |
| **Descripción:** |  | Actualizar el estado de una solicitud de mantenimiento. |  |  |
| **Disparador:** |  | Seleccionar "Actualizar estado". |  |  |
| **Pre-condiciones:** |  | 1\. Solicitud registrada. 2\. Técnico asignado. |  |  |
| **Post-condiciones:** |  | 1\. Estado actualizado (En proceso, Finalizado, Cancelado). |  |  |
| **Flujo Normal:** |  | 1\. Buscar solicitud. 2\. Seleccionar "Actualizar estado". 3\. Elegir nuevo estado. 4\. Ingresar observaciones. 5\. Confirmar. 6\. El sistema guarda los cambios. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Solicitud no encontrada. **Flujo alterno 2** \- Estado inválido. |  |  |

| Código: | CU\_41 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Registrar Costo de Mantenimiento |  |  |  |
| **Creado por:** | Daniel Moreno |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador |  |  |
| **Descripción:** |  | Registrar el costo asociado a una solicitud de mantenimiento finalizada. |  |  |
| **Disparador:** |  | Seleccionar "Registrar costo". |  |  |
| **Pre-condiciones:** |  | 1\. Solicitud en estado "Finalizado". |  |  |
| **Post-condiciones:** |  | 1\. Costo almacenado en el historial del inmueble. |  |  |
| **Flujo Normal:** |  | 1\. Buscar solicitud finalizada. 2\. Seleccionar "Registrar costo". 3\. Ingresar valor del servicio. 4\. Adjuntar factura (opcional). 5\. Confirmar. 6\. El sistema guarda el costo. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Valor inválido. **Flujo alterno 2** \- Solicitud no finalizada. |  |  |

| Código: | CU\_42 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Consultar Historial de Mantenimientos |  |  |  |
| **Creado por:** | Daniel Moreno |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Administrador, Asesor |  |  |
| **Descripción:** |  | Consultar el historial de mantenimientos asociados a un inmueble. |  |  |
| **Disparador:** |  | Seleccionar "Ver historial". |  |  |
| **Pre-condiciones:** |  | 1\. Inmueble registrado. |  |  |
| **Post-condiciones:** |  | 1\. Se muestra listado de mantenimientos realizados. |  |  |
| **Flujo Normal:** |  | 1\. Abrir módulo de mantenimiento. 2\. Buscar inmueble. 3\. Seleccionar "Ver historial". 4\. El sistema muestra listado con fechas, estado y costos. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Inmueble sin mantenimientos registrados. **Flujo alterno 2** \- Inmueble no encontrado. |  |  |

**Diagrama de casos de uso**

**![][image13]**

# Módulo Chatbot

**Módulo de Chatbots**

| Código: | CU\_43 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Consultar Inmuebles Disponibles |  |  |  |
| **Creado por:** | Daniel Moreno |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Cliente (Usuario externo) |  |  |
| **Descripción:** |  | Permite al usuario consultar inmuebles disponibles aplicando filtros como zona, tipo y precio. |  |  |
| **Disparador:** |  | El usuario escribe una consulta en el chatbot solicitando inmuebles disponibles. |  |  |
| **Pre-condiciones:** |  | 1\. El sistema debe tener inmuebles registrados. 2\. El chatbot debe estar activo. |  |  |
| **Post-condiciones:** |  | 1\. El sistema muestra listado de inmuebles que cumplen con los filtros ingresados. |  |  |
| **Flujo Normal:** |  | 1\. El usuario ingresa al chatbot. 2\. Solicita búsqueda de inmuebles. 3\. Indica filtros (zona, tipo, precio). 4\. El sistema procesa la solicitud. 5\. El chatbot muestra resultados disponibles. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- No existen inmuebles con esos filtros. **Flujo alterno 2** \- Filtros ingresados inválidos. |  |  |

| Código: | CU\_44 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Brindar Información de Requisitos |  |  |  |
| **Creado por:** | Daniel Moreno |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Cliente (Usuario externo) |  |  |
| **Descripción:** |  | El chatbot proporciona información sobre requisitos para arriendo o compra de inmueble. |  |  |
| **Disparador:** |  | El usuario consulta sobre requisitos de arriendo o compra. |  |  |
| **Pre-condiciones:** |  | 1\. Información de requisitos configurada en el sistema. |  |  |
| **Post-condiciones:** |  | 1\. El usuario recibe la información solicitada. |  |  |
| **Flujo Normal:** |  | 1\. El usuario pregunta sobre requisitos. 2\. El chatbot identifica el tipo de solicitud (arriendo o compra). 3\. El sistema recupera la información correspondiente. 4\. El chatbot responde con los requisitos. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- El chatbot no comprende la pregunta. **Flujo alterno 2** \- No hay información configurada. |  |  |

| Código: | CU\_45 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Agendar Visita a Inmueble |  |  |  |
| **Creado por:** | Daniel Moreno |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Cliente (Usuario externo) |  |  |
| **Descripción:** |  | Permite al usuario solicitar el agendamiento de una visita a un inmueble. |  |  |
| **Disparador:** |  | El usuario solicita agendar una visita mediante el chatbot. |  |  |
| **Pre-condiciones:** |  | 1\. El inmueble debe estar disponible. 2\. El sistema debe permitir agendamiento. |  |  |
| **Post-condiciones:** |  | 1\. Visita registrada en el sistema. 2\. Notificación enviada al asesor correspondiente. |  |  |
| **Flujo Normal:** |  | 1\. El usuario selecciona inmueble. 2\. Solicita agendar visita. 3\. Indica fecha y hora. 4\. El sistema valida disponibilidad. 5\. Se registra la visita. 6\. El chatbot confirma al usuario. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Fecha no disponible. **Flujo alterno 2** \- Inmueble no disponible. |  |  |

| Código: | CU\_46 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Registrar Solicitud de Información |  |  |  |
| **Creado por:** | Daniel Moreno |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Cliente (Usuario externo) |  |  |
| **Descripción:** |  | Permite registrar una solicitud de información para seguimiento por parte de un asesor. |  |  |
| **Disparador:** |  | El usuario solicita más información sobre un inmueble. |  |  |
| **Pre-condiciones:** |  | 1\. Inmueble registrado en el sistema. |  |  |
| **Post-condiciones:** |  | 1\. Solicitud almacenada en el sistema. 2\. Asesor notificado. |  |  |
| **Flujo Normal:** |  | 1\. El usuario consulta sobre un inmueble. 2\. Indica que desea más información. 3\. Proporciona datos de contacto. 4\. El sistema registra la solicitud. 5\. Se notifica al asesor. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- Datos de contacto incompletos. **Flujo alterno 2** \- Inmueble no encontrado. |  |  |

| Código: | CU\_47 |  |  |  |
| ----: | :---- | :---- | ----: | :---- |
| **Nombre:** | Transferir Conversación a Asesor Humano |  |  |  |
| **Creado por:** | Daniel Moreno |  | **Actualizado por:** |  |
| **Fecha de Creación:** | 22/02/2026 |  | **Fecha de última actualización:** | 22/02/2026 |
| **Actores:** |  | Cliente (Usuario externo), Asesor |  |  |
| **Descripción:** |  | Permite escalar la conversación del chatbot a un asesor humano. |  |  |
| **Disparador:** |  | El usuario solicita hablar con un asesor. |  |  |
| **Pre-condiciones:** |  | 1\. Asesores disponibles en el sistema. |  |  |
| **Post-condiciones:** |  | 1\. Conversación transferida al asesor. 2\. Historial de conversación disponible para el asesor. |  |  |
| **Flujo Normal:** |  | 1\. El usuario solicita hablar con un asesor. 2\. El chatbot verifica disponibilidad. 3\. Asigna un asesor. 4\. Transfiere la conversación. 5\. El asesor continúa la atención. |  |  |
| **Flujos Alternativos:** |  | **Flujo alterno 1** \- No hay asesores disponibles. **Flujo alterno 2** \- Fallo en la transferencia. |  |  |
