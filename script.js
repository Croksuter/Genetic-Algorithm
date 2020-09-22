const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numberOfPreys = 100;
const numberOfPredators = 5;

const prey_begin_speed = [1,5];
const prey_begin_size = [10,30];
const prey_turn_period = [10,50]; //Do not fitting

const predator_begin_speed = [2,10];
const predator_begin_size = [10,30];
const predator_turn_period = [50,100];

const mutation_value = 0.01;
const best_balue = 0.3;
const crossover_value = 0.7;

let preysArray = [];
let predatorsArray = [];
let update_count = 0;
let eaten_preys = [];

class Prey {
    constructor(x, y){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = prey_begin_size[0] + (Math.random() * (prey_begin_size[1] - prey_begin_size[0]));
        this.speed = prey_begin_speed[0] + (Math.random() * (prey_begin_speed[1] - prey_begin_speed[0]));
        this.turn_period = Math.round(prey_turn_period[0] + (Math.random() * (prey_turn_period[1] - prey_turn_period[0])));
        this.direct = Math.random() * Math.PI * 2
    }
    update(){
        if (this.x >= canvas.width || this.x <= 0 || this.y >= canvas.height || this.y <= 0) {
            if (this.x >= canvas.width || this.x <= 0) this.direct = Math.PI - this.direct
            if (this.y >= canvas.height || this.y <= 0) this.direct = -this.direct
        } else if (update_count % this.turn_period == 0) {
            this.direct = Math.random() * Math.PI * 2
        }

        this.x += Math.cos(this.direct) * this.speed
        this.y += Math.sin(this.direct) * this.speed
    }
    draw(){
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    get_x(){
        return this.x
    }
    get_y(){
        return this.y
    }
    get_size(){
        return this.size
    }
}

class Predator {
    constructor(x, y){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = predator_begin_size[0] + (Math.random() * (predator_begin_size[1] - predator_begin_size[0]));
        this.speed = predator_begin_speed[0] + (Math.random() * (predator_begin_speed[1] - predator_begin_speed[0]));
        this.turn_period = Math.round(predator_turn_period[0] + (Math.random() * (predator_turn_period[1] - predator_turn_period[0])));
        this.direct = Math.random() * Math.PI * 2
    }
    update(){
        if (this.x >= canvas.width || this.x <= 0 || this.y >= canvas.height || this.y <= 0) {
            if (this.x >= canvas.width || this.x <= 0) this.direct = Math.PI - this.direct
            if (this.y >= canvas.height || this.y <= 0) this.direct = -this.direct
        } else if (update_count % this.turn_period == 0) {
            this.direct = Math.random() * Math.PI * 2
        }

        this.x += Math.cos(this.direct) * this.speed
        this.y += Math.sin(this.direct) * this.speed
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    get_x(){
        return this.x
    }
    get_y(){
        return this.y
    }
    get_size(){
        return this.size
    }
}

function make_iters(){
    for (let i=0; i < numberOfPreys; i++){
        preysArray.push(new Prey());
    }
    for (let i=0; i < numberOfPredators; i++){
        predatorsArray.push(new Predator());
    }
}

function distances(x1, y1, x2, y2) {
    distance_x = x1 - x2;
    distance_y = y1 - y2;
    distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y)
    return distance
}

function crossover(){
    
}

function animate(){
    update_count += 1
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < preysArray.length; i++){
        if (preysArray[i] == 0) continue;
        preysArray[i].update();
        preysArray[i].draw();
        for (let j = 0; j < predatorsArray.length; j++){
            if (distances(preysArray[i].get_x(), preysArray[i].get_y(), predatorsArray[j].get_x(), predatorsArray[j].get_y()) <= preysArray[i].get_size() + predatorsArray[j].get_size()) {
                eaten_preys.push(i);
            }
        }
    }
    console.log(eaten_preys)
    for (let i = 0; i < eaten_preys.length; i++) {
        preysArray[eaten_preys[i]] = 0;
    }
    for (let i = 0; i < predatorsArray.length; i++){
        predatorsArray[i].update();
        predatorsArray[i].draw();
    }
    requestAnimationFrame(animate);
}

make_iters();
animate();
