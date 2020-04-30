

<h1 align="center">
  <img src="/public/res/img/labAuth_logo_1000x1000.png" width="250"/>
  <br>
  LabAuth
</h1>

## Contribute

The frontend / client is referred as app. The backend as server.

### Development env

#### Develop app

The source of the app can be found in `/app` and the serviceWorker's in `/serviceWorker`.

```
 $ npm run devApp
```

Builds the app on save & spins up a live (notifies client to reload on change) repl server, whose source can be found in `/replServer/src`.

#### Develop server

Source found in `/server/src`.

```
 $ npm run devServer
```

Builds the server & replApp on save. The source of the replApp can be found under `/replApp`. No live reloading available, since its the prod server.

#### Develop server & app

```
 $ npm run dev
```

Watches production server & app and builds them on save. No live reloading avalible, since its the prod server.

### Deploy

#### Build scripts

Build everything for production

```
 $ npm run build
```

#### Start

Start the server with default options

```
 $ npm start
```

Since this is a [npm-run-script](https://docs.npmjs.com/cli/run-script), cli options must be escaped in order to distinguish them from npm options. Simply prefix all options with **one** `--` like so: 

```
 $ npm start --  --port 1234 --outageReciliance strong
```

##### CLI options

Here is a list of all recognised cli options:



| **Option**                                            | **Description**                                              | **Default** |
| :---------------------------------------------------- | ------------------------------------------------------------ | ----------- |
| -- port: `number`                                     | Port on which the Server should be served on                 | 443         |
| -- authKeyForRegistration: `string`                   | Authentication key sent with each call to the attendance registration Server. | N/A         |
| -- outageReciliance: `"strong" \| "onDemand" \| "weak"` | - **strong**: Store all student entries into local Database<br /> - **onDemand**: Only store student entries when connection to remote auth server fails<br />- **weak**: Never ever store student entries locally, all entries registered when unable to connect to remote are lost forever | strong      |
| -- securityLevel: `"paranoid" \| "casual"`             | - **paranoid**: Store as little data as possible on clients, destroys offline support<br />- **casual**: Store hashed cardIDs on clients for offline registration. | casual      |
| -- salt: `string`                                     | Salt for session keys                                        | generated   |

