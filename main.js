
// Declare workspace and game as global variables
let workspace;
let game;
let two;
let circle;



// Function to run the code
function runCode() {
    // Ensure workspace is defined before proceeding
    if (!workspace) {
        console.error('Blockly workspace not initialized');
        return;
    }

    // Check number of blocks
    const blocks = workspace.getAllBlocks(false);
    if (blocks.length === 0) {
        console.warn('No blocks in workspace');
        return;
    }    

    // Verify generators for all blocks
    const missingGenerators = blocks
        .filter(block => !Blockly.JavaScript[block.type])
        .map(block => block.type);

    if (missingGenerators.length > 0) {
        console.error('Missing JavaScript generators for blocks:', missingGenerators);
        return;
    }

    // Disable the run button while code is executing
    const runButton = document.querySelector('button');
    runButton.disabled = true;

    try {
        // Generate JavaScript code from Blockly workspace
        console.log('Available Blocks:', Object.keys(Blockly.Blocks));
        console.log('Available JavaScript Generators:', Object.keys(Blockly.JavaScript));
        
        // Detailed block and generator checking
        const workspaceBlocks = workspace.getAllBlocks(false);
        console.log('Workspace Blocks:', workspaceBlocks.map(block => block.type));
        
        let code;
        try {
            // Generate code wrapped in an async function
            code = `async function _runBlocklyCode() {\n${Blockly.JavaScript.workspaceToCode(workspace)}\n}\n_runBlocklyCode();`;
            console.log('Generated Code:', code);
        } catch (codeGenError) {
            console.error('Detailed Code Generation Error:', codeGenError);
            console.error('Error Details:', {
                name: codeGenError.name,
                message: codeGenError.message,
                stack: codeGenError.stack
            });
            throw codeGenError;
        }
        
        // Create wrapper functions for game controls
        const moveForward = async (distance) => {
            console.log(`Executing moveForward with distance: ${distance}`);
            await game.moveForward(distance);
        };
        const turnLeft = async (angle) => {
            console.log(`Executing turnLeft with angle: ${angle}`);
            await game.turnLeft(angle);
        };
        const turnRight = async (angle) => {
            console.log(`Executing turnRight with angle: ${angle}`);
            await game.turnRight(angle);
        };

        // Add string length as a wrapper function
        const stringLength = (text) => {
            console.log(`Calculating length of: "${text}"`);
            return game.getStringLength(text);
        };

        // Execute the code
        eval(code).catch(e => {
            console.error('Code execution error:', e);
            alert('There was an error running your code: ' + e.message);
        }).finally(() => {
            runButton.disabled = false;
        });
    } catch (e) {
        console.error('Code generation error:', e);
        console.error('Error Details:', {
            name: e.name,
            message: e.message,
            stack: e.stack
        });
        alert('There was an error generating your code: ' + e.message);
        runButton.disabled = false;
    }
}


// Listen for the iframe to be ready
window.addEventListener('message', (event) => {
    if (event.data.type === 'ready') {
        console.log("Two.js is ready in the iframe!");
        
        // Get the iframe element
        const iframe = document.getElementById('twoContainer');
        const iframeWindow = iframe.contentWindow;

        // Initialize Two.js and circle after receiving the ready message
        two = iframeWindow.getTwoInstance();
        circle = iframeWindow.getCircle();

        two.play();

        
        // Additional initialization or setup can be done here
        console.log("Two.js and circle initialized from iframe");


        if (!circle) {
            console.error('Circle is not defined. Make sure it is created in game.html.');
            return;
        }


        // Initialize game with the existing circle
        game = new Game(circle, two); // Pass the existing 
        game.drawObstacles();

    }
});

// Wait for the DOM to fully load
window.addEventListener('DOMContentLoaded', (event) => {

    // Initialize Blockly workspace
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: document.getElementById('toolbox'),
        scrollbars: true,
        trashcan: true,
        grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
        },
    });

    // Debugging: Check available blocks and generators
    console.log('Available Blocks:', Object.keys(Blockly.Blocks));
    console.log('Available Generators:', Object.keys(Blockly.JavaScript));




    

    // Add workspace change listener for auto-save
    workspace.addChangeListener(() => {
        // Save workspace to localStorage
        const xml = Blockly.Xml.workspaceToDom(workspace);
        const xmlText = Blockly.Xml.domToText(xml);
        localStorage.setItem('blocklyWorkspace', xmlText);
    });

    // Try to load previous workspace from localStorage
    const savedWorkspace = localStorage.getItem('blocklyWorkspace');
    if (savedWorkspace) {
        try {
            const xml = Blockly.utils.xml.textToDom(savedWorkspace);
            Blockly.Xml.domToWorkspace(xml, workspace);
        } catch (e) {
            console.error('Error loading saved workspace:', e);
            localStorage.removeItem('blocklyWorkspace');
        }
    }

    // Attach the runCode function to the button click
    const runButton = document.querySelector('button');
    runButton.addEventListener('click', runCode);
});