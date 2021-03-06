import { app } from "@phantomcores/core-container";
import { Blockchain } from "@phantomcores/core-interfaces";
import { Bignum } from "@phantomcores/crypto";

const BignumMod = Bignum.clone({ DECIMAL_PLACES: 2 });

/**
 * Calculate the approval for the given delegate.
 * @param  {Delegate} delegate
 * @param  {Number} height
 * @return {Number} Approval, with 2 decimals
 */
function calculateApproval(delegate, height: any = null) {
    const config = app.getConfig();

    if (!height) {
        height = app.resolvePlugin<Blockchain.IBlockchain>("blockchain").getLastBlock().data.height;
    }

    const constants = config.getMilestone(height);
    const totalSupply = new BignumMod(config.get("genesisBlock.totalAmount")).plus(
        (height - constants.height) * constants.reward,
    );
    const voteBalance = new BignumMod(delegate.voteBalance);

    return +voteBalance
        .times(100)
        .dividedBy(totalSupply)
        .toFixed(2);
}

/**
 * Calculate the productivity of the given delegate.
 * @param  {Delegate} delegate
 * @return {Number} Productivity, with 2 decimals
 */
function calculateProductivity(delegate) {
    const missedBlocks = +delegate.missedBlocks;
    const producedBlocks = +delegate.producedBlocks;

    if (!missedBlocks && !producedBlocks) {
        return +(0).toFixed(2);
    }

    return +(100 - missedBlocks / ((producedBlocks + missedBlocks) / 100)).toFixed(2);
}

export { calculateApproval, calculateProductivity };
