module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [[
    "module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "blacklist": null,
      "whitelist": null,
      "safe": false,
      "allowUndefined": true
    }],
  ["transform-inline-environment-variables", {
    "include": [
      "NODE_ENV"
    ]
  }]
  ],
  env: {
    production: {
      plugins: ["transform-inline-environment-variables", "transform-remove-console"]
    }
  }
};