import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Profile {
    username: string;
    balance: bigint;
    totalWon: bigint;
    phone: string;
}
export interface GameResult {
    game: string;
    user: Principal;
    timestamp: Time;
    amountWon: bigint;
}
export interface Transaction {
    description: string;
    timestamp: Time;
    balanceAfter: bigint;
    amount: bigint;
}
export interface backendInterface {
    addCoins(amount: bigint): Promise<void>;
    getBalance(): Promise<bigint>;
    getRecentWins(): Promise<Array<GameResult>>;
    getTopPlayers(): Promise<Array<Profile>>;
    getTransactions(): Promise<Array<Transaction>>;
    register(username: string, phone: string): Promise<void>;
    requestDeposit(amount: bigint, contact: string): Promise<void>;
    submitGameResult(game: string, won: boolean, amount: bigint): Promise<bigint>;
}
