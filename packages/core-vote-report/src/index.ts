import { Container } from "@phantomcores/core-interfaces";
import { defaults } from "./defaults";
import { startServer } from "./server";

export const plugin: Container.PluginDescriptor = {
    pkg: require("../package.json"),
    defaults,
    alias: "vote-report",
    async register(container: Container.IContainer, options) {
        return startServer(options);
    },
    async deregister(container: Container.IContainer, options) {
        return container.resolvePlugin("vote-report").stop();
    },
};
