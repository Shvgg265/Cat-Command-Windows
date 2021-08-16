#!/usr/bin/env node

let fs = require("fs")
let cmd = process.argv.slice(2);
(function() {
    let options = [];
    let files = [];
    let str = "";

    for (let x in cmd) {
        if (cmd[x].startsWith("-") && cmd[x].length == 2) {
            options.push(cmd[x]);
        } else {
            files.push(cmd[x]);
            if (!fs.existsSync(cmd[x])) {
                console.log(cmd[x] + " does not exist");
                return;
            }
        }
    }

    // for (x in files) {
    //     if (!fs.existsSync(files[x])) {
    //         console.log(files[x] + " does not exist");
    //         return;
    //     }
    // }

    if (files.length <= 0) {
        console.log("No file entered")
        return;
    }

    for (x in files) {
        str += fs.readFileSync(files[x]).toString();
    }
    str = str.split("\n");

    if (options.includes("-s")) {
        str = removeLargeSpace(str);
    }

    if (options.includes("-n") && options.includes("-b")) {
        // if both are present
        // -n and -b are mutually exclusive i.e. if -n is run -b won't, and if -b runs -n won't
        // we run the one that appears first
        if (options.indexOf("-b") > options.indexOf("-n")) {
            // -n appears first, we run -n
            str = addNum(str);
        } else {
            // -b appears first, we run -b
            str = addNonEmptyNum(str);
        }
    } else {
        // if either one or none are present
        if (options.includes("-b")) {
            // -b runs
            str = addNonEmptyNum(str)
        }
        if (options.includes("-n")) {
            // -n runs
            str = addNum(str)
        }
    }

    str = str.join("\n");

    console.log(str);
    // console.log(options);
    // console.log(files);
})();

function removeLargeSpace(arr) {
    let ans = []
    for (let i = 0; i < arr.length; i++) {
        let prev = arr[i]
        let curr = arr[i + 1]
        if ((prev == "" && curr == "") || (prev == "\r" && curr == "\r")) {
        } else {
            ans.push(arr[i]);
        }
    }
    return ans;
}

// -n
function addNum(arr) {
    // will add numbers to all elements of array
    let nArr = []
    for (x in arr) {
        let t = Number(x) + 1
        nArr[x] = t + " " + arr[x];
        t += 1;
    }
    return nArr
}

// -b
function addNonEmptyNum(arr) {
    // will add numbers to all non empty elements of array
    let nArr = []
    let lineNumber = 1
    for (x in arr) {
        if (arr[x] == "\r" || arr[x] == "") {
            nArr[x] = arr[x]
        } else {
            nArr[x] = lineNumber + " " + arr[x];
            lineNumber += 1;
        }
    }
    return nArr
}