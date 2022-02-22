const slsw = require("serverless-webpack")

module.exports = {
	entry: slsw.lib.entries,
	target: "node",
	mode: slsw.lib.webpack.isLocal ? "development" : "production",
	optimization: {
		minimize: slsw.lib.webpack.isLocal ? false : true
	}
}