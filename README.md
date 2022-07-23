# @atia/raf

A basic implementation for react-admin data and auth provider using latest versions

## Installation

Use the [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) to install @atia/raf.

`npm i @atia/raf`
`yarn add @atia/raf`
`pnpm add @atia/raf`

## Usage

```javascript
import { Admin } from "react-admin";
import { configureApp } from "@atia/raf";

const appConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// pass configs and optional options object as second paramater
// used for changing some default behaviours
const { getAuthProvider, getDataProvider } = configureApp(appConfig);

// pass empty object for default react admin methods
// or you can override the default
const dataProvider = getDataProvider({});
const authProvider = getAuthProvider({});

<Admin
  dataProvider={dataProvider}
  authProvider={authProvider}
  // ...
>
  // resources go here...
</Admin>;
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[![GitHub](https://img.shields.io/github/license/deva7md/atia-raf)](https://github.com/devA7md/atia-raf/blob/main/LICENSE)
