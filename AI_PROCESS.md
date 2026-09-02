# AI-Assisted Development Process

## 1. Contexto

Breve explicación del desafío y de cómo decidí utilizar IA como herramienta
de apoyo durante el proceso de aprendizaje, diseño, implementación y validación.

Elección del stack tecnológico

Decidí utilizar Python con FastAPI, PostgreSQL y React principalmente porque son tecnologías con las que ya tenía experiencia previa. Teniendo tiempo limitado para desarrollar la prueba, consideré más importante trabajar con un stack conocido y dedicar el tiempo a comprender correctamente EVM, diseñar la solución y realizar las pruebas, en lugar de agregar la dificultad de aprender una tecnología nueva al mismo tiempo.

## 2. Herramientas de IA utilizadas

*Claude
*ChatGPT

\*\*Motivo de uso: Son dos de las inteligencias artificiales que mayormente uso y realmente ya tengo un historial con ellas, entonces conocen mi stack y mi manera de abordar problemas, la uso en apoyo para comprender un dominio nuevo, analizar decisiones y posteriormente apoyar implementación y pruebas.

## 3. Registro cronológico de prompts

### Prompt 01

Tool: chatGPT
**Objetivo:**
Entender los conceptos básicos del proyecto y Earned Value Management antes de implementar.

> Actúa como un desarrollador senior en full stack que sabe de estructuración de software. puedes darme un panorama y roadmap para realizar esta prueba técnica? lo haré con python con fastapi, con data base postgres y frontend react... además no son 5 días sino que son 24 horas, ayúdame a entender conceptos de una manera dinámica y clara tal como lo menciona el documento, necesito entender y tener claro todo lo necesario para iniciar con el desarrollo del proyecto...

### Prompt 02

Tool: chatGPT

> ok vamos a iniciar paso a paso de ese roadmap y a medida que vamos avanzando hacia las siguientes actividades vamos tachando las actividades realizadas. Ayudame a entender cada uno de ellos sin perder el hilo.

### Prompt 03

Tool: Claude

> qué es EVM y como entenderlo?

### Prompt 04

Tool: Claude

> puedes explicarme a detalle cada variable con ejemplos?

### Prompt 05

Tool: chatGPT

> Dame ejercicios para lograr entender cada una de las variables implicadas en EVM

### Prompt 06

Tool: chatGPT

> los resultados: Dpv=1200000 ev=900000 cpi=0.81818181 spi=75% vamos mal en costos ya que por cada 1$ estoy produciendo 0.8181818 de valor estoy produciendo un 75% del valor que deberia estar produciendp

### Prompt 07

Tool: chatGPT

> perfecto: pv= 200000 ev= 0 cv=-100000 sv=-200000 cpi=0 spi=0 eac=null vac=null

    1. vamos mal en costos a que cada 1$ genero 0 de valor
    2. vamos mal en cronograma estamos atrasados
    3. porque el divisor es numero mayor a cero

### Prompt 08

Tool: chatGPT

> tengo una duda con el consolidado del proyecto, para sacar el CPI y SPI general debo promediar los indicadores de las actividades o primero sumar los valores y volver a calcular? explicame por fa con un ejemplo sencillo para tenerlo claro antes de implementarlo

### Prompt 09

Tool: chatGPT

> ayudame a revisar nuevamente los casos borde de EVM para asegurarme que los entiendo bien, especialmente cuando AC es 0, PV es 0, el avance real es 0 o el proyecto no tiene actividades. quiero entender cuando deberia ser 0 y cuando deberia ser null

### Prompt 10

Tool: chatGPT

> ok, ya con estos ejercicios tengo un mucho mas claro los usos de las variables y el objetivo de la herramienta, continuemos a el siguiente paso del road map

### Prompt 11

Tool: chatGPT

> A
> METHOD: post
> ENDPOINT: /api/projects/{project_id}/activities/
> B
> METHOD: PUT
> ENDPOINT: /api/activities/{activity_id}
> C
> METHOD: Delete
> ENDPOINT: /api/activities/{activity_id}
> D
> METHOD: GET
> ENDPOINT: /api/projects/1/dashboard

### Prompt 12

Tool: chatGPT

> esto ya lo habiamos hecho, estas repitiendo lo mismo varias veces, estamos haciendo pruebas y este fue el resultado que obtuve: print(result)
> EVMMetrics(pv=Decimal('1200000.0'), ev=Decimal('900000.00'), cv=Decimal('-200000.00'), sv=Decimal('-300000.00'), cpi=Decimal('0.8181818181818181818181818182'), spi=Decimal('0.75'), eac=Decimal('2444444.444444444444444444444'), vac=Decimal('-444444.444444444444444444444'), cost_status=<CostStatus.OVER_BUDGET: 'OVER_BUDGET'>, schedule_status=<ScheduleStatus.BEHIND_SCHEDULE: 'BEHIND_SCHEDULE'>)

### Prompt 13

Tool: chatGPT

> Puedes por fa ayudarme a mantener el Gitflow, dame una guía para separar las branchs y cuando hacer los merge a medida que vayamos desarrollando el proyecto

### Prompt 14

Tool: chatGPT

> creo que docker esta causando problemas ya que Docker está instalado correctamente, pero Windows no tiene disponible la virtualización que Docker Desktop necesita.. tampoco tengo postgresql así que por fa ayúdame paso a paso para instalarlo y así hacer lo correspondiente al paso 9 sin la necesidad de usar Docker

### Prompt 15

Tool: chatGPT

> tengo esto funcionando pero quiero entender por que lo estamos haciendo de esta manera antes de continuar, puedes explicarme por fa?

### Prompt 16

Tool: chatGPT

> ya tengo projects funcionando, tambien cree activities con la relacion hacia project y ya tengo el servicio de EVM probado. ayudame a continuar con activity service pero primero explícame o dame una idea de como deberia conectar la actividad que esta en postgres con los calculos de EVM sin guardar esos indicadores en la base de datos.

### Prompt 17

Tool: chatGPT

> ok, vamos al siguiente paso ya quedo completa esta parte

### Prompt 18

Tool: chatGPT

> Ya tengo Project, Activity, la relación 1:N con Foreign Key y ON DELETE CASCADE. Ayúdame a diseñar ActivityService y el contrato de respuesta de Activity de forma que PostgreSQL almacene solamente los datos fuente y los indicadores EVM se calculen dinámicamente

### Prompt 19

Tool: chatGPT

> cuando terminemos activities necesito sacar el consolidado del proyecto para el dashboard, puedes ayudarme a pensar como deberia ser ese endpoint? la idea es que retorne el proyecto, sus actividades, las metricas de cada una y las metricas generales sin meter toda la logica en el router

### Prompt 20

Tool: chatGPT

> ya funciona, pero quiero verificar... como puedo comprobar que el resultado realmente es correcto? y ya podemos continuar

### Prompt 21

Tool: chatGPT

> ayudame a organizar el frontend en react pero de forma sencilla, no quiero perder tiempo haciendo un diseño muy elaborado. necesito cumplir con la tabla de actividades, los indicadores, los estados de CPI y SPI y la grafica de PV EV y AC

### Prompt 22

Tool: chatGPT

> puedes darme un ejemplo con 3 actividades y calcular manualmente los indicadores para compararlos con lo que devuelve mi sistema? quiero asegurarme que los numeros realmente tengan sentido y no solo que los tests pasen

### Prompt 23

Tool: chatGPT

> encuentro un problema en las graficas y es que todas son negras y no se diferencian y ademas que no tienen valor con respecto a que tiempo y demas...

## 4. Cómo aprendí Earned Value Management (EVM)

### 4.1 Conceptos iniciales

Con el fin de identificar y relacionarme con las variables implicadas en EVM las anoté en mi agenda con su respectivo nombre y formula.

### 4.2 Ejercicios manuales

Con los ejercicios que la inteligencia artificial me proponía en los prompts 04-09, donde la IA me proporcionaba valores iniciales como BAC, Planned_avance, real_avance y AC, para así calcular el resto de variables y responder ciertas preguntas relacionadas como conclusión. Estos ejercicios los realice manualmente con calculadora y papel, lo cual me ayudo bastante para entender el objetivo de cada variable y en general
de EVM.

### 4.3 Casos borde

Durante el análisis y resolución de ejercicios observé que algunos indicadores requieren divisiones y,
por tanto, existe situaciones en los que ciertas variables no pueden calcularse matemáticamente, ya que dividir entre cero no produce 0 sino
indefinido o null, es por eso que se llego a las siguientes conclusiones:

BAC must be > 0

0 <= planned_progress <= 100%

0 <= actual_progress <= 100%

if AC == 0
CPI = null

if PV == 0
SPI = null

if CPI== 0
EAC = null

if EAC == null
VAC = null

### 4.4 Cómo validé mi comprensión

En general valide mi comprensión a través de ejercicios prácticos y asimismo sacando conclusiones basadas en los resultados obtenidos y con los parámetros mencionados y las condiciones de los resultados.

## 5. Decisiones en las que no seguí la recomendación de IA

### Decisión 1

Decisión arquitectónica:Reestructurar la arquitectura hacia una solución más simple

\*\*Sugerencia de la IA: Al comenzar como tal la implementacion la IA me propuso una arquitectura bastante modular, separando la aplicación en varias capas y responsabilidades, utilizando elementos como routers, servicios, repositorios, dependencias y distintos módulos para asi contar con una aplicación robusta y con accesos estructurados. La intención de la propuesta era buena ya que buscaba aplicar principios de separación de responsabilidades y construir una arquitectura escalable, pero para la magnitud del proyecto no requería realmente un consumo de tiempo que podría afectar los tiempos de entrega.

\*\*Decisión que tomé: Inicialmente seguí esta recomendación y comencé a desarrollar el backend bajo esa estructura. Sin embargo, a medida que avanzaba, noté que para el alcance real de la prueba estaba introduciendo más complejidad de la necesaria. Ya que Operaciones relativamente sencillas requerían modificar o navegar por varios archivos y scripts. Esto aumentaba el tiempo de implementación y hacía más difícil seguir el flujo completo de una petición. Además, considerando que el sistema no tendría mayor alcance sino que es un sistema estándar que no requiere de mayores funcionalidades sino el fin de gestión de proyectos, actividades y cálculos de Earned Value Management, muchas de esas complejidades no generaban un valor agregado al sistema.

\*\*Resultado: Ya que para esta prueba necesitaba principalmente claridad, facilidad a la hora de realizar pruebas, velocidad de implementacion y capacidad de explicar el sistema durante la evaluación, decidí no continuar implementando la arquitectura sugerida por la IA y reestructuré la arquitectura a un modelo mas simple.

Volví a iniciar la implementación de cero pero con un entendimiento mejor acerca de cada parte del sistema, lo que me permitió depurar estructura innecesaria y mantener únicamente archivos realmente necesarios.

Conclusión
Esta reestructuración hizo que el flujo de la sistema fuera mas sencilla de entender, de realizar pruebas y en general de mantener. Lo que me permitió avanzar mas rápido sin sacrificar aspectos importantes de diseño.
Además, fue muy interesante aprender que no siempre es necesario aplicar una arquitectura únicamente porque sea recomendada para proyectos robustos. En este caso escogí una solución simple con limites claros antes de un sistema complejo y con características que no eran estrictamente necesarias para el tipo de proyecto.

### Decisión 2

\*\*Decisión que tomé: Usar PostgreSQL instalado localmente en lugar de Docker Compose
Sugerencia de la IA: utilizar Docker Compose para levantar PostgreSQL y aislar el entorno de base de datos.

Mi decisión: instalar y ejecutar PostgreSQL directamente en Windows. Aunque inicie el proceso de usar Docker Desktop, por su simplicidad de implementación, en este caso requería una configuración de virtualización que no esta disponible en mi equipo. Dado que la prueba tenía un límite de tiempo, llegue a la conclusión de que resolver el incidente de la configuración de Docker podía consumir tiempo sin aportar valor a los requerimientos de la prueba.

Aprendizaje o conclusion: Mi decisión no fue como tal abandonar la idea principal de un entorno realmente confiable y portable, sino priorizar una solución funcional y verificable ante una limitación en especifico del entorno y del tiempo disponible.

## 6. Validación de los cálculos EVM

### ¿Cómo verifiqué que los cálculos eran correctos?

No solo validé los cálculos comprobando que el código ejecutara sin ningún error. Antes de implementar las fórmulas en EVM, resolví distinto ejercicios manualmente utilizando valores base como BAC, porcentaje planificado, porcentaje real y AC.

Por ejemplo:

BAC = 2,000,000
Planned Progress = 60%
Actual Progress = 45%
AC = 1,100,000

calculé manualmente:

PV = 1,200,000
EV = 900,000
CV = -200,000
SV = -300,000
CPI ≈ 0.818
SPI = 0.75

Luego ejecuté el mismo ejercicio en el código y comparé los resultado con los datos obtenidos manualmente. de esa manera, comprobé que no solamente el código funcionaba sino que las formulas estaban produciendo los resultados esperados de una manera coherente.

## 7. Decisión de arquitectura tomada de forma independiente

\*\*Decisión: La base de datos PostgreSQL almacena únicamente los datos fuente ingresados por el usuario (BAC, porcentaje planificado, porcentaje real y AC), mientras que la lógica de negocio calcula los indicadores sin guardar en db

Decidí únicamente almacenar los datos ingresados por el usuario en cada actividad en la base de datos tales como:

- nombre
- BAC
- porcentaje de avance planificado
- porcentaje de avance real
- AC

Los indicadores EVM: PV, EV, CV, SV, CPI, SPI, EAC y VAC no se almacenan directamente en la base de datos. Estos son calculados en la
capa de negocio en base a datos ingresados por el usuario

### Razón de la decisión

Los indicadores EVM son derivados de los datos base y si se almacenan directamente en la db podrían mostrarse datos desactualizados o erróneos al usuario respecto a los datos actuales de la actividad.
Es por eso que decidí mantener los datos base y calcular los indicadores en la capa de negocio cuando sea requerido.

Esta decisión implica realizar nuevamente los cálculos al consultar las actividades
o el proyecto. Sin embargo, las operaciones EVM son cálculos matemáticos simples,
por lo que para el alcance de esta aplicación el costo computacional es pequeño
comparado con el beneficio de evitar información duplicada o inconsistente.

## 8. Reflexión final

### Qué salió bien

Considero que una de las cosas que mejor salió fue desde un principio dedicar tiempo a entender la lógica de EVM antes de iniciar a desarrollar cualquier solución. Resolver los cálculos manualmente me ayudaron realmente a entender la utilidad de cada variable y así mismo implementar la lógica con mayor confianza y seguridad de que ya tenia datos aterrizados para obtener de los procesos de pruebas.

Por otra parte, otro punto positivo fue la ventaja de poder ir validando parte antes de continuar, creo que esa es una de las grandes ventajas de construir un sistema modular con responsabilidades separadas y claras: primero lo que fueron cálculos, luego PostgreSQL, luego endpoints y finalmente pruebas de integración, lo que hizo mas sencillo la identificación de problemas y bugs.

### Qué fue difícil

Principalmente la cantidad de tiempo, creo que una cantidad de tiempo reducida me puso a prueba para así decidir que tipo de actividades vale la pena implementar y cuales realmente generan complejidad innecesaria.
Considero que otro factor que en un principio consideré difícil fue trabajar con un dominio o términos que no conocía como lo es EVM, porque realmente no quería limitarme a transcribir formulas sin entender sus funcionalidades y uso.
Ya a nivel técnico quizá el contratiempo con el entorno de la tecnología Docker, la falta virtualización quizá me hizo perder algo de tiempo mientras investigue otro tipo de soluciones disponibles.

### Qué aprendí

Aprendí de una manera general los conceptos de Earned Value Mangement(EVM) y como sus variables como CPI Y SPI permiten saber el estado de costos y cronograma de un proyecto.
Por otro lado, reforcé la importancia de verificar los resultados de negocio o lógica de negocio de forma independiente al código. Ya que sabiendo el resultado esperado se puede comparar y comprobar el correcto funcionamiento de un sistema.
Asimismo, un uso mas detallado en el control de versiones y Branchs de GIT.

Para el consolidado del proyecto concluí que CPI y SPI no deben obtenerse promediando los indicadores individuales de las actividades. Primero se suman PV, EV y AC de todas las actividades y posteriormente se recalculan los indicadores:

CPI = EV total / AC total

SPI = EV total / PV total
