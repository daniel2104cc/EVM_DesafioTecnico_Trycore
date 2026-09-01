import pytest

from app.evm import calculate_evm, interpret_cpi, interpret_spi


def test_calculate_evm_returns_expected_values():
    result = calculate_evm(
        bac=10000,
        planned_progress=60,
        actual_progress=50,
        actual_cost=5500,
    )

    assert result["pv"] == pytest.approx(6000)
    assert result["ev"] == pytest.approx(5000)
    assert result["cv"] == pytest.approx(-500)
    assert result["sv"] == pytest.approx(-1000)
    assert result["cpi"] == pytest.approx(0.90909, rel=1e-4)
    assert result["spi"] == pytest.approx(0.83333, rel=1e-4)
    assert result["eac"] == pytest.approx(11000)
    assert result["vac"] == pytest.approx(-1000)


def test_actual_cost_zero_returns_undefined_cost_indexes():
    result = calculate_evm(
        bac=10000,
        planned_progress=50,
        actual_progress=40,
        actual_cost=0,
    )

    assert result["cpi"] is None
    assert result["eac"] is None
    assert result["vac"] is None
    assert result["cost_status"] == "Not available"


def test_planned_progress_zero_returns_undefined_spi():
    result = calculate_evm(
        bac=10000,
        planned_progress=0,
        actual_progress=20,
        actual_cost=1000,
    )

    assert result["pv"] == 0
    assert result["spi"] is None
    assert result["schedule_status"] == "Not available"


def test_actual_progress_zero():
    result = calculate_evm(
        bac=10000,
        planned_progress=50,
        actual_progress=0,
        actual_cost=1000,
    )

    assert result["ev"] == 0
    assert result["cv"] == -1000
    assert result["sv"] == -5000
    assert result["cpi"] == 0
    assert result["eac"] is None
    assert result["vac"] is None


@pytest.mark.parametrize(
    ("cpi", "expected"),
    [
        (1.2, "Under budget"),
        (1.0, "On budget"),
        (0.8, "Over budget"),
        (None, "Not available"),
    ],
)
def test_interpret_cpi(cpi, expected):
    assert interpret_cpi(cpi) == expected


@pytest.mark.parametrize(
    ("spi", "expected"),
    [
        (1.2, "Ahead of schedule"),
        (1.0, "On schedule"),
        (0.8, "Behind schedule"),
        (None, "Not available"),
    ],
)
def test_interpret_spi(spi, expected):
    assert interpret_spi(spi) == expected