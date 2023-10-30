# Mikado method

## Miro

Link: https://miro.com/app/board/uXjVMkSYTDY=/?share_link_id=518210024492

## Run the app with the development env

First, install the project:

```bash
git clone git@github.com:arnolanglade/mikado-method.git
volta setup
pnpm setup
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run the app with the production env 

```bash
pnpm build
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Run tests

Run unit tests

```bash
pnpm test
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

## Supabase

Start supabase

```bash
npx supabase start
```

Resets the local database to current migrations

```bash
npx supabase db reset
```

Create an empty migration script

```bash
npx supabase migration new <migration name>
```
