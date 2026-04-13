export class Branch {
    private constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly name: string,
        public readonly address: string | null,
        public readonly isActive: boolean,
        public readonly createdAt: Date
    ) { }

    static create(params: {
        orgId: string;
        name: string;
        address: string | null;
        isActive?: boolean;
    }): Branch {
        return new Branch(
            '', // Placeholder persistence ID
            params.orgId,
            params.name,
            params.address,
            params.isActive ?? true,
            new Date()
        );
    }

    static fromPersistence(data: {
        id: string;
        orgId: string;
        name: string;
        address: string | null;
        isActive: boolean;
        createdAt: Date;
    }): Branch {
        return new Branch(
            data.id,
            data.orgId,
            data.name,
            data.address,
            data.isActive,
            data.createdAt
        );
    }
}
