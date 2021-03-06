import { sortBy } from "@phantomcores/utils";
import isEqual from "lodash/isEqual";

export {};

declare global {
    namespace jest {
        // tslint:disable-next-line:interface-name
        interface Matchers<R> {
            toBeWallet(): R;
        }
    }
}

expect.extend({
    toBeWallet: actual => {
        return {
            message: () => "Expected value to be a valid wallet",
            pass: isEqual(sortBy(Object.keys(actual)), ["address", "publicKey"]),
        };
    },
});
