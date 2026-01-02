export interface FamilyImage {
    url: string;
    publickey?: string;
}

export interface Family {
    _id: string;
    familyName: string;
    img: FamilyImage;
    createdAt?: string;
    updatedAt?: string;
}

export interface FamilyResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: Family[];
}
