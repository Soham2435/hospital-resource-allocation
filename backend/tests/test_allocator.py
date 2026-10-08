import sys
from pathlib import Path

sys.path.insert(
    0,
    str(Path(__file__).resolve().parents[1])
)

from app.allocator import CSPAllocator
from app.models import Patient, Room

from app.allocator import CSPAllocator
from app.models import Patient, Room


def test_successful_allocation():
    patients = [
        Patient(
            id="P001",
            room_type="general",
            capacity_required=1,
            isolation_required=False,
            priority=1,
        ),
        Patient(
            id="P002",
            room_type="general",
            capacity_required=1,
            isolation_required=True,
            priority=1,
        ),
    ]

    rooms = [
        Room(
            id="G101",
            room_type="general",
            capacity=1,
            isolation=False,
            available=True,
        ),
        Room(
            id="G102",
            room_type="general",
            capacity=1,
            isolation=True,
            available=True,
        ),
    ]

    result = CSPAllocator(patients, rooms).solve()

    assert result["status"] == "allocated"
    assert len(result["allocations"]) == 2
    assert result["allocations"]["P002"] == "G102"
    assert result["allocations"]["P001"] == "G101"


def test_room_type_conflict():
    patients = [
        Patient(
            id="P001",
            room_type="icu",
            capacity_required=1,
            isolation_required=False,
            priority=1,
        )
    ]

    rooms = [
        Room(
            id="G101",
            room_type="general",
            capacity=1,
            isolation=False,
            available=True,
        )
    ]

    result = CSPAllocator(patients, rooms).solve()

    assert result["status"] == "conflict"
    assert result["allocations"] == {}
    assert result["unallocated"] == ["P001"]
    assert result["conflicts"][0]["constraint"] == "Room compatibility"


def test_isolation_constraint():
    patients = [
        Patient(
            id="P001",
            room_type="general",
            capacity_required=1,
            isolation_required=True,
            priority=1,
        )
    ]

    rooms = [
        Room(
            id="G101",
            room_type="general",
            capacity=1,
            isolation=False,
            available=True,
        )
    ]

    result = CSPAllocator(patients, rooms).solve()

    assert result["status"] == "conflict"
    assert result["unallocated"] == ["P001"]


def test_capacity_constraint():
    patients = [
        Patient(
            id="P001",
            room_type="general",
            capacity_required=2,
            isolation_required=False,
            priority=1,
        )
    ]

    rooms = [
        Room(
            id="G101",
            room_type="general",
            capacity=1,
            isolation=False,
            available=True,
        )
    ]

    result = CSPAllocator(patients, rooms).solve()

    assert result["status"] == "conflict"
    assert result["unallocated"] == ["P001"]


def test_unavailable_room_is_ignored():
    patients = [
        Patient(
            id="P001",
            room_type="general",
            capacity_required=1,
            isolation_required=False,
            priority=1,
        )
    ]

    rooms = [
        Room(
            id="G101",
            room_type="general",
            capacity=1,
            isolation=False,
            available=False,
        )
    ]

    result = CSPAllocator(patients, rooms).solve()

    assert result["status"] == "conflict"
    assert result["unallocated"] == ["P001"]


def test_resource_exhaustion_triggers_backtracking():
    patients = [
        Patient(
            id="P001",
            room_type="general",
            capacity_required=1,
            isolation_required=False,
            priority=1,
        ),
        Patient(
            id="P002",
            room_type="general",
            capacity_required=1,
            isolation_required=False,
            priority=1,
        ),
        Patient(
            id="P003",
            room_type="general",
            capacity_required=1,
            isolation_required=False,
            priority=1,
        ),
    ]

    rooms = [
        Room(
            id="G101",
            room_type="general",
            capacity=1,
            isolation=False,
            available=True,
        ),
        Room(
            id="G102",
            room_type="general",
            capacity=1,
            isolation=False,
            available=True,
        ),
    ]

    result = CSPAllocator(patients, rooms).solve()

    assert result["status"] == "conflict"
    assert result["allocations"] == {}
    assert set(result["unallocated"]) == {
        "P001",
        "P002",
        "P003",
    }

    assert any(
        "Forward checking failed" in event
        for event in result["search_log"]
    )

    assert any(
        "Backtracking from" in event
        for event in result["search_log"]
    )


def test_no_room_is_assigned_to_multiple_patients():
    patients = [
        Patient(
            id="P001",
            room_type="general",
            capacity_required=1,
            isolation_required=False,
            priority=1,
        ),
        Patient(
            id="P002",
            room_type="general",
            capacity_required=1,
            isolation_required=False,
            priority=1,
        ),
    ]

    rooms = [
        Room(
            id="G101",
            room_type="general",
            capacity=1,
            isolation=False,
            available=True,
        ),
        Room(
            id="G102",
            room_type="general",
            capacity=1,
            isolation=False,
            available=True,
        ),
    ]

    result = CSPAllocator(patients, rooms).solve()

    assigned_rooms = list(result["allocations"].values())

    assert len(assigned_rooms) == len(set(assigned_rooms))