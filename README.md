# UNPHROMEDIO 🚀

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

**UNPHROMEDIO** es una plataforma moderna y no oficial diseñada para estudiantes de la **UNPHU** (Universidad Nacional Pedro Henríquez Ureña). Ofrece una interfaz rápida, oscura y elegante para visualizar calificaciones, el pensum académico y, lo más importante, **proyectar el índice académico** en tiempo real.

---

## ⚡ Características Principales

-   **🔐 Acceso Institucional Seguro:** Inicio de sesión directo utilizando las credenciales oficiales de la universidad (Matrícula y Contraseña).
-   **📊 Dashboard en Tiempo Real:** Visualización instantánea de créditos acumulados, índice del periodo y estado de las asignaturas.
-   **🧮 Calculadora de Proyección de Índice:**
    -   Simula calificaciones futuras.
    -   Edita rubros específicos (Primer Parcial, Segundo Parcial, Trabajo Práctico, Examen Final).
    -   Calcula automáticamente la **Nota Final Aproximada (NFA)** y el **Literal** esperado.
    -   Visualiza cómo impactan estas notas en tu índice cuatrimestral.
-   **📚 Visualizador de Pensum:** Explora todas las materias de tu carrera organizadas por periodos, con indicadores de estado (Aprobada, En Curso, Pendiente).
-   **🎨 UI Neon Dark:** Una interfaz moderna diseñada para reducir la fatiga visual y mejorar la experiencia de usuario.

---

## 🛠️ Tecnologías Usadas

Este proyecto fue construido utilizando las últimas tecnologías de desarrollo web frontend:

-   **[React](https://reactjs.org/)**: Biblioteca para construir interfaces de usuario.
-   **[Vite](https://vitejs.dev/)**: Entorno de desarrollo ultrarrápido.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Framework de utilidades para el diseño (estilo Neon Dark).
-   **Fetch API**: Para la comunicación directa con el Gateway de la UNPHU.

---

## 🚀 Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clonar el repositorio:**

    ```bash
    git clone [https://github.com/tu-usuario/unphromedio.git](https://github.com/tu-usuario/unphromedio.git)
    cd unphromedio
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador:**
    Visita `http://localhost:5173` para ver la aplicación.

---

## 🔒 Privacidad y Seguridad

La seguridad de los datos estudiantiles es la prioridad número uno de este proyecto:

1.  **Sin Intermediarios:** Las credenciales (Usuario y Contraseña) se envían **directamente** desde tu navegador a los servidores de la UNPHU (`client-api-gateway.unphusist.unphu.edu.do`).
2.  **Sin Almacenamiento Remoto:** No guardamos tu contraseña en ninguna base de datos externa.
3.  **Almacenamiento Local:** El token de sesión se guarda localmente en tu dispositivo (`localStorage`) para mantener la sesión activa y se borra al cerrar sesión.

---

## 📐 Lógica de Cálculo (Reglamento Art. 12)

El sistema utiliza la fórmula oficial de la universidad para el cálculo de índices:

1.  **Puntos por Asignatura:**
    -   **A (90-100):** 4 Puntos
    -   **B (80-89):** 3 Puntos
    -   **C (70-79):** 2 Puntos
    -   **D (60-69):** 1 Punto
    -   **F (0-59):** 0 Puntos
2.  **Cálculo de NFA (Nota Final Aproximada):**
    -   Promedio de Parciales (`PP1` + `PP2` / 2) + Resto de Rubros (`TP`, `EF`, etc.) dividido entre la cantidad de variables.
3.  **Índice Académico:**
    $$ \frac{\sum (\text{Puntos} \times \text{Créditos})}{\sum \text{Créditos Totales}} $$

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la interfaz o nuevas funcionalidades:

1.  Haz un Fork del proyecto.
2.  Crea una rama para tu feature (`git checkout -b feature/NuevaFeature`).
3.  Haz Commit de tus cambios (`git commit -m 'Agregando nueva feature'`).
4.  Haz Push a la rama (`git push origin feature/NuevaFeature`).
5.  Abre un Pull Request.

---

## ⚠️ Aviso Legal

**UNPHROMEDIO** es un proyecto independiente y de código abierto desarrollado por estudiantes. No está afiliado, asociado, autorizado, respaldado ni conectado oficialmente de ninguna manera con la **Universidad Nacional Pedro Henríquez Ureña (UNPHU)**.

---

Hecho con 💚 y código por dexpider.
