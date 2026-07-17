# AI Usage Documentation — Backend (Arrow Maze)

**Proyecto:** Arrow Maze — Backend NestJS + TypeORM + PostgreSQL + JWT
**Arquitectura:** Clean Architecture de 4 capas (Domain → Application → Adapters → Infrastructure)
**NRC:** 25783

Este documento registra el uso de herramientas de inteligencia artificial durante el desarrollo del backend, conforme a la Sección 7 del enunciado. El equipo declara este uso de forma transparente: la IA participó de manera significativa tanto en el diseño como en la implementación, siempre bajo dirección, revisión y validación del equipo.

---

## 1. Herramientas utilizadas

| Herramienta | Modelo / Versión | Rol en el flujo de trabajo |
|---|---|---|
| Claude (claude.ai) | Claude Sonnet 4.6 | Diseño y revisión del modelo de dominio (DDD), justificación del stack tecnológico, modelado formal de las capas de Dominio y Aplicación, auditoría de incongruencias entre el enunciado y la mecánica real del juego. |
| Claude Code (CLI) | Claude Sonnet / Opus (varias versiones a lo largo del proyecto) | Implementación de módulos del backend (economía de monedas, leaderboard global, tableros personalizados, sistema de scores), corrección de bugs, tests y gestión de commits. |
| Gemini (Google) | Gemini | Análisis del código del backend para extraer y confirmar la estructura exacta de endpoints y DTOs durante la integración con el frontend. |

---

## 2. Registro de uso por tarea

### 2.1 Diseño del modelo de dominio (DDD)

El equipo partió de un diagrama de dominio propio y usó la IA como revisor técnico: confirmar si `LevelProgress` debía ser Entity o Aggregate Root, si `PlayerProgress.levels` debía modelarse como lista, y si `ScoreEntry` se justificaba como raíz de agregado. La IA validó o corrigió cada decisión con justificación DDD, y señaló puntos que solo el equipo podía resolver (reglas de negocio no definidas, como el tope de entradas del leaderboard). Las correcciones estructurales se aplicaron al diagrama; las decisiones de producto quedaron en manos del equipo.

### 2.2 Justificación del stack tecnológico

Se solicitó a la IA argumentar la elección de NestJS (y Flutter en el cliente) frente a los requisitos de la rúbrica: estructura modular compatible con Clean Architecture y DIP, soporte de AOP vía Interceptors y Guards, Swagger/OpenAPI por decoradores, y validación con `class-validator`. El equipo adoptó el análisis como base de la decisión, verificando en la práctica que las ventajas se materializaran.

### 2.3 Modelado formal de las capas de Dominio y Aplicación

La IA consolidó el modelo completo de la capa de Dominio aplicando correcciones acordadas en revisiones previas: value objects en lugar de primitivos y enums, puertos de repositorio en el dominio, y puertos de infraestructura (`IPasswordEncoder`, `IJwtTokenProvider`) reubicados en Application por no pertenecer al lenguaje ubicuo del juego. Para la capa de Aplicación definió casos de uso, DTOs y los patrones GoF exigidos (Template Method, Strategy, Observer), verificando que todas las dependencias apuntaran hacia adentro.

### 2.4 Auditoría de incongruencias del enunciado

Antes de modelar la arquitectura final, el equipo pidió a la IA contrastar el enunciado oficial contra la mecánica real de Arrow Maze. Se identificaron 9 incongruencias — entre ellas, que el patrón Command se justificaba con un undo/redo inexistente en el juego real, y que el evento `PlayerMoved` respondía al modelo mental de un laberinto tradicional y no a la mecánica real de activación de flechas. A partir del contexto aportado por el equipo (vidas, monedas, comodines, bloqueo entre flechas), la IA propuso nomenclatura de dominio más fiel (`ArrowReleased` en lugar de `PlayerMoved`) y el equipo decidió qué mecánicas entraban en el alcance final.

### 2.5 Implementación de módulos

Con el diseño validado, Claude Code implementó los módulos principales del backend bajo prompts dirigidos por el equipo: el value object `Coins` y la economía de monedas en `PlayerProgress`, el endpoint `GET /leaderboard/global` con su caso de uso, el módulo completo de tableros personalizados (crear, listar, eliminar con verificación de autoría), y el envío de scores. Cada módulo se verificó con la suite de tests y pruebas manuales contra la API antes de aceptarse.

### 2.6 Corrección de bugs

El equipo reportaba el síntoma y la IA diagnosticaba y corregía, con validación posterior del equipo. Casos destacados: un bug de expiración de JWT que invalidaba el token casi inmediatamente después de emitirlo, y la corrección de los grids de varios niveles (006–010) que tenían un patrón de celdas no adyacentes que rompía la generación de tableros en el cliente.

---

## 3. Porcentaje aproximado de código con asistencia de IA

**Estimación: ~70–75% del código del backend contó con asistencia directa de IA.**

La mayor parte del texto del código (entidades, casos de uso, controladores, módulos) fue generada por IA a partir de especificaciones y diagramas del equipo. El diseño del dominio partió de propuestas del equipo revisadas y refinadas con IA. El equipo aportó: la definición del alcance y las reglas de negocio, los diagramas base, la decisión final sobre cada incongruencia del enunciado, la revisión de los módulos generados y la validación funcional contra la API (Swagger y pruebas manuales).

---

## 4. Casos donde la IA produjo resultados incorrectos o subóptimos

| Caso | Cómo se detectó | Cómo se corrigió |
|---|---|---|
| La IA introdujo por iniciativa propia la economía de monedas (`coinsBalance`, `earnCoins`, `spendCoins`) al modelar la capa de Aplicación, sin que estuviera confirmada en el alcance. | El equipo notó la adición al revisar el modelo entregado. | Se evaluó explícitamente como decisión de producto; el equipo decidió incorporarla al alcance final, pero la lección fue no asumir que toda propuesta de la IA está pre-aprobada. |
| En conversaciones largas de diseño, la IA reintroducía ocasionalmente elementos ya descartados o perdía consistencia con decisiones tomadas mensajes atrás. | Auditoría del equipo contra el histórico de decisiones. | Se pidió corrección explícita en cada caso; se adoptó la práctica de revisar cada entrega contra lo acordado en vez de asumir coherencia automática. |
| Supuestos de diseño heredados del enunciado (undo/redo, evento `PlayerMoved`) que no correspondían al juego real. | El ejercicio de auditoría de incongruencias (2.4), motivado por el equipo. | Se corrigieron los patrones y eventos afectados antes de implementar, evitando modelar funcionalidad inexistente. |
| Bug de expiración de JWT (token inválido casi de inmediato). | Detectado en pruebas de integración con el cliente. | Diagnosticado y corregido con la IA; verificado con login real. |

---

## 5. Reflexión del equipo sobre el impacto de la IA

**En productividad:** el impacto fue claramente positivo. La IA permitió implementar en semanas un backend con Clean Architecture completa, patrones GoF justificados, documentación Swagger y varios módulos de features (economía, leaderboard, tableros personalizados) que habrían tomado mucho más tiempo escribiendo cada clase manualmente. El mayor ahorro no estuvo solo en generar código, sino en la fase de diseño: contrastar el enunciado contra la mecánica real del juego con ayuda de la IA evitó construir sobre supuestos equivocados.

**En calidad:** la calidad final dependió directamente de la calidad de la supervisión. Cuando el equipo dio contexto preciso, restricciones claras y revisó cada entrega, el resultado fue sólido y consistente con la arquitectura. Cuando la revisión fue superficial, se colaron errores que solo aparecieron en pruebas de integración. La conclusión del equipo es que la IA funciona como un desarrollador muy rápido pero sin memoria perfecta ni contexto de producto: la responsabilidad de la arquitectura, las reglas de negocio y la verificación final es siempre del equipo.

**Práctica adoptada:** especificar antes de generar (diagramas y reglas primero), dividir el trabajo en fases verificables, validar cada módulo contra la API real antes de aceptarlo, y documentar el uso de IA en el momento en que ocurre, no al final.
