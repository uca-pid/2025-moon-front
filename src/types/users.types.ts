export interface User {
    id: number;
    fullName: string;
    email: string;
    workshopName?: string;
    address?: string;
    addressLatitude?: number;
    addressLongitude?: number;
    reviews?: ReviewEnum[];
    subCategories?: SubCategroriesEnum[];
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

export enum SubCategroriesEnum {
    PUNCTUALITY = 'punctuality',
    QUALITY = 'quality',
    PRICE = 'price',
    ATTITUDE = 'attitude',
    CLARITY = 'clarity',
}

export interface UserReviewResponse {
    mechanicId: number;
    userId: number;
    review: ReviewEnum;
    appointmentId: number;
    subCategories?: SubCategroriesEnum[] | null;
}
