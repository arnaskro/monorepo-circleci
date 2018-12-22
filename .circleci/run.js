const { readFileSync } = require("fs");
const { exec } = require("child_process");
const { CIRCLE_API_TOKEN = "", CIRCLE_PROJECT_USERNAME, CIRCLE_PROJECT_REPONAME, CIRCLE_BRANCH, CIRCLE_COMPARE_URL } = process.env;
const GIT_COMMAND = (project) => `git diff --no-commit-id --name-only | sort -u | uniq | grep ${project} > isModified`;

const readFileContent = fileName => {
  try {
    return readFileSync(fileName, "utf-8")
      .split("\n")
      .filter(Boolean);
  } catch (err) {
    console.error(err);
  }
};

const isModified = (project) => exec(GIT_COMMAND(project)) && readFileContent("isModified");

const launchADirectoryJob = directory => {
  exec(`curl -s -u ${CIRCLE_API_TOKEN} \
                -d build_parameters[CIRCLE_JOB]=${directory} \
                https://circleci.com/api/v1.1/project/github/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/tree/${CIRCLE_BRANCH}`);
};

const isInDirectoryRoot = allProjects => project => allProjects.includes(project);

;(() => {
  console.log(CIRCLE_COMPARE_URL)
  console.log(process.env)
  // const allProjects = readFileContent("./.circleci/projects.txt");
  // const modifiedProjects = allProjects.filter(isModified);
  // // .forEach(isInDirectoryRoot(allProjects))
  // exec('git diff --no-commit-id --name-only | sort -u | uniq > testing')
  // console.log(readFileContent('testing'))
  // console.log(modifiedProjects)






  // const directoriesToTriggerAJob = modifiedDirectories.filter(isInDirectoryRoot(directoriesOnRoot));
  // console.log("directoriesToTriggerAJob")
  // console.log(directoriesToTriggerAJob)
  // directoriesToTriggerAJob.forEach(launchADirectoryJob);
})();
