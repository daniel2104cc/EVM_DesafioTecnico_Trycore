def interpret_cpi(cpi: float | None) -> str:
    if cpi is None:
        return "Not available"

    if cpi > 1:
        return "Under budget"

    if cpi < 1:
        return "Over budget"

    return "On budget"


def interpret_spi(spi: float | None) -> str:
    if spi is None:
        return "Not available"

    if spi > 1:
        return "Ahead of schedule"

    if spi < 1:
        return "Behind schedule"

    return "On schedule"


def calculate_evm(
    bac: float,
    planned_progress: float,
    actual_progress: float,
    actual_cost: float,
) -> dict:
    pv = (planned_progress / 100) * bac
    ev = (actual_progress / 100) * bac

    cv = ev - actual_cost
    sv = ev - pv

    cpi = ev / actual_cost if actual_cost > 0 else None
    spi = ev / pv if pv > 0 else None

    eac = bac / cpi if cpi not in (None, 0) else None
    vac = bac - eac if eac is not None else None

    return {
        "pv": pv,
        "ev": ev,
        "cv": cv,
        "sv": sv,
        "cpi": cpi,
        "spi": spi,
        "eac": eac,
        "vac": vac,
        "cost_status": interpret_cpi(cpi),
        "schedule_status": interpret_spi(spi),
    }