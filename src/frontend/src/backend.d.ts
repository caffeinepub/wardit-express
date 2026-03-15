import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type MenuId = bigint;
export type UserId = Principal;
export interface MenuItem {
    id: MenuId;
    categoryName: string;
    name: string;
    isAvailable: boolean;
    vendorId: VendorId;
    rating: number;
    isVeg: boolean;
    price: number;
    prepTimeMinutes: bigint;
}
export interface User {
    id: UserId;
    referralCode: string;
    isBNPLEnabled: boolean;
    name: string;
    pnrHistory: Array<string>;
    phone: Phone;
    walletCredits: number;
    isVerifiedTraveler: boolean;
    seatNumber: string;
    coachNumber: string;
}
export type Phone = string;
export interface Vendor {
    id: VendorId;
    name: string;
    isActive: boolean;
    gateEntry: string;
    platformNumber: string;
}
export type VendorId = bigint;
export interface OrderType {
    id: OrderId;
    status: string;
    paymentMethod: string;
    trainNumber: string;
    userId: Principal;
    createdAt: bigint;
    totalAmount: number;
    vendorId: VendorId;
    discount: number;
    ecoPackaging: boolean;
    items: Array<{
        quantity: bigint;
        price: number;
        menuItemId: string;
    }>;
    seatNumber: string;
    subtotal: number;
    coachNumber: string;
    platformNumber: string;
}
export type OrderId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCredits(amount: number): Promise<void>;
    addMenuItem(name: string, vendorId: VendorId, categoryName: string, price: number, isVeg: boolean, prepTimeMinutes: bigint): Promise<MenuId>;
    addVendor(name: string, platformNumber: string, gateEntry: string): Promise<VendorId>;
    applyReferral(referralCode: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelOrder(orderId: OrderId): Promise<void>;
    deductCredits(amount: number): Promise<void>;
    getAllOrders(): Promise<Array<OrderType>>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: OrderId): Promise<OrderType>;
    getOrdersByUser(userId: UserId): Promise<Array<OrderType>>;
    getOrdersByVendor(vendorId: VendorId): Promise<Array<OrderType>>;
    getPNRHistory(): Promise<Array<string>>;
    getUser(user: UserId): Promise<User>;
    isCallerAdmin(): Promise<boolean>;
    listMenuItems(): Promise<Array<MenuItem>>;
    listMenuItemsByCategory(category: string): Promise<Array<MenuItem>>;
    listVendors(): Promise<Array<Vendor>>;
    placeOrder(userId: UserId, vendorId: VendorId, items: Array<{
        quantity: bigint;
        price: number;
        menuItemId: string;
    }>, paymentMethod: string, coachNumber: string, seatNumber: string, platformNumber: string, trainNumber: string, ecoPackaging: boolean): Promise<OrderId>;
    registerUser(name: string, phone: Phone): Promise<void>;
    storePNR(pnr: string): Promise<void>;
    toggleItemAvailability(id: MenuId): Promise<void>;
    updateMenuItem(id: MenuId, name: string, vendorId: VendorId, categoryName: string, price: number, isVeg: boolean, prepTimeMinutes: bigint, isAvailable: boolean): Promise<void>;
    updateOrderStatus(orderId: OrderId, newStatus: string): Promise<void>;
    updateProfile(coachNumber: string, seatNumber: string): Promise<void>;
    updateVendor(id: VendorId, name: string, platformNumber: string, gateEntry: string, isActive: boolean): Promise<void>;
}
