import nextJest from 'next/jest.js'

const createJestConfig = nextJest({dir: './'})

/** @type {import('jest').Config} */
const config = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/app/$1',
    },
    testEnvironment: 'jest-environment-jsdom', // Todo: should be node for api tests
    setupFilesAfterEnv: [
        '<rootDir>/test/unit.setup.ts',
    ],
    testMatch: [
        '**/*.spec.(ts|tsx)',
    ],
}

export default createJestConfig(config)
