/* eslint-env node */
import dotenv from "dotenv";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import yargs from "yargs";

(function () {
  // Get the directory name and filename
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const envFilePath = path.join(currentDir, ".env");

  try {
    // Read the environment variables from .env file
    const envFile = fs.readFileSync(envFilePath);
    const envVariables = dotenv.parse(envFile);

    // Ensure required environment variables are present
    const requiredEnvVars = ["CLIENT_ID", "APP_API_BASE_URL"]; // Load from a config file for flexibility
    const sensitiveVars = ["HASH_SECRET_KEY", "CLIENT_SECRET"];
    for (const varName of requiredEnvVars) {
      if (!(varName in envVariables)) {
        handleError(`Required environment variable "${varName}" not found.`);
      }
    }
    // Validate sensitive vars are not logged
    sensitiveVars.forEach((varName) => {
      if (varName in envVariables && process.env.NODE_ENV !== "production") {
        console.warn(
          `Sensitive variable ${varName} detected in non-production env`
        );
      }
    });

    // Read the command line arguments
    const argv = yargs(process.argv).argv;
    const {
      templateFileName,
      outConfigPath,
      configFileName = "config.json",
    } = argv;

    // Validate and construct file paths
    if (!templateFileName || !outConfigPath) {
      handleError(`Missing required command line arguments.`);
    }

    const templateFilePath = path.join(currentDir, templateFileName);
    const outConfigFilePath = path.join(outConfigPath, configFileName);
    const currentConfigFilePath = path.join(currentDir, configFileName);

    // Check if template file exists
    if (!fs.existsSync(templateFilePath)) {
      handleError(`Template file "${templateFileName}" does not exist.`);
    }

    // Read the template file
    const templateData = fs.readFileSync(templateFilePath, "utf-8");

    // Replace the placeholders with environment variables

    const substitutedData = templateData.replace(
      /\$(\w+)/g,
      (_, key) => envVariables[key] || ""
    );

    // Write the substituted data to config.json
    try {
      fs.writeFileSync(currentConfigFilePath, substitutedData, "utf-8");
      // eslint-disable-next-line no-console
      console.log("Configuration file written in current directory."); // NOSONAR

      // Ensure output directory exists
      const outputDir = path.dirname(outConfigFilePath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created missing directory: ${outputDir}`); // NOSONAR
      }

      // Copy config.json to the output directory
      fs.copyFileSync(currentConfigFilePath, outConfigFilePath);
      console.log("Configuration file copied to output directory."); // NOSONAR
    } catch (writeError) {
      handleError(`Error writing config file: ${writeError.message}`);
    }
  } catch (error) {
    handleError(`An error occurred: ${error.message}`);
  }

  function handleError(message) {
    console.error(message); // NOSONAR
    process.exit(1);
  }
})();
