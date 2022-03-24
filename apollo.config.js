// https://github.com/apollographql/apollo-tooling/issues/812
module.exports = {
    client: {
        service: {
            name: 'testnet',
            url: 'https://bsx-api-testnet.hydration.cloud/graphql',
            localSchemaFile: 'src/schema.graphql',
            includes: ['src/**/*.ts{,x}']
        },
        excludes: ['**/**.test.tsx', '**/**.test.ts', 'src/schema.graphql', 'src/graphql.schema.json']
    }
}