# Create typescript project

Select an template type, answere simple setup questions, start working!

> Please not that Create typescript project is currently under development and not yet suited for production

## Get started

Install ctp globally

```
$ npm i ctp -g
```

Read through the supported template [list](#Templates) and select one. `cd` to your project directory. Execute it like so (module is your selected template)

```
$ ctp module
```

You can also specify a destination

```
$ ctp module --destination ./your-dir
```

## Templates

As of now there is only the `module` template. A detailed table follows.

## API 

### Programmatical interface

When installed locally, ctp can be executed via the default method it exports. 

```js
import ctp from "ctp"

ctp(/*projectKind:*/ "module",/*options:*/ {destination: "./your-dir", name: "your-project"})
.then(() => {
  console.log("Done!")
})
```

By default, encountered errors get thrown when using the programmatical interface. This can be disabled by calling `wrapErrors(true)` in order to have CLI like error reports.

```js
import ctp, {wrapErrors} from "ctp"

wrapErrors(true)

//ctp(...)
```


### CLI

All inqueried options can be given as command line arguaments as well. Only two options (namely `verbose` and `destination`) will not be inqueried if not given. Those have the defaults `verbose: true` and `destination: [current dir]`.

## Contribute

All feedback is appreciated. Write an issue or add a template by creating a pull request.
