var path = require('path');

  // Use this file as a starting point for your project's .eslintrc.
// Copy this file, and add rule overrides as needed.
module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "settings": {
        "import/resolver": {
            "node": {
                "paths": [path.resolve(__dirname, './src')],
                "extensions": ['.js', '.json']
            }
        }
    },
	"rules": {
        "import/extensions": ["error", { "packages": "always" }],
		"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
		"react/prefer-stateless-function": 0,
        "max-len": "off",
        "jsx-a11y/label-has-for": "off",
        "react/no-array-index-key": "off"
	},
	"globals": {
		"window": true,
		"document": true,
        "WebSocket": true,
        "OraSocketGlobal": true
	}
};