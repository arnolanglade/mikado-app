# Mikado App

## What is the Mikado Method?

The Mikado method takes its name from the Mikado game, where the goal is to remove one stick without disturbing the others. The Mikado method has the same philosophy. It aims to make small incremental improvements to a project without breaking the existing codebase.

Have a look at my blog post about the [mikado method](https://arnolanglade.github.io/mikado-method.html)

## Try the MikadoApp

Try the Mikado App online [here](https://mikado-method-teal.vercel.app) . For now, I am only using the Vercel free plan, meaning the application may be slow.

## How to use the MikadoApp

The functional documentation is available [here](https://arnolanglade.github.io/mikado-app/).

## Getting Started

This project is built on top of [NEXT.js](https://nextjs.org), which is a framework for React applications.
It also uses [Supabase](https://supabase.com)  as a database, providing an open-source alternative to Firebase.

### Requirements

Before installing the project, you need to install Supabase CLI:

```bash
# Install supabase CLI
npx install -g supabase
# Start supabase
npx supabase start
```

[volta](https://volta.sh/) is a JavaScript Tool Manager. To install it, please run the following command:

```bash
curl https://get.volta.sh | bash
```

### Run the app with the development env

Then, you need to clone and install the project:

```bash
git clone git@github.com:arnolanglade/mikado-method.git
# Setup the node version for the project
volta setup
# Install git hooks to prevent pushing code with errors
pnpm setup
# Install the project dependencies
pnpm install
```

Finally, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run the app with the production env 

```bash
# Build the app
pnpm build
# Start the app with the production env
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Going further

### Understand how the project is organized

The frontend and the backend are in the same repository. The Next.js convention enforce the following structure:

```bash
tree -L 1 .
├── app # contains the application code (frontend and backend)
│   ├── api # only contains the backend API
└── ...
```

The application code is in the app folder. Next.js uses the folder structure to create the routes. Add a page.tsx file in the app/folder1/folder2 folder, and you will have a route /folder1/folder2. The backend works the same way; add a route.ts file in the app/api/folder1/folder2 folder, and you will have a route /api/folder1/folder2.

There is another folder in the app directory called tools, which is not part of the Next.js convention. It contains tools used by both the frontend (located at the root of the folder) and the backend (in the tools/api folder)."

```bash
tree -L 1 .
├── app # contains the application code (frontend and backend)
│   └── tools # contains tools (frontend and backend)
│       ├── ...
│       └── api # only contains the backend tools
```

The frontend and the backend are in the same repository. The Next.js convention enforces the following structure:

```bash
tree -L 1 .
├── supabase 
│   ├── ...
│   └── migrations
├── test
└── ...
```

`supabase` folder contains the Supabase migrations and the local configuration, while `test` folder contains test utilities like factories, mocks, etc.

## Tools

### I18n

The project uses [react-intl](https://formatjs.io/docs/react-intl/) to handle translations.

#### Add a translation

First, you need to add a new translation key in translation files (en.ts or fr.ts)

```ts
// app/tools/i18n/translation/(en|fr).ts
const translations: Translations = {
    myTranslationKey: 'translation...'
};
```

Then, there is two ways to get a translation, either with a hook or with a component.

From the `useIntl` hook:

```jsx
function MyComponent() {
    const {translation} = useIntl()
    
    return <Typography>{translation('myTranslationKey')}</Typography>
}
```

From the `<Translation />` component:

```jsx
function MyComponent() {
    const translation = useIntl()
    
    return <Typography><Translation id="myTranslationKey" /></Typography>
}
```

#### Add value to translations

For more complex needs, you can pass variables to the translation. Add a placeholder in the translation key between `{}` like `{name}`. 

```ts
const translations: Translations = {
    myTranslationKey: 'Hello, {name}'
};
```

#### Get the translation with a component or a hook

Then, you can use the `values` property of the `Translation` component to replace the placeholder.

```jsx
<Translation id="myTranslationKey" values={{name: 'Arnaud'}} />
```

It also works with the `useIntl` hook, use the second parameter to pass the values.

```ts
const translation = useIntl();
translation('myTranslationKey', {name: 'Arnaud'})
```

### Service container

#### Add a service to the service container

First, you need to update the service container type to add your service:

```ts
// app/tools/service-container-context.tsx
export type ServiceContainer = {
  myService: (id: string) => string
};
```

Then, you need to add your service to the service container:

```ts
// app/tools/service-container-context.tsx
import myServiceInstance from 'path/service/module'

export const container: ServiceContainer = {
    myService: myServiceInstance
};
```

`myService` is the name of your service, use it to get the service from the service container.

#### Get the service from the service container

Use the `useServiceContainer` hook to get the service container:

```tsx
const { myService } = useServiceContainer();
```

## Testing

### How to run tests

Run unit tests (frontend and backend)

```bash
pnpm unit
```

Run integration tests (backend only)

```bash
pnpm integration
```

Run linting tool

```bash
pnpm lint
```

Check typescript issues

```bash
pnpm tsc
```

Run all tests

```bash
pnpm tests
```

### How to write tests

The `createWrapper` function creates a REACT component that initializes all the app's providers. The function must only be used for testing purposes.

```tsx
render(
    <MyComponent>,
    { wrapper: createWrapper(aServiceContainer(), { myTranslationKey: 'translation...' }) },
);
```

This function takes two arguments: the first allows you to override services, and the second allows you to override translations. The purpose of overriding services is to easily replace them with test doubles, making testing more manageable. Overriding translations aims to enhance test resilience by preventing test failures when translations are modified.

### Override a service

The `aServiceContainer` function creates a service container containing all the app's services. It accepts an object as a parameter, where the keys represent the services to be overridden, and the values indicate the new services.

```ts
const myService = jest.fn();

render(
    <MyComponent>,
    { wrapper: createWrapper(aServiceContainer({myService})) },
);

expect(myService).toBeCalled();
```

Note: Overriding a service is useful when you need to replace a service with a test double, fake, or mock, for instance. I have written a [blog post](https://arnolanglade.github.io/ease-testing-thanks-to-the-dependency-inversion-design-pattern.html) that explain how the Dependency Inversion design pattern simplify testing.

### Override a translation

The `createWrapper` function accepts as a second parameter an object of translations that will override the default translations.

```ts
render(
    <MyComponent>,
    {wrapper: createWrapper(aServiceContainer(), {myTranslationKey: 'Validate'})},
);

fireEvent.press(screen.getByText('Validate'));
```
Note: Overriding a translation makes the test more resilient, even if you change the translation, the test will still pass (be green). Learn how to prevent test suite breaks caused by translation changes in my [blog post](https://arnolanglade.github.io/test-strategy-i18n-react-application.html)

### Tests utilities

In the `test-utils.ts` file, you can find some useful functions for simplifying testing, such as factories. They will assist you in creating objects like `MikadoGraphView` or `MikadoGraph` without the need to specify all the properties. This file also centralizes the object creation process, making it easier to refactor your tests.
```ts
aMikadoGraph({
    mikadoGraphId: uuidv4(),
    goal: 'My goal',
});
```

Note: I wrote a [blog post](https://arnolanglade.github.io/increase-your-test-quality-thanks-to-builders-or-factories.html) that explains how to use factories or builders to ease testing.


### Database

Start supabase

```bash
npx supabase start
```

Resets the local database to current migrations

```bash
npx supabase db reset
```

Add a new migration

```bash
npx supabase migration new <migration name>
npx supabase gen types typescript --local > app/tools/api/supabase/generated-type.ts
npx supabase db reset
```
