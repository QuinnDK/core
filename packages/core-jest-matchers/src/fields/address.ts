import { crypto } from "@phantomcores/crypto";

export {};

declare global {
    namespace jest {
        // tslint:disable-next-line:interface-name
        interface Matchers<R> {
            toBeAddress(): R;
        }
    }
}

expect.extend({
    toBeAddress: (received, argument) => {
        return {
            message: () => "Expected value to be a valid address",
            pass: crypto.validateAddress(received, argument),
        };
    },
});
