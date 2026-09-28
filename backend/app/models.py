from pydantic import BaseModel, Field


class Patient(BaseModel):
    id: str = Field(min_length=1)
    room_type: str
    capacity_required: int = Field(default=1, ge=1)
    isolation_required: bool = False
    priority: int = Field(default=1, ge=1)


class Room(BaseModel):
    id: str
    room_type: str
    capacity: int = Field(ge=1)
    isolation: bool = False
    available: bool = True


class AllocationRequest(BaseModel):
    patients: list[Patient]
    rooms: list[Room]


class Conflict(BaseModel):
    patient_id: str
    reason: str
    constraint: str


class AllocationResult(BaseModel):
    allocations: dict[str, str]
    unallocated: list[str]
    explanations: dict[str, list[str]]
    status: str


class AllocationResponse(BaseModel):
    status: str
    allocations: dict[str, str]
    unallocated: list[str]
    explanations: dict[str, list[str]]
    conflicts: list[Conflict]
    search_log: list[str]