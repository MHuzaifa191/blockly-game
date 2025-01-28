// blocks.js - Clean version
if (typeof Blockly === 'undefined') {
    throw new Error('Blockly has not been loaded!');
}

// Enable async/await support
Blockly.JavaScript.STATEMENT_PREFIX = 'await ';

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

javascript.javascriptGenerator.forBlock['my_block'] = function() {

    // TODO: Assemble javascript into the code variable.
    const code = '1234';
    return code;
  }

// JavaScript Generators
Blockly.JavaScript['my_block'] = function(block) {
    return [Blockly.JavaScript.ORDER_FUNCTION_CALL];
};
