/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { FirearmTransaction } from './firearm-transaction';

@Info({title: 'FirearmTransactionContract', description: 'My Smart Contract' })
export class FirearmTransactionContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async firearmTransactionExists(ctx: Context, firearmTransactionId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(firearmTransactionId);
        return (!!data && data.length > 0);
    }

    @Transaction()
    public async createFirearmTransaction(
        ctx: Context,
        firearmTransactionId: string,
        transactionType: string,
        transactionStatus: string,
        transactionState: string,
        transactionDateTime: string,
        digitalSignature: string,
        sourceName: string,
        sourceType: "distributor" | "manufacturer" | "customer" | "government",
        destinationName: string | null,
        destinationType: "distributor" | "manufacturer" | "customer" | "government",
        backgroundVerificationStatus: string,
        dealerLicense: boolean | null,
        serialNumber: string,
        currentOwner: string,
        productType: "new" | "pre-owned",
        manufacturer: string,
        model: string,
        ammoType: string,
        productRFIDToken: string
    ): Promise<void> {
        const exists: boolean = await this.firearmTransactionExists(ctx, firearmTransactionId);
        if (exists) {
            throw new Error(`The firearm transaction ${firearmTransactionId} already exists`);
        }
        const firearmTransaction: FirearmTransaction = new FirearmTransaction();
        firearmTransaction.transactionType = transactionType;
        firearmTransaction.transactionStatus = transactionStatus;
        firearmTransaction.transactionState = transactionState;
        firearmTransaction.transactionDateTime = transactionDateTime;
        firearmTransaction.digitalSignature = digitalSignature;
        firearmTransaction.sourceName = sourceName;
        firearmTransaction.sourceType = sourceType;
        firearmTransaction.destinationName = destinationName;
        firearmTransaction.destinationType = destinationType;
        firearmTransaction.backgroundVerificationStatus = backgroundVerificationStatus;
        firearmTransaction.dealerLicense = dealerLicense;
        firearmTransaction.serialNumber = serialNumber;
        firearmTransaction.currentOwner = currentOwner;
        firearmTransaction.productType = productType;
        firearmTransaction.manufacturer = manufacturer;
        firearmTransaction.model = model;
        firearmTransaction.ammoType = ammoType;
        firearmTransaction.productRFIDToken = productRFIDToken;
        const buffer: Buffer = Buffer.from(JSON.stringify(firearmTransaction));
        await ctx.stub.putState(firearmTransactionId, buffer);
    }

    @Transaction(false)
    @Returns('FirearmTransaction')
    public async readFirearmTransaction(ctx: Context, firearmTransactionId: string): Promise<FirearmTransaction> {
        const exists: boolean = await this.firearmTransactionExists(ctx, firearmTransactionId);
        if (!exists) {
            throw new Error(`The firearm transaction ${firearmTransactionId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(firearmTransactionId);
        const firearmTransaction: FirearmTransaction = JSON.parse(data.toString()) as FirearmTransaction;
        return firearmTransaction;
    }

    @Transaction()
    public async updateFirearmTransaction(ctx: Context, firearmTransactionId: string, dataArray: any[]): Promise<void> {
        const exists: boolean = await this.firearmTransactionExists(ctx, firearmTransactionId);
        if (!exists) {
            throw new Error(`The firearm transaction ${firearmTransactionId} does not exist`);
        }
        const firearmTransaction: FirearmTransaction = new FirearmTransaction();
        // iterate through provided array of key/value pairs
        for (const data of dataArray) {
            for (const [key, value] of Object.entries(data)) {
                // since we don't know what data will be provided, loop through object,
                // grab key/value pairs, and assign to our FirearmTransaction object accordingly
                firearmTransaction[key] = value;
            }
        }
        const buffer: Buffer = Buffer.from(JSON.stringify(firearmTransaction));
        await ctx.stub.putState(firearmTransactionId, buffer);
    }

    @Transaction()
    public async deleteFirearmTransaction(ctx: Context, firearmTransactionId: string): Promise<void> {
        const exists: boolean = await this.firearmTransactionExists(ctx, firearmTransactionId);
        if (!exists) {
            throw new Error(`The firearm transaction ${firearmTransactionId} does not exist`);
        }
        await ctx.stub.deleteState(firearmTransactionId);
    }

    @Transaction(false)
    public async readAllFirearmTransactions(ctx: Context): Promise<string> {
        const startKey = '000';
        const endKey = '999';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());
                const Key = res.value.key;
                let Record: any;
                try {
                    Record = JSON.parse(res.value.value.toString());
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    @Transaction(false)
    public async readFirearmData(ctx: Context, serialNumber: string): Promise<boolean> {
        const exists: boolean = await this.readFirearmData(ctx, serialNumber);
        if (!exists) {
            throw new Error(`The firearm with serial number ${serialNumber} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(serialNumber);
        const firearmData: any = JSON.parse(data.toString()) as any;
        return firearmData;
    }

}
