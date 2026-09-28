from .models import Patient, Room


class CSPAllocator:

    def __init__(self, patients: list[Patient], rooms: list[Room]):
        self.patients = patients
        self.rooms = rooms

        # Initial domains for every patient.
        self.domains = {
            patient.id: self.get_domain(patient)
            for patient in patients
        }

        # Current assignments:
        # patient_id -> room_id
        self.assignments: dict[str, str] = {}

        # Search events for explainability.
        self.search_log: list[str] = []

        # Detected allocation conflicts.
        self.conflicts: list[dict] = []

    def get_domain(self, patient: Patient) -> list[Room]:
        """
        Generate rooms that satisfy the patient's
        static constraints.
        """

        domain = []

        for room in self.rooms:

            if not room.available:
                continue

            if room.room_type != patient.room_type:
                continue

            if room.capacity < patient.capacity_required:
                continue

            if patient.isolation_required and not room.isolation:
                continue

            domain.append(room)

        return domain

    def is_consistent(self, room: Room) -> bool:
        """
        Check constraints involving the current assignment.
        """

        # A room cannot be assigned to multiple patients.
        if room.id in self.assignments.values():
            return False

        return True

    def select_unassigned_patient(self) -> Patient | None:
        """
        Select the unassigned patient with the smallest
        remaining domain.

        This is the Minimum Remaining Values (MRV) heuristic.
        """

        unassigned = [
            patient
            for patient in self.patients
            if patient.id not in self.assignments
        ]

        if not unassigned:
            return None

        return min(
            unassigned,
            key=lambda patient: len(self.domains[patient.id])
        )

    def forward_check(self, assigned_room_id: str) -> bool:
        """
        Forward checking:
        Remove the assigned room from the domains
        of all remaining unassigned patients.

        If any remaining patient has no possible room,
        the current branch cannot produce a solution.
        """

        for patient in self.patients:

            # Skip already assigned patients.
            if patient.id in self.assignments:
                continue

            # Remove the assigned room from this patient's domain.
            self.domains[patient.id] = [
                room
                for room in self.domains[patient.id]
                if room.id != assigned_room_id
            ]

            # Empty domain means this branch is impossible.
            if not self.domains[patient.id]:

                self.search_log.append(
                    f"Forward checking failed: "
                    f"{patient.id} has no remaining rooms."
                )

                return False

        return True

    def backtrack(self) -> dict[str, str] | None:
        """
        Recursive backtracking search with forward checking.
        """

        # All patients assigned -> solution found.
        if len(self.assignments) == len(self.patients):

            self.search_log.append(
                "Complete solution found."
            )

            return self.assignments.copy()

        # Select next patient using MRV.
        patient = self.select_unassigned_patient()

        if patient is None:
            return self.assignments.copy()

        # No compatible rooms exist.
        if not self.domains[patient.id]:

            self.search_log.append(
                f"{patient.id}: no compatible rooms available."
            )

            return None

        # Save the current domains before modifying them.
        domains_backup = {
            patient_id: rooms.copy()
            for patient_id, rooms in self.domains.items()
        }

        # Try every room in the patient's current domain.
        for room in self.domains[patient.id]:

            self.search_log.append(
                f"Trying {patient.id} -> {room.id}"
            )

            if not self.is_consistent(room):

                self.search_log.append(
                    f"Rejected {patient.id} -> {room.id}: "
                    f"room already assigned."
                )

                continue

            # Make assignment.
            self.assignments[patient.id] = room.id

            self.search_log.append(
                f"Assigned {patient.id} -> {room.id}"
            )

            # Propagate the constraint to remaining patients.
            if self.forward_check(room.id):

                result = self.backtrack()

                if result is not None:
                    return result

            # Restore domains after failed branch.
            self.domains = {
                patient_id: rooms.copy()
                for patient_id, rooms in domains_backup.items()
            }

            self.search_log.append(
                f"Backtracking from "
                f"{patient.id} -> {room.id}"
            )

            # Undo assignment.
            del self.assignments[patient.id]

        return None

    def generate_explanation(self) -> dict[str, list[str]]:
        """
        Generate human-readable reasons for each
        successful allocation.
        """

        explanations = {}

        for patient in self.patients:

            if patient.id not in self.assignments:
                continue

            reasons = [
                "Room type compatible",
                "Room capacity sufficient",
                "Room available"
            ]

            if patient.isolation_required:
                reasons.append(
                    "Isolation requirement satisfied"
                )
            else:
                reasons.append(
                    "Isolation requirement not required"
                )

            reasons.append(
                "Room not already assigned"
            )

            explanations[patient.id] = reasons

        return explanations

    def find_conflict_patient(self) -> str:
        """
        Identify the patient that most directly caused
        the final domain failure during search.
        """

        for event in reversed(self.search_log):

            if "Forward checking failed:" in event:

                patient_id = event.split(
                    "Forward checking failed:"
                )[1].strip()

                if " has no remaining rooms." in patient_id:
                    patient_id = patient_id.replace(
                        " has no remaining rooms.",
                        ""
                    )

                return patient_id

        return self.patients[-1].id

    def solve(self) -> dict:
        """
        Solve the CSP and return a structured result.
        """

        # Reset search state.
        self.assignments = {}
        self.search_log = []
        self.conflicts = []

        # Rebuild initial domains.
        self.domains = {
            patient.id: self.get_domain(patient)
            for patient in self.patients
        }

        # Detect patients with no compatible rooms
        # before starting the search.
        for patient in self.patients:

            if not self.domains[patient.id]:

                self.conflicts.append({
                    "patient_id": patient.id,
                    "reason": (
                        "No available room satisfies the "
                        "patient's configured requirements."
                    ),
                    "constraint": "Room compatibility"
                })

        # If a patient has no possible room at all,
        # there is no valid complete solution.
        if self.conflicts:

            return {
                "status": "conflict",
                "allocations": {},
                "unallocated": [
                    patient.id
                    for patient in self.patients
                ],
                "explanations": {},
                "conflicts": self.conflicts,
                "search_log": self.search_log
            }

        # Start CSP search.
        solution = self.backtrack()

        # Complete solution found.
        if solution is not None:

            explanations = self.generate_explanation()

            return {
                "status": "allocated",
                "allocations": solution,
                "unallocated": [],
                "explanations": explanations,
                "conflicts": [],
                "search_log": self.search_log
            }

        # Initial domains were valid, but the complete CSP
        # could not be satisfied because patients compete
        # for the available rooms.
        self.conflicts.append({
            "patient_id": self.find_conflict_patient(),
            "reason": (
                "No complete allocation exists because "
                "available rooms cannot satisfy all patients "
                "simultaneously."
            ),
            "constraint": "Room availability"
        })

        return {
            "status": "conflict",
            "allocations": {},
            "unallocated": [
                patient.id
                for patient in self.patients
            ],
            "explanations": {},
            "conflicts": self.conflicts,
            "search_log": self.search_log
        }


# Local testing
if __name__ == "__main__":

    patients = [
        Patient(
            id="P001",
            room_type="general",
            capacity_required=1,
            isolation_required=False
        ),
        Patient(
            id="P002",
            room_type="general",
            capacity_required=1,
            isolation_required=False
        ),
        Patient(
            id="P003",
            room_type="general",
            capacity_required=1,
            isolation_required=False
        )
    ]

    rooms = [
        Room(
            id="R101",
            room_type="general",
            capacity=1
        ),
        Room(
            id="R102",
            room_type="general",
            capacity=1
        )
    ]

    allocator = CSPAllocator(
        patients,
        rooms
    )

    result = allocator.solve()

    print("\nStatus:")
    print(result["status"])

    print("\nAllocations:")
    print(result["allocations"])

    print("\nUnallocated:")
    print(result["unallocated"])

    print("\nExplanations:")
    print(result["explanations"])

    print("\nConflicts:")
    print(result["conflicts"])

    print("\nSearch log:")

    for event in result["search_log"]:
        print(event)