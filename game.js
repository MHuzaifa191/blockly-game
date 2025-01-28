class Game {
    constructor(circle, two) {
        this.circle = circle; // Use the existing circle passed in
        this.currentAngle = 0; // Angle in degrees
        this.isAnimating = false; // Animation state
        this.two = two;
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

        // Add grid for reference (optional)
        this.drawGrid();
        
        // Initial render
        this.two.update();
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

    async moveForward(distance) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const angle = this.currentAngle * (Math.PI / 180);
        const targetX = this.circle.position.x + Math.cos(angle) * distance;
        const targetY = this.circle.position.y + Math.sin(angle) * distance;

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
                two.update();

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

    async turnLeft(angle) {
        await this.rotate(-angle);
    }

    async turnRight(angle) {
        await this.rotate(angle);
    }

    async rotate(angle) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        return new Promise((resolve) => {
            const duration = 500; // 0.5 seconds
            const startAngle = this.character.rotation;
            const targetAngle = startAngle + (angle * Math.PI / 180);
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                this.character.rotation = startAngle + (targetAngle - startAngle) * progress;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.currentAngle = (this.currentAngle + angle) % 360;
                    this.isAnimating = false;
                    resolve();
                }
            };

            animate();
        });
    }

    reset() {
        // Reset character position and rotation
        this.character.position.x = this.two.width / 2;
        this.character.position.y = this.two.height / 2;
        this.character.rotation = 0;
        this.currentAngle = 0;
        this.isAnimating = false;
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