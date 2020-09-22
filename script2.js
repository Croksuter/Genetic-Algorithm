const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numberOfPreys = 100;
const numberOfPredators = 20;

const prey_begin_speed = [1,30];
const prey_begin_size = [1,100];
const prey_turn_period = [10,50]; //Do not fitting

const predator_begin_speed = [4,20];
const predator_begin_size = [40,40];
const predator_turn_period = [50,100];

const mutation_value = 0.01;
const alive_value = 0.1;
const crossover_value = 0.7;

const cutting_value = 3;

let generation = 1;

let preysArray = [];
let next_preysArray = [];
let predatorsArray = [];
let next_predatorsArray = [];
let update_count = 0;
let eaten_preys = [];

class Prey {
    constructor(size, speed){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        if (typeof size == 'undefined') {
            this.size = prey_begin_size[0] + (Math.random() * (prey_begin_size[1] - prey_begin_size[0]));
            this.speed = prey_begin_speed[0] + (Math.random() * (prey_begin_speed[1] - prey_begin_speed[0]));
        } else {
            this.size = size;
            this.speed = speed;
        }
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
    get_speed(){
        return this.speed
    }
}

class Predator {
    constructor(){
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
    get_speed(){
        return this.speed
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

function crossover_mutation_with_alive(){
    for (let i = 0; i < numberOfPreys - preysArray.length; i++) {
        M_idx = Math.round(Math.random() * (preysArray.length - 1));
        F_idx = Math.round(Math.random() * (preysArray.length - 1));
        do {
            result_size = (preysArray[M_idx].get_size() + preysArray[F_idx].get_size())/2 + (Math.random() * 10 -5);
            result_speed = (preysArray[M_idx].get_speed() + preysArray[F_idx].get_speed())/2 + (Math.random() * 10 -5);
        } while (result_size <= 0 || result_speed <= 0)
        if (Math.random() <= mutation_value) {
            result_size *= Math.random() * 3
            result_speed *= Math.random() * 3
            preysArray.push(new Prey(result_size, result_speed));
        } else {
        preysArray.push(new Prey(result_size, result_speed));
        }
    }
}

function crossover_mutation_without_alive(){
    for (let i = 0; i < numberOfPreys; i++) {
        M_idx = Math.round(Math.random() * (preysArray.length - 1));
        F_idx = Math.round(Math.random() * (preysArray.length - 1));
        do {
            result_size = (preysArray[M_idx].get_size() + preysArray[F_idx].get_size())/2 + (Math.random() * 10 - 5);
            result_speed = (preysArray[M_idx].get_speed() + preysArray[F_idx].get_speed())/2 + (Math.random() * 10 -5);
        } while (result_size <= 0 || result_speed <= 0)
        if (Math.random() <= mutation_value) {
            result_size *= Math.random() * 3
            result_speed *= Math.random() * 3
            next_preysArray.push(new Prey(result_size, result_speed));
        } else {
        next_preysArray.push(new Prey(result_size, result_speed));
        }
    }
    preysArray = next_preysArray;
    next_preysArray = [];
}

function cutting(value){
    return Math.round(value * Math.pow(10, cutting_value)) / Math.pow(10, cutting_value)
}

function animate(test_count){
    update_count += 1
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < preysArray.length; i++){
        if (preysArray[i] == 0) continue;
        preysArray[i].update();
        preysArray[i].draw();
        for (let j = 0; j < predatorsArray.length; j++){
            if (distances(preysArray[i].get_x(), preysArray[i].get_y(), predatorsArray[j].get_x(), predatorsArray[j].get_y()) <= preysArray[i].get_size() + predatorsArray[j].get_size()) {
                if (predatorsArray[j].get_size() + 1 > preysArray[i].get_size() & preysArray[i].get_size() > predatorsArray[j].get_size() - 1) {
                    continue;
                }
                preysArray.splice(i,1);
                break;
            }
        }
    }
    for (let i = 0; i < predatorsArray.length; i++){
        predatorsArray[i].update();
        predatorsArray[i].draw();
    }

    document.getElementById("preys_num_info").innerHTML = "Preys: " + preysArray.length;
    document.getElementById("predators_num_info").innerHTML = "Predators: " + predatorsArray.length;
    document.getElementById("progress_bar").value = (100 - preysArray.length) * 100 / (100 - alive_value * numberOfPreys);
    document.getElementById("remain_info").innerHTML= "Remains: " + (preysArray.length - alive_value * numberOfPreys);
    if (preysArray.length <= alive_value * numberOfPreys) {
        let prey_size_temp = prey_speed_temp = predator_size_temp = predator_speed_temp = 0;
        for (let i = 0; i < preysArray.length; i++) {
            prey_size_temp += preysArray[i].get_size()
            prey_speed_temp += preysArray[i].get_speed()
        }
        for (let i = 0; i < predatorsArray.length; i++) {
            predator_size_temp += predatorsArray[i].get_size()
            predator_speed_temp += predatorsArray[i].get_speed()
        }

        document.getElementById("prey_size_info").innerHTML = "Preys avg_size: " + cutting(prey_size_temp/preysArray.length);
        document.getElementById("predator_size_info").innerHTML = "Predators avg_size: " + cutting(predator_size_temp/predatorsArray.length);
        document.getElementById("prey_speed_info").innerHTML = "Preys avg_speed: " + cutting(prey_speed_temp/preysArray.length);
        document.getElementById("predator_speed_info").innerHTML = "Predators avg_speed: " + cutting(predator_speed_temp/predatorsArray.length);

        console.log('generating...')
        crossover_mutation_without_alive();
        generation += 1;
        document.getElementById("generation_info").innerHTML = "Generation: " + generation;
    }
    requestAnimationFrame(animate);
}

make_iters();
let maximum_count = 100000
animate();
//fitting(10);
