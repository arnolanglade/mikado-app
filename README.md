# Mikado method

This project is built on top of [NEXT.js](https://nextjs.org), which is a framework for React applications.
It also uses [Supabase](https://supabase.com)  as a database, providing an open-source alternative to Firebase.

Here is the [online demo](https://mikado-method-teal.vercel.app/)

## Requirements

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

## Getting Started

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

```bash
tree -L 1 .
├── app # contains the application code (frontend and backend)
│   ├── api # only contains the backend API
│   └── tools # contains tools (frontend and backend)
│       ├── ...
│       └── api # only contains the backend tools
├── supabase # contains Supabase migrations and local config
├── test # contains test utilities like factories, mocks, etc.
└── ...
```

## I18n

The project uses [react-intl](https://formatjs.io/docs/react-intl/) to handle translations.

### Add a translation

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

For more complex needs, you can pass variables to the translation. Add a placeholder in the translation key between `{}` like `{name}`. 

```ts
const translations: Translations = {
    myTranslationKey: 'Hello, {name}'
};
```
Then, you can use the `values` property of the `Translation` component to replace the placeholder.

```jsx
<Translation id="myTranslationKey" values={{name: 'Arnaud'}} />
```

It also works with the `useIntl` hook, use the second parameter to pass the values.

```ts
const translation = useIntl();
translation('myTranslationKey', {name: 'Arnaud'})
```

## Testing

### How to run tests

Run unit tests

```bash
pnpm unit
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

This function has two arguments, the first lets you override services and the second lets you override translations. 
The goal of overriding services is to easily replace them by test double to ease the testing. 
The goal of overriding translations is to make the test more resilient. It prevents the test from breaking if you change the translation.

### Override a service

The `aServiceContainer` function creates a service container with all the services of the app. It accepts an object as a parameter. 
The keys of the object are the services to override and the values are the new services.

```ts
const myService = jest.fn();

render(
    <MyComponent>,
    { wrapper: createWrapper(aServiceContainer({myService})) },
);

expect(myService).toBeCalled();
```

Note: Override a service is useful to replace a service by a test double, a fake or a mock for instance. 
I wrote a [blog post](https://arnolanglade.github.io/ease-testing-thanks-to-the-dependency-inversion-design-pattern.html) that implement the dependency inversion design pattern to ease testing.

### Override a translation

The `createWrapper` function accepts as a second parameter an object of translations that will override the default translations.

```ts
render(
    <MyComponent>,
    {wrapper: createWrapper(aServiceContainer(), {myTranslationKey: 'Validate'})},
);

fireEvent.press(screen.getByText('Validate'));
```
Note: Override a translation make the test more resilient even if you change the translation the test will still be green.

### Tests utilities

In the `test-utils.ts` file, you can find some useful functions to ease testing like factories. 
They will help you to create objects like`MikadoGraphView` or `MikadoGraph` without providing all the properties. 
It also centralizes the creation of objects that will help you to refactor your tests more easily.

```ts
aMikadoGraph({
    mikadoGraphId: uuidv4(),
    goal: 'My goal',
});
```

Note: I wrote a [blog post](https://arnolanglade.github.io/increase-your-test-quality-thanks-to-builders-or-factories.html) that explains how to use factories or builder to ease testing.


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
