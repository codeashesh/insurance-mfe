const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

const POLICY_DASHBOARD_URL =
  process.env.POLICY_DASHBOARD_URL || (isProduction ? "https://insurance-mfe-policy.web.app" : "http://localhost:3001");
const PREMIUM_PAYMENT_URL =
  process.env.PREMIUM_PAYMENT_URL || (isProduction ? "https://insurance-mfe-payment.web.app" : "http://localhost:3002");

module.exports = {
  entry: "./src/index.js",
  mode: isProduction ? "production" : "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: "auto",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: { api: "modern" },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        policyDashboard: `policyDashboard@${POLICY_DASHBOARD_URL}/remoteEntry.js`,
        premiumPayment: `premiumPayment@${PREMIUM_PAYMENT_URL}/remoteEntry.js`,
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: "^18.2.0" },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: "^18.2.0",
        },
        "react-router-dom": {
          singleton: true,
          eager: true,
          requiredVersion: "^6.20.0",
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
