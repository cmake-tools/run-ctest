const exec = require('@actions/exec')
const compare_version = require('compare-versions')
const parser = require('action-input-parser')
/*const core = require('@actions/core');

const which = require('which')

const io = require('@actions/io');
const path = require('path')
const {DefaultArtifactClient} = require('@actions/artifact')
const github = require('@actions/github');

const semver = require('semver')
const os = require("node:os");*/

async function getCTestVersion()
{
  let cout ='';
  let cerr='';
  const options = {};
  options.listeners = {
    stdout: (data) => {
      cout = data.toString();
    },
    stderr: (data) => {
      cerr = data.toString();
    }
  }
  options.silent = true
  await exec.exec('ctest', ['--version'], options)
  let version_number = cout.match(/\d\.\d[\\.\d]+/)
  if (version_number.length === 0) throw String('Failing to parse CTest version')
  else return version_number[0]
}

function CTestVersionGreaterEqual(version)
{
  return compare_version.compare(global.cmake_version, version, '>=')
}

class CommandLineMaker
{
  constructor()
  {
    this.actual_path=path.resolve('./')
  }
}

function configure(command_line_maker)
{
  let cout ='';
  let cerr='';
  const options = {};
  options.listeners = {
    stdout: (data) => {
      cout = data.toString();
    },
    stderr: (data) => {
      cerr = data.toString();
    } 
  }
  options.silent = false
  options.cwd = command_line_maker.workingDirectory()
  exec.exec('cmake',command_line_maker.configureCommandParameters(), options)
}

async function main()
{
  try
  {
    let found = which.sync('ctest', { nothrow: true })
    if(!found) throw String('not found: CTest')
    global.cmake_version= await getCTestVersion()
    const command_line_maker = new CommandLineMaker()
    if(mode==='configure')
    {
      configure(command_line_maker)
    }
    else if(mode==='build')
    {
      build(command_line_maker)
    }
    else if(mode==='install')
    {
      install(command_line_maker)
    }
    else if(mode==='all')
    {
      configure(command_line_maker)
      build(command_line_maker)
      install(command_line_maker)
    }
  }
  catch (error)
  {
    core.setFailed(error)
  }
}

main()
