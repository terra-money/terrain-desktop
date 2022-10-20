[![GitHub Super-Linter](https://github.com/terra-money/terrarium/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

# Terrarium

Terrarium is a complementary UI tool for Terra development with [LocalTerra](https://github.com/terra-money/LocalTerra/), a locally run Terra testnet. Terrarium requires Docker.

Use Terraium to:

- Query and exectute imported contracts
- Start, stop and modify LocalTerra
- Track block and transaction events
- Track and manage LocalTerra test accounts

## Terrarium & Terrain

It's strongly recommended to use Terrarium with [Terrain](https://github.com/terra-money/terrain), a development enviornment and scaffolding tool for dapps. You can import your terrain project contract references directly into Terrarium to access and call contract methods.

## Settings

The following settings can be found in the settings modal.

- LiteMode is enabled by default for performance issues. Disable LiteMode if you would like to run the FCD and postgres database. This is useful if youd like transaction data to persist between sessions.
- Block time is set to 5 seconds by default. You can reduce this parameter down to 200ms.
- Run Terrarium at startup. This is disabled be default.

## Local Development

To start the local development environment, execute the following command in your terminal.

```
npm run electron-dev
```
