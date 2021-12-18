export class Shoot {
    constructor ( velocity, targetArea ) {
        this.beginVelocity = {x: velocity.x, y: velocity.y}
        this.velocity = velocity
        this.targetArea = targetArea
        this.x = 0
        this.y = 0
        this.highestPoint = 0
        this.hit = this.willHitTagetArea()
    }

    willHitTagetArea() {
        while ( this.y >= Math.min(...this.targetArea.y)) {
            if (this.isInTheArea) {
                return true
            }
            this.move()
        }
        return false
    }

    get isInTheArea() {
        return (
            this.x >= Math.min(...this.targetArea.x) 
            && this.x <= Math.max(...this.targetArea.x)
            && this.y >= Math.min(...this.targetArea.y) 
            && this.y <= Math.max(...this.targetArea.y)
        )
    }

    move() {
        this.x += this.velocity.x
        this.y += this.velocity.y
        if (this.y > this.highestPoint) {
            this.highestPoint = this.y
        }
        if (this.velocity.x > 0) {
            this.velocity.x --
        }
        if (this.velocity.x < 0) {
            this.velocity.x ++
        }
        this.velocity.y --
    }

    
}
