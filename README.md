# Turbo Boilerplate

## Typescript + React + Remix + Prisma

Comes with user authentication included

- [React](https://github.com/facebook/react)
- [Prisma](https://www.prisma.io)
- [Remix](https://remix.run)
- TypeScript
- Postgres
- Tailwind
- ESLint
- Prettier
- Sendgrid

& many more tasty treats

## Get Started

**Must have node and postgres installed and setup locally**

1. `npm i`
2. `createdb boilerplate`
3. `npm run db:migrate`

Make sure you have created a .env file in the api package with the right values, you can use .env.example as the template

## Development

`npm run build`
then
`npm run dev`

## Production

### Mailers

- Create a Sendgrid account and set a SENDGRID_API_KEY environment variable in .env
- Create templates for each email you want to send and use the templateId in the corresponding mailer class

### Deployment

We are using Fly.io

### Extra info

- [Remix Docs](https://remix.run/docs)
