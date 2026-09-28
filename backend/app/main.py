from fastapi import FastAPI

from .allocator import CSPAllocator
from .models import AllocationRequest, AllocationResponse


app = FastAPI(
    title="AI Hospital Resource Allocation System",
    description="Academic CSP-based hospital resource allocation prototype",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "AI Hospital Resource Allocation System",
        "status": "running"
    }


@app.post(
    "/allocate",
    response_model=AllocationResponse
)
def allocate(request: AllocationRequest):

    allocator = CSPAllocator(
        patients=request.patients,
        rooms=request.rooms
    )

    return allocator.solve()