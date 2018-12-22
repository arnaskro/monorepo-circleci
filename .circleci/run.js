const { readFileSync } = require("fs");
const { exec } = require("child_process");
const { CIRCLE_API_USER_TOKEN = "" } = process.env;
const GIT_COMMAND =
  'git diff --no-commit-id --name-only -r `git log -n 2 --oneline --pretty=format:"%h" | tail -n1` | cut -d/ -f1 | sort -u >  modifiedProjects';

const readFileContent = fileName => {
  try {
    return readFileSync(fileName, "utf-8")
      .split("\n")
      .filter(Boolean);
  } catch (err) {
    console.error(err);
  }
};

const launchADirectoryJob = directory => {
  console.log(directory)
  console.log(CIRCLE_API_USER_TOKEN)
  exec(`curl -s -u ${CIRCLE_API_USER_TOKEN} \
                -d build_parameters[CIRCLE_JOB]=${directory} \
                https://circleci.com/api/v1.1/project/github/devtoni/sample-monorepo-circleci/tree/master`);
};

const isInDirectoryRoot = directoriesOnRoot => directory =>
  directoriesOnRoot.includes(directory);

;(() => {
  exec(GIT_COMMAND);
  const modifiedDirectories = readFileContent("modifiedProjects");
  const directoriesOnRoot = readFileContent("./.circleci/projects.json");
  const directoriesToTriggerAJob = modifiedDirectories.filter(isInDirectoryRoot(directoriesOnRoot));
  console.log('modifiedDirectories')
  console.log(modifiedDirectories)
  console.log("directoriesToTriggerAJob")
  console.log(directoriesToTriggerAJob)
  directoriesToTriggerAJob.forEach(launchADirectoryJob);
})();
