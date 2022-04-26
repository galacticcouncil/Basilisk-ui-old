module.exports = {
    client: {
        service: {
            name: 'testnet',
            url: 'https://bsx-api-testnet.hydration.cloud/graphql',
            excludes: ['**/**.test.tsx', '**/**.test.ts']
        }
    }
}