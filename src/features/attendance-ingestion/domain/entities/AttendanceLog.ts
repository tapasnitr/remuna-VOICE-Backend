export class AttendanceLog {
    private constructor(
        public readonly id: string,
        public readonly agentId: string,
        public readonly userId: string,
        public readonly timestamp: Date,
        public readonly status: string,
        public readonly deviceId: string | null,
        public readonly biometricDeviceId: string | null,
        public readonly createdAt: Date
    ) { }

    static create(params: {
        agentId: string;
        userId: string;
        timestamp: Date;
        status: string;
        deviceId: string | null;
        biometricDeviceId: string | null;
    }): AttendanceLog {
        return new AttendanceLog(
            '', // Placeholder, will be ignored if not saving with ID
            params.agentId,
            params.userId,
            params.timestamp,
            params.status,
            params.deviceId,
            params.biometricDeviceId,
            new Date()
        );
    }

    static fromPersistence(data: {
        id: string;
        agentId: string;
        userId: string;
        timestamp: Date;
        status: string;
        deviceId: string | null;
        biometricDeviceId: string | null;
        createdAt: Date;
    }): AttendanceLog {
        return new AttendanceLog(
            data.id,
            data.agentId,
            data.userId,
            data.timestamp,
            data.status,
            data.deviceId,
            data.biometricDeviceId,
            data.createdAt
        );
    }
}
