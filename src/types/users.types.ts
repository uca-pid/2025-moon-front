export interface User {
    id: number;
    fullName: string;
    email: string;
    workshopName?: string;
    address?: string;
    addressLatitude?: number;
    addressLongitude?: number;
}

export interface UpdateUser {
    fullName: string;
    workshopName?: string;
    address?: string;
    addressLatitude?: number;
    addressLongitude?: number;
}

export enum ReviewEnum {
    PENDING = "pending",
    BAD = "bad",
    GOOD = "good",
    EXCELLENT = "excellent",
}

export interface UserReviewResponse {
    mechanicId: number;
    userId: number;
    review: ReviewEnum;
    appointmentId: number;
}
