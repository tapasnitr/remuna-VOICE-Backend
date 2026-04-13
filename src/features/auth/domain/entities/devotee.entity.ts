export enum DevoteeStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export class Devotee {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public status: DevoteeStatus,
    public dob: Date,
    public createdAt: Date
  ) {}
}