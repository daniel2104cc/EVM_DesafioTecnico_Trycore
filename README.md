# EVM Project Dashboard

Aplicación fullstack para gestionar proyectos y actividades utilizando
Earned Value Management (EVM).

Permite registrar el avance de las actividades y analizar automáticamente
el desempeño del proyecto en términos de costo y cronograma.

## Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pytest
- Ruff

### Frontend

- React
- Vite
- Recharts

## Funcionalidades

- Crear, consultar, editar y eliminar proyectos.
- Crear, consultar, editar y eliminar actividades.
- Eliminación en cascada de actividades al eliminar un proyecto.
- Cálculo automático de indicadores EVM:
  - PV
  - EV
  - CV
  - SV
  - CPI
  - SPI
  - EAC
  - VAC
- Consolidado EVM por proyecto.
- Interpretación visual de CPI y SPI.
- Dashboard con tabla de actividades.
- Gráfica comparativa de PV, EV y AC.
- Documentación interactiva de la API con Swagger.

## Estructura

```text
backend/
├── app/
│   ├── database.py
│   ├── evm.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── tests/
│   ├── conftest.py
│   ├── test_api.py
│   └── test_evm.py
├── init_db.py
├── pyproject.toml
└── requirements.txt

frontend/
└── src/
```

## Prerequisites

- Python 3.11+
- Node.js
- PostgreSQL
- Git
