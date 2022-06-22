/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { FirearmTransactionContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
//import winston = require('winston');
import * as winston from 'winston';

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('FirearmTransactionContract', () => {

    let contract: FirearmTransactionContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new FirearmTransactionContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"transactionType":"firearm transaction 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"transactionType":"firearm transaction 1002 value"}'));
    });

    describe('#firearmTransactionExists', () => {

        it('should return true for a firearm transaction', async () => {
            await contract.firearmTransactionExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a firearm transaction that does not exist', async () => {
            await contract.firearmTransactionExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createFirearmTransaction', () => {

        it('should create a firearm transaction', async () => {
            await contract.createFirearmTransaction(
                ctx,
                '1003',
                'sale',
                'complete',
                'Illinois',
                '10/23/20',
                'xk2e98324jhf',
                'Macs Gun Shop',
                'distributor',
                'John Tortorella',
                'customer',
                'verified',
                true,
                'a040506',
                'John Tortorella',
                'new',
                'Winston',
                'AR-55',
                '.22',
                'XHDFNSYE2342'
            );
            ctx.stub.putState.should.have.been.calledOnceWithExactly(
                '1003',
                Buffer.from('{"transactionType":"sale", "transactionStatus":"complete", "transactionState":"Illinois", "transactionDateTime":"10/23/20", "digitalSignature":"xk2e98324jhf", "sourceName":"Macs Gun Shop", "sourceType":"distributor", "destinationName":"John Tortorella", "destinationType":"customer", "backgroundVerificationStatus":"verified", "dealerLicense":true, "serialNumber":"a040506", "currentOwner":"John Tortorella", "productType":"new", "manufacturer":"Winston", "model":"AR-55", "ammoType":".22", "productRFIDToken":"XHDFNSYE2342"}'));
        });

        it('should throw an error for a firearm transaction that already exists', async () => {
            await contract.createFirearmTransaction(
                ctx,
                '1001',
                'sale',
                'complete',
                'Illinois',
                '10/23/20',
                'xk2e98324jhf',
                'Macs Gun Shop',
                'distributor',
                'John Tortorella',
                'customer',
                'verified',
                true,
                'a040506',
                'John Tortorella',
                'new',
                'Winston',
                'AR-55',
                '.22',
                'XHDFNSYE2342'
            ).should.be.rejectedWith(/The firearm transaction 1001 already exists/);
        });

    });

    describe('#readFirearmTransaction', () => {

        it('should return a firearm transaction', async () => {
            await contract.readFirearmTransaction(ctx, '1001').should.eventually.deep.equal({ value: 'firearm transaction 1001 value' });
        });

        it('should throw an error for a firearm transaction that does not exist', async () => {
            await contract.readFirearmTransaction(ctx, '1003').should.be.rejectedWith(/The firearm transaction 1003 does not exist/);
        });

    });

    // describe('#updateFirearmTransaction', () => {

    //     it('should update a firearm transaction', async () => {
    //         await contract.updateFirearmTransaction(ctx, '1001', 'firearm transaction 1001 new value');
    //         ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"transactionType":"firearm transaction 1001 new value"}'));
    //     });

    //     it('should throw an error for a firearm transaction that does not exist', async () => {
    //         await contract.updateFirearmTransaction(ctx, '1003', 'firearm transaction 1003 new value').should.be.rejectedWith(/The firearm transaction 1003 does not exist/);
    //     });

    // });

    describe('#deleteFirearmTransaction', () => {

        it('should delete a firearm transaction', async () => {
            await contract.deleteFirearmTransaction(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a firearm transaction that does not exist', async () => {
            await contract.deleteFirearmTransaction(ctx, '1003').should.be.rejectedWith(/The firearm transaction 1003 does not exist/);
        });

    });

});
