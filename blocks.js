// blocks.js - Clean version
if (typeof Blockly === 'undefined') {
    throw new Error('Blockly has not been loaded!');
}

let defaultDirection = 'Forward'; // To define the default direction for the character

// Enable async/await support
Blockly.JavaScript.STATEMENT_PREFIX = '';

// Custom Block Definition
const my_block = {
    init: function() {
        this.appendDummyInput()
            .appendField("Custom Action")
            .appendField(new Blockly.FieldDropdown([
                ["Get Length", "length"], 
                ["To Uppercase", "uppercase"]
            ]), "ACTION");
        
        this.setOutput(true, null);
        this.setColour(225);
        this.setTooltip('Perform a custom action');
        this.setHelpUrl('');
    }
};

Blockly.common.defineBlocks({my_block: my_block});

javascript.javascriptGenerator.forBlock['my_block'] = function(block) {
    // This generator is used by some Blockly internals
    const code = '1234';
    return code;
};

Blockly.JavaScript['my_block'] = function(block) {
    // This generator is used for actual code generation
    const action = block.getFieldValue('ACTION');
    const code = `await game.performCustomAction('${action}')`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


// MOVING IN DIRECTION BLOCK


const move_in_direction = {
    init: function() {
        this.appendDummyInput()
            .appendField('Move');
        
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        
        this.setColour(230);
        this.setTooltip('Move the character by a fixed distance');
        this.setHelpUrl('');
    }
};

javascript.javascriptGenerator.forBlock['move_in_direction'] = function(block) {
    const newDirection = defaultDirection;
    const code = `await game.move_${defaultDirection}(50);\n`;
    return code;
};

Blockly.JavaScript['move_in_direction'] = function(block) {
};

Blockly.common.defineBlocks({move_in_direction: move_in_direction});



// MOVING FORWARD BLOCK


const move_forward = {
    init: function() {
        this.appendDummyInput()
            .appendField('Move Forward');
        
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        
        this.setColour(230);
        this.setTooltip('Move the character forward by a fixed distance');
        this.setHelpUrl('');
    }
};

javascript.javascriptGenerator.forBlock['move_forward'] = function(block) {
    const code = `await game.move_forward(50);\n`;
    return code;
};

Blockly.JavaScript['move_forward'] = function(block) {
};

Blockly.common.defineBlocks({move_forward: move_forward});


// MOVE BACKWARD BLOCK

const move_backward = {
    init: function() {
        this.appendDummyInput()
            .appendField('Move Backward');
        
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        
        this.setColour(230);
        this.setTooltip('Move the character backward');
        this.setHelpUrl('');
    }
};

javascript.javascriptGenerator.forBlock['move_backward'] = function(block) {
    const code = `await game.move_backward(50);\n`;
    return code;
};

Blockly.JavaScript['move_backward'] = function(block) {
};

Blockly.common.defineBlocks({move_backward: move_backward});


// MOVE UPWARD BLOCK

const move_upward = {
    init: function() {
        this.appendDummyInput()
            .appendField('Move Upward');
        
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        
        this.setColour(230);
        this.setTooltip('Move the character upward');
        this.setHelpUrl('');
    }
};

javascript.javascriptGenerator.forBlock['move_upward'] = function(block) {
    const code = `await game.move_upward(50);\n`;
    return code;
};

Blockly.JavaScript['move_upward'] = function(block) {
};

Blockly.common.defineBlocks({move_upward: move_upward});


// MOVE DOWNWARD BLOCK

const move_downward = {
    init: function() {
        this.appendDummyInput()
            .appendField('Move Downward');
        
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        
        this.setColour(230);
        this.setTooltip('Move the character Downward');
        this.setHelpUrl('');
    }
};

javascript.javascriptGenerator.forBlock['move_downward'] = function(block) {
    const code = `await game.move_downward(50);\n`;
    return code;
};

Blockly.JavaScript['move_downward'] = function(block) {
};

Blockly.common.defineBlocks({move_downward: move_downward});


// FOR LOOP BLOCK

const loop_until_distance = {
    init: function() {
        this.appendDummyInput()
            .appendField('LOOP');
        

        this.appendDummyInput()
            .appendField('Distance <= ')// Label for the distance input
            .appendField(new Blockly.FieldTextInput('distance'), 'DISTANCE');


  
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        
        this.setColour(230);
        this.setTooltip('Move the character until a specified distance is reached');
        this.setHelpUrl('');
    }
};

javascript.javascriptGenerator.forBlock['loop_until_distance'] = function(block) {
    const distance = block.getFieldValue('DISTANCE');

    
    const code = `await game.moveInDirection(${distance}, '${defaultDirection}');\n`;
    return code;
};   
 

Blockly.JavaScript['loop_until_distance'] = function(block) {
};

Blockly.common.defineBlocks({loop_until_distance: loop_until_distance});



// WHILE LOOP BLOCK

const loop_until_obstacle = {
    init: function() {
        this.appendDummyInput()
            .appendField('Keep moving while');

        // Dropdown for obstacle selection
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Obstacle", "obstacle"],
            ]), "OBSTACLE");


        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        
        this.setColour(230);
        this.setTooltip('Loop until a specified obstacle is reached');
        this.setHelpUrl('');
    }
};

Blockly.JavaScript['loop_until_obstacle'] = function(block) {
};

javascript.javascriptGenerator.forBlock['loop_until_obstacle'] = function(block) {
    const obstacle = block.getFieldValue('OBSTACLE'); // Get the selected obstacle

    const code = `await game.moveUntilCollision('${defaultDirection}');\n`;
    return code;
};

Blockly.common.defineBlocks({loop_until_obstacle: loop_until_obstacle});


// CHANGE DIRECTION BLOCK



const change_direction = {
    init: function() {
        this.appendDummyInput()
            .appendField('Change direction to')
            .appendField(new Blockly.FieldDropdown([
                ["forward", "forward"],
                ["backward", "backward"],
                ["upward", "upward"],
                ["downward", "downward"]
            ]), "DIRECTION");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        
        this.setColour(210);
        this.setTooltip('Change the direction of movement');
        this.setHelpUrl('');
    }
};

Blockly.common.defineBlocks({change_direction: change_direction});

Blockly.JavaScript['change_direction'] = function(block) {
};

javascript.javascriptGenerator.forBlock['change_direction'] = function(block) {
    const direction = block.getFieldValue('DIRECTION'); // Get the selected direction
    defaultDirection = direction; 

    
    
    return `await game.move_${direction}(5);\n`;
};



// IF CONDITION BLOCK

const if_condition = {
    init: function() {
        this.appendDummyInput()
            .appendField('If there is');

        // Dropdown for shape selection
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Any Obstacle", "any obstacle"],
                ["Square", "square"],
                ["Circle", "circle"],
                ["Rectangle", "rectangle"]
            ]), "OBSTACLE");


        // Add a statement input for actions
        this.appendStatementInput('DO')
            .appendField('do');

        // Add a statement input for else actions
        this.appendStatementInput('ELSE')
        .appendField('else do');

        this.setPreviousStatement(true, null);
        
        this.setColour(210);
        this.setHelpUrl('');
    }
};


Blockly.JavaScript['if_condition'] = function(block) {
};

javascript.javascriptGenerator.forBlock['if_condition'] = function(block) {
    const direction = block.getFieldValue('DIRECTION'); // Get the selected direction
    this.defaultDirection = direction; 
    
    return "\n";
};

Blockly.common.defineBlocks({if_condition: if_condition});


// CHANGE COLOR BLOCK

const change_circle_color = {
    init: function() {
        this.appendDummyInput()
            .appendField('Change ball color to')
            .appendField(new Blockly.FieldDropdown([
                ["Red", "#FF0000"],
                ["Green", "#00FF00"],
                ["Blue", "#0000FF"],
                ["Yellow", "#FFFF00"]
            ]), 'COLOR'); // Predefined colors

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        
        this.setColour(210);
        this.setTooltip('Change the color of the ball');
        this.setHelpUrl('');
    }
};


Blockly.JavaScript['change_circle_color'] = function(block) {
};

javascript.javascriptGenerator.forBlock['change_circle_color'] = function(block) {
    const color = block.getFieldValue('COLOR'); // Get the selected color

    const code = `await game.changeBallColor('${color}');\n`; // Call the function to change the circle color
    return code;
};


Blockly.common.defineBlocks({change_circle_color: change_circle_color});