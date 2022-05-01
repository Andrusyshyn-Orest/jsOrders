/* DONT CHANGE THIS CODE - START */
function wait(ms = 1000) { return new Promise(resolve => setTimeout(resolve, ms)) }

class Dish {
    constructor(cookingTime) {
        this.cookingTime = cookingTime;
    }

    async cook() {
        const actualCookingTime = this.cookingTime * (1 + Math.random()) * 100;
        await wait(actualCookingTime);
        return this;
    }
}
/* DONT CHANGE THIS CODE - END */


class Ingridient {
    constructor(name, count) {
        this.name = name;
        this.count = count;
    }
}

class Bolognese extends Dish {
    constructor() {
        super(10);
        this.ingredients = [new Ingridient('spaghetti', 1), new Ingridient('meat', 1), new Ingridient('tomato', 1)];
    }
}

class MashedPotatoes extends Dish {
    constructor() {
        super(8);
        this.ingredients = [new Ingridient('potato', 1)];
    }
}

class Steak extends Dish {
    constructor() {
        super(7);
        this.ingredients = [new Ingridient('meat', 1)];
    }
}

class SteakAndFries extends Dish {
    constructor() {
        super(11);
        this.ingredients = [new Ingridient('meat', 1), new Ingridient('potato', 1)];
    }
}

class BuckWheat extends Dish {
    constructor() {
        super(3);
        this.ingredients = [new Ingridient('buckwheat', 1)];
    }
}

class Kitchen {
    constructor() {
        this.fridge = [];
        this.orderqueue = [];
    }

    addToFridge(ingredients) {
        for (let ingredient of ingredients) {
            this.add(ingredient);
        }
    }

    add(newIngredient) {
        for (let ingredient of this.fridge) {
            if (ingredient.name === newIngredient.name) {
                ingredient.count += newIngredient.count;
                return;
            }
        }
        this.fridge.push(newIngredient);
    }

    order(dish) {
        this.removeFromFridge(dish.ingredients);
        this.orderqueue.push(dish);
    }

    removeFromFridge(ingredients) {
        for (let ingredient of ingredients) {
            this.remove(ingredient);
        }
    }

    remove(removableIngredient) {
        for (let ind in this.fridge) {
            let ingredient = this.fridge[ind];
            if (ingredient.name === removableIngredient.name) {
                ingredient.count -= removableIngredient.count;
                if (ingredient.count < 0) {
                    throw 'Not enough ingridients in fridge'
                }
                else if (ingredient.count === 0) {
                    this.fridge.splice(ind, 1);
                }
                return;
            }
        }
        throw 'Not enough ingridients in fridge'
    }

    cookFastestOrder() {
        if (this.orderqueue.length === 0) {
            console.log('Order queue is empty!')
            return;
        }
        let min = this.orderqueue[0];
        let minInd = 0;
        for (let ind = 1; ind < this.orderqueue.length; ++ind) {
            if (this.orderqueue[ind].cookingTime < min.cookingTime) {
                min = this.orderqueue[ind];
                minInd = ind;
            }
        }

        this.orderqueue.splice(minInd, 1);
        return min.cook();
    }

    async cookAllOrders() {
        for (let dish of this.orderqueue) {
            await dish.cook();
        }
        let tempOrders = this.orderqueue;
        this.orderqueue = [];
        return tempOrders;
    }

}


async function test() {
    const kitchen = new Kitchen();
    kitchen.addToFridge([
        new Ingridient('potato', 1),
        new Ingridient('spaghetti', 1),
        new Ingridient('meat', 3),
        new Ingridient('tomato', 2),
        new Ingridient('buckwheat', 1)
    ])

    kitchen.order(new Bolognese()); // Bolognese extends Dish (cookingTime = 10)
    kitchen.order(new MashedPotatoes()); // MashedPotatoes extends Dish (cookingTime = 8)
    kitchen.order(new Steak()); // Steak extends Dish (cookingTime = 7)

    // // Feel free to experiment with various dishes and ingridients
    kitchen.order(new BuckWheat());

    let min = await kitchen.cookFastestOrder(); // Returns fastest dish to make
    console.log('fastest dish:');
    console.log(min);
    console.log('order queue:');
    console.log(kitchen.orderqueue);
    let doneOrders = await kitchen.cookAllOrders(); // Returns two dishes in array
    console.log('done orders:');
    console.log(doneOrders);
    console.log('order queue:');
    console.log(kitchen.orderqueue);

    kitchen.order(new SteakAndFries()); // Throws Error: Not enough ingridients in fridge
}

test();
