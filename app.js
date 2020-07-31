const fs = require("fs");
const readline = require("readline");
const cp = require("child_process");

readline.emitKeypressEvents(process.stdin);
console.clear();
process.stdin.setRawMode(true);

const defaultLocation = "D:\\Unity";

let folders = fs.readdirSync(defaultLocation)
    .filter(i => i != "Unity Hub 2.0");
let projectPaths = []

for(const folder of folders) {
    addProject(__dirname + "\\..\\" + folder);
}

function addProject(projectPath) {
    let isProject = require("fs").existsSync(projectPath + "\\Assets");
    if(isProject) {
        projectPaths.push(projectPath);
    } else {
        for(const folder of fs.readdirSync(projectPath)) {
            addProject(projectPath + "\\" + folder);
        }
    }
}

let projectNames = projectPaths
    .map(i => i.substring((__dirname + "\\..\\").length))
    .map(i => i.replace("\\", "/"));

let projects = [];

for(let i = 0; i < projectPaths.length; i ++) {
    projects.push({ name: projectNames[i], path: projectPaths[i] });
}

let index = 0;
function displayProjects() {
    console.clear();

    for(let i = 0; i < projects.length; i ++) {
        let line = "";
        
        if(i == index) {
            line += "[x]";
        } else {
            line += "[ ]";
        }

        line += projects[i].name;

        console.log(line);
    }
}

displayProjects();

process.stdin.on("keypress", function(str, key) {
    if(key.name == "up") {
        index = Math.max(index - 1, 0);

        displayProjects();
    }
    if(key.name == "down") {
        index = Math.min(index + 1, projects.length - 1);

        displayProjects();
    }
    if(key.name == "return") {
        cp.exec("\"C:\\Program Files\\Unity\\Hub\\Editor\\2019.4.4f1\\Editor\\Unity.Exe\" -projectPath \"" + projects[index].path + "\"");
    }

    if(key.name == "c" && key.ctrl == true) process.exit(0);
});