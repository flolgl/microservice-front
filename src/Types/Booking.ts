export interface Booking {
    id: number,
    tenantId: number,
    houseId: number,
    startDate: string,
    endDate: string,
    isConfirmed: boolean
}