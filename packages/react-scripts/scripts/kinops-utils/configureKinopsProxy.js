/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const clearConsole = require('react-dev-utils/clearConsole');
const isInteractive = process.stdout.isTTY;

// Takes the port so that this can easily be chained with the other async
// function in start.js so we don't disrupt that file too much.
function configureKinopsProxy(configFile) {
  return function(port) {
    return new Promise(resolve => {
      try {
        const config = JSON.parse(fs.readFileSync(configFile));
        resolve({
          kineticWebserver: config.kineticWebserver,
          bundleName: config.bundleName,
          port: port,
        });
      } catch (error) {
        if (isInteractive) {
          clearConsole();
          console.log(
            chalk.yellow(
              'It looks like you have not configured this React app to ' +
                'connect to kinops yet.'
            )
          );
          console.log(
            chalk.yellow(
              'Answer the following questions to complete the configuration. ' +
                'The results are stored in config.js, for further modification.'
            )
          );
          console.log('\n');
          const questions = [
            {
              type: 'input',
              name: 'kineticWebserver',
              message:
                'Enter the URL of the Kinetic Request CE server the React ' +
                'app will connect to',
              default: 'https://kinops.io',
            },
            {
              type: 'input',
              name: 'bundleName',
              message:
                'Enter the bundle name, which should match the bundle name ' +
                'assigned to the corresponding kapp.',
            },
          ];
          inquirer.prompt(questions).then(answers => {
            if (answers.kineticWebserver && answers.bundleName) {
              const config = {
                kineticWebserver: answers.kineticWebserver,
                bundleName: answers.bundleName,
              };
              fs.writeFileSync(
                configFile,
                JSON.stringify(config),
                undefined,
                2
              );
              config.port = port;
              resolve(config);
            } else {
              resolve(null);
            }
          });
        } else {
          console.log(
            chalk.red(
              'The config.json file is required to run this React app. Run ' +
                'this command again in an interactive terminal to complete ' +
                'the configuration process.'
            )
          );
          resolve(null);
        }
      }
    });
  };
}

module.exports = configureKinopsProxy;
