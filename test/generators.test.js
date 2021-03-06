'use strict';

const assert = require('assert');
const path = require('path');
const helpers = require('yeoman-generator').test;
const exec = require('child_process').exec;


describe('generator-feathers', () => {
  let appDir;

  function runTest(expectedText, done) {
    let child = exec('npm test', { cwd: appDir });
    let buffer = '';

    child.stdout.on('data', function(data) {
      buffer += data;
    });

    child.on('exit', function (status) {
      assert.equal(status, 0, 'Got correct exit status');
      assert.ok(buffer.indexOf(expectedText) !== -1,
        'Ran test with text: ' + expectedText);
      done();
    });
  }

  it('feathers:app', done => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => appDir = dir)
      .withPrompts({
        name: 'myapp',
        providers: ['rest', 'socketio'],
        cors: 'enabled',
        database: 'memory',
        authentication: []
      })
      .withOptions({
        skipInstall: false
      })
      .on('end', () =>
        runTest('starts and shows the index page', done)
      );
  });

  it('feathers:service', done => {
    helpers.run(path.join(__dirname, '../generators/service'))
      .inTmpDir(() => process.chdir(appDir))
      .withPrompts({
        type: 'database',
        database: 'memory',
        name: 'messages'
      })
      .on('end', () =>
        runTest('registered the messages service', done)
      );
  });

  it('feathers:hook', done => {
    helpers.run(path.join(__dirname, '../generators/hook'))
      .inTmpDir(() => process.chdir(appDir))
      .withPrompts({
        type: 'before',
        service: 'messages',
        method: ['create', 'update', 'patch'],
        name: 'removeId'
      })
      .on('end', () =>
        runTest('hook can be used', done)
      );
  });
});
