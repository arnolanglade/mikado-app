import nextJest from 'next/jest.js'

const createJestConfig = nextJest({dir: './'})

/** @type {import('jest').Config} */
const config = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/app/$1',
    },
    testMatch: ['**/*.spec.(ts|tsx)'],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: [
        '<rootDir>/test/react-flow-mock.setup.ts',
        '@testing-library/jest-dom/extend-expect'
    ],
    setupFiles: [
        '<rootDir>/test/load-env-var.setup.ts'
    ]
}

export default createJestConfig(config)
