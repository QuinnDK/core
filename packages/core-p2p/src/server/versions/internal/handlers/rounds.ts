import { app } from "@phantomcores/core-container";
import { Blockchain, Database } from "@phantomcores/core-interfaces";
import { slots } from "@phantomcores/crypto";

const config = app.getConfig();

/**
 * @type {Object}
 */
export const current = {
    /**
     * @param  {Hapi.Request} request
     * @param  {Hapi.Toolkit} h
     * @return {Hapi.Response}
     */
    async handler(request, h) {
        const databaseService = app.resolvePlugin<Database.IDatabaseService>("database");
        const blockchain = app.resolvePlugin<Blockchain.IBlockchain>("blockchain");

        const lastBlock = blockchain.getLastBlock();

        const height = lastBlock.data.height + 1;
        const maxActive = config.getMilestone(height).activeDelegates;
        const blockTime = config.getMilestone(height).blocktime;
        const reward = config.getMilestone(height).reward;
        const delegates = await databaseService.getActiveDelegates(height);
        const timestamp = slots.getTime();

        const currentForger = parseInt((timestamp / blockTime) as any) % maxActive;
        const nextForger = (parseInt((timestamp / blockTime) as any) + 1) % maxActive;

        return {
            data: {
                current: +(height / maxActive),
                reward,
                timestamp,
                delegates,
                currentForger: delegates[currentForger],
                nextForger: delegates[nextForger],
                lastBlock: lastBlock.data,
                canForge: parseInt((1 + lastBlock.data.timestamp / blockTime) as any) * blockTime < timestamp - 1,
            },
        };
    },
};
