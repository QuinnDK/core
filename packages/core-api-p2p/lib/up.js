'use strict';

const logger = require('@arkecosystem/core-plugin-manager').get('logger')
const Hapi = require('hapi')

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = class Up {
  /**
   * [constructor description]
   * @param  {[type]} p2p    [description]
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  constructor (p2p, config) {
    this.p2p = p2p
    this.config = config
  }

  /**
   * [start description]
   * @return {[type]} [description]
   */
  async start () {
    this.server = new Hapi.Server({ port: this.config.port })
    this.server.app.p2p = this.p2p

    await this.server.register({
      plugin: require('./plugins/accept-request')
    })

    await this.server.register({
      plugin: require('./plugins/set-headers')
    })

    await this.server.register({
      plugin: require('./versions/internal'),
      routes: { prefix: '/internal' }
    })

    if (this.config.remoteinterface) {
      await this.server.register({
        plugin: require('./versions/remote'),
        routes: { prefix: '/remote' }
      })
    }

    await this.server.register({ plugin: require('./versions/1') })

    try {
      await this.server.start()

      logger.info(`Oh hapi day! P2P API is listening on ${this.server.info.uri}`)
    } catch (err) {
      logger.error(err)

      process.exit(1)
    }
  }

  /**
   * [stop description]
   * @return {[type]} [description]
   */
  stop () {
    return this.server.stop()
  }
}