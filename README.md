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

### Testing strategy

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
