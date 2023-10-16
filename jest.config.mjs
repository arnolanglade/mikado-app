import nextJest from 'next/jest.js'

const createJestConfig = nextJest({dir: './'})

/** @type {import('jest').Config} */
const config = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/app/$1',
    },
}

export default createJestConfig(config)
