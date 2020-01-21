/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    /*
     * initLedger(ctx)
     */
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const dns = [
            {
                firstName: 'Monique',
                familyName: 'Leyrac',
                sin: '960406361',
            },
            {
                firstName: 'Nicole',
                familyName: 'Martin',
                sin: '799288378',
            },
            {
                firstName: 'Leon',
                familyName: 'Redbone',
                sin: '360954739',
            },
        ];

        for (let i = 0; i < dns.length; i++) {
            dns[i].docType = 'dn';
            await ctx.stub.putState('DN' + i, Buffer.from(JSON.stringify(dns[i])));
            console.info('Added <--> ', dns[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    /*
     * queryDN(ctx, dnNumber)
     */
    async queryDN(ctx, dnNumber) {
        const dnAsBytes = await ctx.stub.getState(dnNumber); // get the car from chaincode state
        if (!dnAsBytes || dnAsBytes.length === 0) {
            throw new Error(`${dnNumber} does not exist`);
        }
        console.log(dnAsBytes.toString());
        return dnAsBytes.toString();
    }

    /*
     * createDN(ctx, dnNumber, firstName, familyName, sin)
     */
    async createDN(ctx, dnNumber, firstName, familyName, sin) {
        console.info('============= START : Create Death Notification ===========');

        const dn = {
            firstName,
            familyName,
            sin,
            docType: 'dn',
        };

        await ctx.stub.putState(dnNumber, Buffer.from(JSON.stringify(dn)));
        console.info('============= END : Create Deathh Notification ===========');
    }

    /*
     * queryAllDNs(ctx)
     */
    async queryAllDNs(ctx) {
        
	console.log('queryAllDNs');
        
	const startKey = 'DN0';
        const endKey = 'DN999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
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
/*
    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }
*/

}

module.exports = FabCar;

