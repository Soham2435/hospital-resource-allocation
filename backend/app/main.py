from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .allocator import CSPAllocator
from .models import AllocationRequest, AllocationResponse


app = FastAPI(
    title="AI Hospital Resource Allocation System",
    description="Academic CSP-based hospital resource allocation prototype",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Hospital Resource Allocation System",
        "status": "running",
    }


@app.post(
    "/allocate",
    response_model=AllocationResponse,
)
def allocate(request: AllocationRequest):

    allocator = CSPAllocator(
        patients=request.patients,
        rooms=request.rooms,
    )

    return allocator.solve()