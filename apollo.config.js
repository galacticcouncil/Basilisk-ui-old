module.exports = {
  client: {
    service: {
      name: 'testnet',
      url: 'https://squid.subsquid.io/basilisk-lbp-develop/v/2/graphql',
      excludes: ['**/**.test.tsx', '**/**.test.ts']
    }
  }
}
