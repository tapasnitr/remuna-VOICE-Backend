import { AttendanceRepository, AttendanceLogWithUser } from '../../domain/repositories/AttendanceRepository.js';

export class GetAttendanceByGroupUseCase {
    constructor(
        private readonly attendanceRepository: AttendanceRepository
    ) { }

    async execute(groupId: number, date: Date): Promise<AttendanceLogWithUser[]> {
        return this.attendanceRepository.getByGroupAndDate(groupId, date);
    }
}
