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

def calculate_project_evm(activities: list) -> dict:
    if not activities:
        return {
            "bac": 0,
            "pv": 0,
            "ev": 0,
            "ac": 0,
            "cv": 0,
            "sv": 0,
            "cpi": None,
            "spi": None,
            "eac": None,
            "vac": None,
            "cost_status": "Not available",
            "schedule_status": "Not available",
        }

    total_bac = sum(activity.bac for activity in activities)
    total_pv = sum(
        (activity.planned_progress / 100) * activity.bac
        for activity in activities
    )
    total_ev = sum(
        (activity.actual_progress / 100) * activity.bac
        for activity in activities
    )
    total_ac = sum(activity.actual_cost for activity in activities)

    cv = total_ev - total_ac
    sv = total_ev - total_pv

    cpi = total_ev / total_ac if total_ac > 0 else None
    spi = total_ev / total_pv if total_pv > 0 else None

    eac = total_bac / cpi if cpi not in (None, 0) else None
    vac = total_bac - eac if eac is not None else None

    return {
        "bac": total_bac,
        "pv": total_pv,
        "ev": total_ev,
        "ac": total_ac,
        "cv": cv,
        "sv": sv,
        "cpi": cpi,
        "spi": spi,
        "eac": eac,
        "vac": vac,
        "cost_status": interpret_cpi(cpi),
        "schedule_status": interpret_spi(spi),
    }