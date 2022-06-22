/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class FirearmTransaction {

    // transaction data
    @Property()
    public transactionType: string;
    @Property()
    public transactionStatus: string;
    @Property()
    public transactionState: string;
    @Property()
    public transactionDateTime: string;
    @Property()
    public digitalSignature: string;

    // transaction source and destination information
    @Property()
    public sourceName: string;
    @Property()
    public sourceType: "distributor" | "manufacturer" | "customer" | "government";
    @Property()
    public destinationName: string | null;
    @Property()
    public destinationType: "distributor" | "manufacturer" | "customer" | "government";
    @Property()
    public backgroundVerificationStatus: string;
    @Property()
    public dealerLicense: boolean | null;

    // firearm details
    @Property()
    public serialNumber: string;
    @Property()
    public currentOwner: string;
    @Property()
    public productType: "new" | "pre-owned";
    @Property()
    public manufacturer: string;
    @Property()
    public model: string;
    @Property()
    public ammoType: string;
    @Property()
    public productRFIDToken: string;

}
