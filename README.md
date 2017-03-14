## Notes

In project I used momentjs library to work with dates.</br></br>
Since I was not sure about best equivalent of struct in TypeScript I used Risk as a type.

## Possible Improvements
1. In real project I would write wrapper over momentjs library, since its syntax sometimes could be confusing.
2. RiskTracker do its job, but there should be better solution.
3. Premium calculation process should be encapsulated.
4. I am looking to improve my object-oriented design skills, for last time I was more focused on functional/reactive paradigm.
5. Minor, but in real project using Yarn over just npm would be good idea to simplify development/build process.

## Installation

To install dependencies:

```npm install```

To make build:

Webpack should be installed globally

```npm install webpack -g```

```webpack --config dev-webpack.config.js```

## Tests

To run tests:

Karma should be installed globally

```npm install karma -g```

```npm test```
