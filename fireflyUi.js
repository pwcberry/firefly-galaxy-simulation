var viewPanel
var starArray = new Array()
var controlKit
porthole.connected = function() {
    {{py print "started porthole connected function"}}
    controlKit = new ControlKit();
    controlKit.addPanel({label: 'Star Group Settings' , fixed: false, width: 320});
    console.log(controlKit)
    viewPanel = controlKit._panels[0]
    console.log(viewPanel)
}

var numStarPanels = 0
// function addStarPanel(name) {
//     numStarPanels = numStarPanels + 1
//     {{py print "In star panel function"}}
//     console.log(obj.testArray)
//     obj.testArray.push("testtesttest")
//     viewPanel.addGroup({label: name})
//         .addSubGroup({label: 'Color Settings'})
//             .addSelect(obj, 'select', {label: 'Variable', onChange: function (index) {
//                 // obj.funcTarget = obj.funcs[index];
//             }})
//             .addSelect(obj, 'select', {label: 'Colors', onChange: function (index) {
//                 // obj.funcTarget = obj.funcs[index];
//             }})
//             .addRange(obj,'valueRange',{label : 'Range'})
//             .addCheckbox(obj, 'bool', {label: 'Log Scale'})
//         .addSubGroup({label: 'Filter Settings'})
//             .addSelect(obj, 'select', {label: 'Variable', onChange: function (index) {
//                 // obj.funcTarget = obj.funcs[index];
//             }})
//             .addCheckbox(obj, 'bool2', {label: 'Filter On'})
//             .addRange(obj,'valueRange',{label : 'Range:'})
//     {{py print "Now done"}}
// }

var currentColors = new Array()
var currentFilterSettings = new Array()
var currentColorSettings = new Array()
var currentVariableColor = new Array(10)
var currentVariableFilter = new Array(10)
var groupNames = new Array(10)
var refresh = false
var colorMapLabels = new Array(10)
var colorMapArray = new Array(10)
var variableArray = new Array(10)
var variableRanges = new Array(10)

function setColorMapArrays( cm, cml) {
    colorMapArray = cm
    colorMapLabels = cml
}
function setVariables( variables, ranges) {
    console.log("Variables Set")
    variableArray = variables
    variableRanges = ranges
}

function addStarPanel(name, variables, ranges ) {
    {{py print "In star panel function"}}
    console.log(variables)
    console.log(ranges)
    console.log(name)
    var obj = {
        colorRange : [0,1],
        filterRange : [-1,1],
        minVal : 0.2,
        maxVal : 0.8,
        filterOn: false,
        isLog: false,
        variables : variables,
        colors : colorMapLabels,
        xPos : 0,
        yPos : 0
    };
    starArray.push(obj)
    groupNames[numStarPanels] = name
    currentFilterSettings[numStarPanels] = new Array(10)
    currentFilterSettings[numStarPanels].fill(0)
    currentColorSettings[numStarPanels] = new Array(10)
    currentColorSettings[numStarPanels].fill(0)

    var currIndex = numStarPanels
    viewPanel.addGroup({label: name, enable: false})
        .addSubGroup({label: 'Color Settings', enable: false})
            .addSelect(starArray[numStarPanels], 'variables' , {label: 'Variable', onChange: function (index) {
                updateTables()
                currentVariableColor[currIndex] = index
                console.log(currentVariableColor[currIndex])
                if (currentColorSettings[currIndex][index] == 0) {
                    currentColorSettings[currIndex][index]= {
                        on : false,
                        min : ranges[index][0],
                        max : ranges[index][1]
                    }
                    starArray[currIndex].isLog = currentColorSettings[currIndex][index].on
                    starArray[currIndex].colorRange = [currentColorSettings[currIndex][index].min, currentColorSettings[currIndex][index].max]
                } else {
                    console.log(currentColorSettings[currIndex])
                    console.log('current Value', starArray[currIndex].isLog )
                    console.log('saved Value', currentColorSettings[currIndex][index].on)

                    console.log('new Value',starArray[currIndex].isLog )

                    starArray[currIndex].isLog = currentColorSettings[currIndex][index].on
                    starArray[currIndex].colorRange = [currentColorSettings[currIndex][index].min, currentColorSettings[currIndex][index].max]
                }
                controlKit.update();
                {{py setColorVariable("%starArray[currIndex].variables[index]%","%groupNames[currIndex]%")}}
            }})
            .addSelect(starArray[numStarPanels], 'colors', {label: 'Colors', onChange: function (index) {
                // currentColors[numStarPanels] = index
                // obj.funcTarget = obj.funcs[index];
                console.log('color map changed')
                {{py setColorMap("%colorMapArray[index]%","%groupNames[currIndex]%")}}
            }})
            .addRange(starArray[numStarPanels],'colorRange',{label : 'Range:'})
            .addCheckbox(starArray[numStarPanels], 'isLog', {label: 'Log Scale'})
        .addSubGroup({label: 'Filter Settings', enable: false})
            .addSelect(starArray[numStarPanels], 'variables', {label: 'Variable', onChange: function (index) {
                updateTables()
                currentVariableFilter[currIndex] = index
                if (currentFilterSettings[currIndex][index] == 0) {
                    console.log('new')
                    currentFilterSettings[currIndex][index]= {
                        on : false,
                        min : -1.0,
                        max : 1.0
                    }
                    starArray[currIndex].filterOn = currentFilterSettings[currIndex][index].on
                    starArray[currIndex].filterRange = [currentFilterSettings[currIndex][index].min, currentFilterSettings[currIndex][index].max]
                } else {
                    starArray[currIndex].filterOn = currentFilterSettings[currIndex][index].on
                    starArray[currIndex].filterRange = [currentFilterSettings[currIndex][index].min, currentFilterSettings[currIndex][index].max]
                    console.log(starArray[currIndex].filterOn)
                }
                // obj.funcTarget = obj.funcs[index];
                starArray[currIndex].filterRange = variableRanges[index]
                controlKit.update();
            }})
            .addCheckbox(starArray[numStarPanels], 'filterOn', {label: 'Filter On'})
            .addRange(starArray[numStarPanels],'filterRange',{label : 'Range:'})
        .addSubGroup({label: 'Information'})
            .addNumberOutput(starArray[numStarPanels], 'xPos', {label: 'Val 1:'})
            .addNumberOutput(starArray[numStarPanels], 'yPos', {label: 'Val 2:'})
    {{py print "Now done"}}
    numStarPanels = numStarPanels + 1
}
// controlKit.update();
function update(){
    for (var i = currentFilterSettings.length - 1; i >= 0; i--) {    
        {{py setColorRange(%starArray[i].filterRange[0]%, %starArray[i].filterRange[1]%,"%groupNames[i]%")}}
        for (var j = starArray[i].variables.length - 1; j >= 0; j--) {
            if (currentFilterSettings[i][j] && starArray[i].filterOn){
                {{py setFilter(%currentFilterSettings[i][j].min%,%currentFilterSettings[i][j].max%, %starArray[i].variables[j]%, "%groupNames[i]%")}}
            }
        }
        if (starArray[i].isLog  ){
            {{py setLogColor(True,"%groupNames[i]%")}}
        } else {
            {{py setLogColor(False,"%groupNames[i]%")}}
        }
    }
    requestAnimationFrame(update);
}
update()

function updateTables() {
    for (var i = currentFilterSettings.length - 1; i >= 0; i--) {
        // console.log(currentVariableColor)
        var j = currentVariableColor[i]
        console.log(j)
        console.log(currentFilterSettings[i][j])
        if (currentColorSettings[i][j]){
            currentColorSettings[i][j].on = starArray[i].isLog
            console.log('saving new value:', currentColorSettings[i][j].on )
            currentColorSettings[i][j].min = starArray[i].colorRange[0]
            currentColorSettings[i][j].max = starArray[i].colorRange[1]
        }
        j = currentVariableFilter[i]
        if (currentFilterSettings[i][j]) {

            currentFilterSettings[i][j].on = starArray[i].filterOn
            console.log("saving value", currentFilterSettings[i][j].on)
            currentFilterSettings[i][j].min = starArray[i].filterRange[0]
            currentFilterSettings[i][j].max = starArray[i].filterRange[1]
        }
        if (starArray[i].isLog) {
            {{py setLogColor("True",%i%)}}
        } else {
            {{py setLogColor("False",%i%)}}
        }
    }
} 
// function printSomething() {
//     console.log("something has printed")
//     {{py print "Yay this has finally worked!!"}}
// }