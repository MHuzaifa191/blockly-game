// blocks.js - Clean version
if (typeof Blockly === 'undefined') {
    throw new Error('Blockly has not been loaded!');
}

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
    const code = `await moveForward(50);\n`;
    return code;
};

Blockly.JavaScript['move_forward'] = function(block) {
};

Blockly.common.defineBlocks({move_forward: move_forward});