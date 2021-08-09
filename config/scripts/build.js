const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const jsxbin = require("jsxbin");
const webpack = require("webpack");
const ora = require("ora");
const { execSync } = require("child_process");
const pluginConfig = require("../../pluginrc");
const utils = require("./utils.js");
const env = utils.resolveEnv();
const isDev = env === "development";
const buildFolder = pluginConfig.destinationFolder;
const pluginFolder = path.join(buildFolder, pluginConfig.extensionBundleId);
const rootFolder = pluginConfig.root;
const templatesFolder = path.join(__dirname, "../assets/templates");



const startTime = Date.now();

const inBuildPath = (val) => {
  return path.join(pluginFolder, val);
};

const inRootDir = (val) => {
  return path.join(rootFolder, val);
};

console.log(chalk.hex("6bb9f0")(`BUILD - ${env.toUpperCase()}`));

build();

async function build() {
  try {
    let spinner = ora("Prepare build folder");
    spinner.start();

    if (!fs.existsSync(buildFolder)) {
      fs.mkdirSync(buildFolder);
    } else {
      fs.emptyDirSync(buildFolder);
      fs.mkdirSync(pluginFolder);
    }
    spinner.succeed();

    spinner = ora("Bundle client");
    var clientConfig = require("../webpack.client.js");
    await webpack(clientConfig, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    spinner.succeed();

    spinner = ora("Bundle server");
    var serverConfig = require("../webpack.server.js");
    await webpack(serverConfig, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    spinner.succeed();

    spinner = ora("Copying Hosts folder").start();
    fs.copySync(inRootDir("host"), inBuildPath("host"));
    spinner.succeed();

    spinner = ora("Convert jsx to jsxbin").start();
    await jsxbin(
      `${pluginFolder}/host/index.jsx`,
      `${pluginFolder}/host/index.jsxbin`
    ).catch((err) => {
      utils.log_error(err);
    });
    spinner.succeed();

    spinner = ora("Delete jsx code").start();
    fs.removeSync(`${pluginFolder}/host/index.jsx`);
    spinner.succeed();


    spinner = ora("Convert .jsxbin to .jsx").start();
    fs.renameSync(
      `${pluginFolder}/host/index.jsxbin`,
      `${pluginFolder}/host/index.jsx`
    );
    spinner.succeed();

    spinner = ora("Delete JSON.jx").start();
    fs.removeSync(`${pluginFolder}/host/JSON.jsx`);
    spinner.succeed();

    spinner = ora("Copying libs folder").start();
    fs.copySync(inRootDir("libs"), inBuildPath("libs"));
    spinner.succeed();

    spinner = ora("Copy index.html").start();
    fs.copySync(inRootDir("index.html"), inBuildPath("index.html"));
    spinner.succeed();

    spinner = ora("Copy adobe assets").start();
    fs.copySync(path.resolve(__dirname, "../assets/icons"), pluginFolder);
    spinner.succeed();

    spinner = ora("Render manifest.xml").start();
    const manifest_template = require(path.join(
      templatesFolder,
      "manifest.template.xml.js"
    ));
    const rendered_xml = manifest_template(pluginConfig);
    var xml_out_dir = path.join(pluginFolder, "CSXS");
    const xml_out_file = path.join(pluginFolder, "CSXS", "manifest.xml");
    fs.mkdirSync(xml_out_dir, { recursive: true }, (err) => {
      if (err) throw err;
    });
    fs.writeFileSync(xml_out_file, rendered_xml, "utf-8");
    spinner.succeed();

    if (isDev) {
      spinner = ora("Render .debug file").start();
      const debug_template = require(path.join(
        templatesFolder,
        ".debug.template.js"
      ));
      const rendered_debug = debug_template(pluginConfig);
      const debug_out_file = path.join(pluginFolder, ".debug");
      fs.writeFileSync(debug_out_file, rendered_debug, "utf-8");
      spinner.succeed();
    }
    const endTime = Date.now();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    console.log(chalk.hex("23D18B")(`Time: ${timeDiff}s`));
  } catch (err) {
    utils.log_error(err);
  }
}
