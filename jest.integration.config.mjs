import nextJest from 'next/jest.js'

const createJestConfig = nextJest({dir: './'})

const config = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/app/$1',
    },
    testEnvironment: 'node',
    setupFilesAfterEnv: [
        './test/integration.setup.ts'
    ],
    testMatch: [
        '**/*.integration.ts',
    ],
}

export default createJestConfig(config)
