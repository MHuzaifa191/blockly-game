class Game {
    constructor(circle, two) {
        this.circle = circle; // Use the existing circle passed in
        this.currentAngle = 0; // Angle in degrees
        this.isAnimating = false; // Animation state
        this.two = two;

        this.obstacles = [
            { type: 'rectangle', x: 200, y: 150, width: 50, height: 100 }, // Example rectangle
            { type: 'triangle', x: 600, y: 300, size: 50 }, // Example triangle
            { type: 'square', x: 300, y: 400, size: 70 },
            { type: 'rectangle', x: 100, y: 350, width: 80, height: 60, color: 'red' }, // Narrow rectangle
            { type: 'triangle', x: 450, y: 500, size: 70, color: 'purple' }, // Larger triangle
            { type: 'square', x: 550, y: 100, size: 90, color: 'blue' }, // Large square
            { type: 'winning-point', x: 700, y: 200, size: 100, color: 'gold' }, // New winning point obstacle
            // Add more obstacles as needed
        ];
    }



    init() {
        // Create character (a triangle for now)
        const size = 20;
        this.character = this.two.makePolygon(
            this.two.width / 2,
            this.two.height / 2,
            size,
            3
        );
        
        // Style the character
        this.character.fill = '#4CAF50';
        this.character.stroke = '#45a049';
        this.character.linewidth = 2;


        this.drawObstacles();

        // Add grid for reference (optional)
        this.drawGrid();
        
        // Initial render
        this.two.update();
    }

    // Function to check for collisions between the circle and obstacles
    checkCollision(circle, obstacles) {
        const circleRadius = circle.radius;
        const circleX = circle.translation.x;
        const circleY = circle.translation.y;

        const buffer = 0;

        for (let obstacle of obstacles) {
            let collision = false;

            // Existing collision detection logic for different obstacle types
            if (obstacle.type === 'rectangle') {
                collision = (
                    circleX + circleRadius > obstacle.x &&
                    circleX - circleRadius < obstacle.x + obstacle.width &&
                    circleY + circleRadius > obstacle.y &&
                    circleY - circleRadius < obstacle.y + obstacle.height
                );
            } else if (obstacle.type === 'triangle') {
                // Triangle collision logic (simplified)
                const dx = Math.abs(circleX - obstacle.x);
                const dy = Math.abs(circleY - obstacle.y);
                collision = (dx * dx + dy * dy) < (obstacle.size + circleRadius) * (obstacle.size + circleRadius);
            } else if (obstacle.type === 'square') {
                const tolerance = 20;
                collision = (
                    circleX + circleRadius - tolerance > obstacle.x &&
                    circleX - circleRadius + tolerance < obstacle.x + obstacle.size &&
                    circleY + circleRadius - tolerance > obstacle.y &&
                    circleY - circleRadius + tolerance < obstacle.y + obstacle.size
                );
            } else if (obstacle.type === 'winning-point') {
                // Precise winning point collision
                const tolerance = 5; // Small tolerance for reaching the point
                if (
                    Math.abs(circleX - obstacle.x) <= tolerance &&
                    Math.abs(circleY - obstacle.y) <= tolerance
                ) {
                    // Display win message
                    this.youWin();
                    return true; // Stop further collision checks
                }
            }

            if (collision) {
                return true;
            }
        }
        return false;
    }

    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            let shape;
            if (obstacle.type === 'rectangle') {
                shape = this.two.makeRectangle(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else if (obstacle.type === 'triangle') {
                shape = this.two.makePolygon(obstacle.x, obstacle.y, obstacle.size, 3); // 3 for triangle
            } else if (obstacle.type === 'square') {
                shape = this.two.makeRectangle(obstacle.x, obstacle.y, obstacle.size, obstacle.size); // Square
            } else if (obstacle.type === 'winning-point') {
                shape = this.two.makeCircle(obstacle.x, obstacle.y, obstacle.size / 2);
                shape.fill = obstacle.color;
            }

            // Set properties for the shape
            if (obstacle.type !== 'winning-point') {
                shape.fill = 'green'; // Color for obstacles
                shape.stroke = 'darkgreen';
                shape.linewidth = 2;
            }

            // Add the shape to the Two.js instance
            this.two.add(shape);
        });
    }

    drawGrid() {
        const gridSize = 50;
        const strokeColor = 'rgba(0,0,0,0.1)';

        // Draw vertical lines
        for (let x = 0; x <= this.two.width; x += gridSize) {
            const line = this.two.makeLine(x, 0, x, this.two.height);
            line.stroke = strokeColor;
        }

        // Draw horizontal lines
        for (let y = 0; y <= this.two.height; y += gridSize) {
            const line = this.two.makeLine(0, y, this.two.width, y);
            line.stroke = strokeColor;
        }
    }

    async move_forward(distance) {
        if (this.isAnimating) return;
        this.isAnimating = true;
    
        const angle = this.currentAngle * (Math.PI / 180);
        const targetX = this.circle.position.x + Math.cos(angle) * distance;
        const targetY = this.circle.position.y + Math.sin(angle) * distance;
    
        // Check for collision with obstacles
        const futureCircle = { translation: { x: targetX, y: targetY }, radius: this.circle.radius };
        if (this.checkCollision(futureCircle, this.obstacles)) {
            console.log('Collision detected! Cannot move forward.');
            this.isAnimating = false; // Reset animation state
            return; // Prevent movement
        }
    
        console.log(`Moving from (${this.circle.position.x}, ${this.circle.position.y}) to (${targetX}, ${targetY})`);
    
        // Animate movement
        return new Promise((resolve) => {
            const duration = 1000; // 1 second
            const startX = this.circle.position.x;
            const startY = this.circle.position.y;
            const startTime = Date.now();
    
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
    
                // Update circle position
                this.circle.position.x = startX + (targetX - startX) * progress;
                this.circle.position.y = startY + (targetY - startY) * progress;
    
                console.log(`Current position: (${this.circle.position.x}, ${this.circle.position.y})`);
    
                // Render the updated position
                this.two.update();
    
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isAnimating = false;
                    resolve();
                }
            };
    
            animate();
        });
    }

    async move_backward(distance) {
        if (this.isAnimating) return;
        this.isAnimating = true;
    
        const angle = this.currentAngle * (Math.PI / 180);
        const targetX = this.circle.position.x - Math.cos(angle) * distance; // Move backward
        const targetY = this.circle.position.y - Math.sin(angle) * distance; // Move backward
    
        // Check for collision with obstacles
        const futureCircle = { translation: { x: targetX, y: targetY }, radius: this.circle.radius };
        if (this.checkCollision(futureCircle, this.obstacles)) {
            console.log('Collision detected! Cannot move backward.');
            this.isAnimating = false; // Reset animation state
            return; // Prevent movement
        }
    
        console.log(`Moving backward from (${this.circle.position.x}, ${this.circle.position.y}) to (${targetX}, ${targetY})`);
    
        // Animate movement
        return new Promise((resolve) => {
            const duration = 1000; // 1 second
            const startX = this.circle.position.x;
            const startY = this.circle.position.y;
            const startTime = Date.now();
    
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
    
                // Update circle position
                this.circle.position.x = startX + (targetX - startX) * progress;
                this.circle.position.y = startY + (targetY - startY) * progress;
    
                console.log(`Current position: (${this.circle.position.x}, ${this.circle.position.y})`);
    
                // Render the updated position
                this.two.update();
    
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isAnimating = false;
                    resolve();
                }
            };
    
            animate();
        });
    }

    async move_upward(distance) {
        if (this.isAnimating) return;
        this.isAnimating = true;
    
        const targetX = this.circle.position.x; // X position remains the same
        const targetY = this.circle.position.y - distance; // Move upward
    
        // Check for collision with obstacles
        const futureCircle = { translation: { x: targetX, y: targetY }, radius: this.circle.radius };
        if (this.checkCollision(futureCircle, this.obstacles)) {
            console.log('Collision detected! Cannot move upward.');
            this.isAnimating = false; // Reset animation state
            return; // Prevent movement
        }
    
        console.log(`Moving upward from (${this.circle.position.x}, ${this.circle.position.y}) to (${targetX}, ${targetY})`);
    
        // Animate movement
        return new Promise((resolve) => {
            const duration = 1000; // 1 second
            const startX = this.circle.position.x;
            const startY = this.circle.position.y;
            const startTime = Date.now();
    
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
    
                // Update circle position
                this.circle.position.x = startX + (targetX - startX) * progress;
                this.circle.position.y = startY + (targetY - startY) * progress;
    
                console.log(`Current position: (${this.circle.position.x}, ${this.circle.position.y})`);
    
                // Render the updated position
                this.two.update();
    
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isAnimating = false;
                    resolve();
                }
            };
    
            animate();
        });
    }
    
    async move_downward(distance) {
        if (this.isAnimating) return;
        this.isAnimating = true;
    
        const targetX = this.circle.position.x; // X position remains the same
        const targetY = this.circle.position.y + distance; // Move downward
    
        // Check for collision with obstacles
        const futureCircle = { translation: { x: targetX, y: targetY }, radius: this.circle.radius };
        if (this.checkCollision(futureCircle, this.obstacles)) {
            console.log('Collision detected! Cannot move downward.');
            this.isAnimating = false; // Reset animation state
            return; // Prevent movement
        }
    
        console.log(`Moving downward from (${this.circle.position.x}, ${this.circle.position.y}) to (${targetX}, ${targetY})`);
    
        // Animate movement
        return new Promise((resolve) => {
            const duration = 1000; // 1 second
            const startX = this.circle.position.x;
            const startY = this.circle.position.y;
            const startTime = Date.now();
    
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
    
                // Update circle position
                this.circle.position.x = startX + (targetX - startX) * progress;
                this.circle.position.y = startY + (targetY - startY) * progress;
    
                // console.log(`Current position: (${this.circle.position.x}, ${this.circle.position.y})`);
    
                // Render the updated position
                this.two.update();
    
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isAnimating = false;
                    resolve();
                }
            };
    
            animate();
        });
    }

    async moveInDirection(distance, direction) {
        direction = direction.toLowerCase();
        switch (direction) {
            case 'forward':
                await this.move_forward(distance);
                break;
            case 'backward':
                await this.move_backward(distance);
                break;
            case 'upward':
                await this.move_upward(distance);
                break;
            case 'downward':
                await this.move_downward(distance);
                break;
            default:
                console.warn('Unknown direction:', direction);
                break;
        }
    }

    async moveUntilCollision(direction, stepDistance = 10) {
        while (true) {
            // Create a future position based on the current direction
            const futureCircle = { 
                translation: { 
                    x: this.circle.position.x, 
                    y: this.circle.position.y 
                }, 
                radius: this.circle.radius 
            };
            
            direction = direction.toLowerCase();
            // Update future position based on the direction
            switch (direction) {
                case 'forward':
                    futureCircle.translation.x += Math.cos(this.currentAngle * (Math.PI / 180)) * stepDistance;
                    futureCircle.translation.y += Math.sin(this.currentAngle * (Math.PI / 180)) * stepDistance;
                    break;
                case 'backward':
                    futureCircle.translation.x -= Math.cos(this.currentAngle * (Math.PI / 180)) * stepDistance;
                    futureCircle.translation.y -= Math.sin(this.currentAngle * (Math.PI / 180)) * stepDistance;
                    break;
                case 'upward':
                    futureCircle.translation.y -= stepDistance; // Move upward
                    break;
                case 'downward':
                    futureCircle.translation.y += stepDistance; // Move downward
                    break;
                default:
                    console.warn('Unknown direction:', direction);
                    return; // Exit if the direction is unknown
            }
    
            // Check if ball is out of grid boundaries
            if (futureCircle.translation.x < 0 || 
                futureCircle.translation.x > this.two.width || 
                futureCircle.translation.y < 0 || 
                futureCircle.translation.y > this.two.height) {
                this.gameOver();
                break;
            }

            // Check for collision with obstacles
            if (this.checkCollision(futureCircle, this.obstacles)) {
                console.log('Collision detected! Stopping movement.');
                if (direction === 'forward') {
                    await this.move_backward(stepDistance); // Move backward slightly to avoid overlapping obstacles
                }
                else if (direction === 'backward') {
                    await this.move_forward(stepDistance); // Move forward slightly to avoid overlapping obstacles
                }
                else if (direction === 'upward') {
                    await this.move_downward(stepDistance); // Move downward slightly to avoid overlapping obstacles
                }
                else if (direction === 'downward') {
                    await this.move_upward(stepDistance); // Move upward slightly to avoid overlapping obstacles
                }

                break; // Exit the loop if a collision is detected
            }
    
            // Move the circle to the new position
            this.circle.position.x = futureCircle.translation.x;
            this.circle.position.y = futureCircle.translation.y;
    
            // Render the updated position
            this.two.update();
    
            // Optional: Add a delay for smoother movement
            await new Promise(resolve => setTimeout(resolve, 100)); // Adjust the delay as needed
        }
    }

    gameOver() {
        // Create a game over text
        const gameOverText = this.two.makeText('Game Over', this.two.width / 2, this.two.height / 2);
        gameOverText.fill = 'red';
        gameOverText.size = 48; // Larger font size
        gameOverText.alignment = 'center';
        
        // Optional: Stop any ongoing animations or interactions
        this.isAnimating = false;
        
        // Render the game over text
        this.two.update();
        
        // Optional: Trigger any additional game over logic
        console.log('Game Over: Ball went out of grid boundaries');
    }

    async changeBallColor(color) {
        this.circle.fill = color; // Update the fill color of the circle
        this.two.update(); // Update the Two.js instance to reflect the change
    }

    youWin() {
        // Create a "You Win" text
        const youWinText = this.two.makeText('You Win!', this.two.width / 2, this.two.height / 2);
        youWinText.fill = 'green'; // Green for success
        youWinText.size = 48; // Large font size
        youWinText.alignment = 'center';
    
        // Optional: Stop animations or interactions
        this.isAnimating = false;
    
        // Render the text on the canvas
        this.two.update();
    
        // Optional: Additional winning logic
        console.log('You Win: Successfully completed the game!');
    }
    


    // Utility method to demonstrate a generic block functionality
    performCustomAction(action) {
        console.log('Performing custom action:', action);
        // You can expand this method to handle various custom actions
        switch(action) {
            case 'length':
                return 'Hello World'.length;
            case 'uppercase':
                return 'hello world'.toUpperCase();
            default:
                console.warn('Unknown action:', action);
                return null;
        }
    }

    // Test method to verify movement
    testMovement() {
        console.log('Starting movement test');
        console.log('Initial position:', this.character.position);
        
        // Directly modify position to test rendering
        this.character.position.x += 50;
        
        console.log('After direct modification:', this.character.position);
        this.two.update(); // Force Two.js to render
    }
} 