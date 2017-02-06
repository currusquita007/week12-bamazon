// Create the communication with database

var mysql = require("mysql");

var connection = mysql.createConnection({

    host: "localhost",
    //this is default port
    port: 3306,

    //Your username
    user: "root",

    //Your password
    password: "Verano05*",
    database: "Bamazon"

});

// Just to make sure that we set a connection with the database

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

});


// retrieve all the products from the database

connection.query("SELECT product_name FROM products", {

}, function(err, res) {
    if (err) throw err;

    // If we log that user as a JSON, we can see how it looks.
    console.log(JSON.stringify(res, null, 1));
    askProduct();
});


// Here goes the code to ask the constumer about the type of product 
// and the number of products he/she wants to buy

function askProduct() {

    var inquirer = require("inquirer");

    // Create a "Prompt" with a series of questions for the customer 

    inquirer.prompt({

        type: "input",
        message: "What would you like to buy?",
        name: "product"

    }).then(function(user) {

        var choiceUser = user.product;
        console.log("The user has chosen this product: " + choiceUser);

        //check if product is available
        inventoryProductCheck(choiceUser);
    })
};

// Function to ask amount (this function is only run if the product chosen is available)

function askAmount(product) {

    var inquirer = require("inquirer");

    // Create a "Prompt" with a series of questions for the customer 

    inquirer.prompt({

        type: "input",
        message: "How many products would you like to buy?",
        name: "amount"

    }).then(function(user) {

        var choiceAmount = parseInt(user.amount);
        console.log("The user has chosen this product: " + product);
        console.log("The amount of products is: " + choiceAmount);

        // check if the amount of product chosen by the customer is still available

        inventoryAmountCheck(product, choiceAmount);
    })
};

// define a function to check if the product chosen by the customer is available in the database

function inventoryProductCheck(product) {
    connection.query("SELECT product_name FROM products WHERE ?", {
        product_name: product
    }, function(err, res) {
        if (err) throw err;

        var inventoryAmount = parseInt(res[0].stock_quantity);

        if (inventoryAmount === NaN) {
            console.log("We are sorry. We don't carry the product selected");
            //ask customer if he wants to keep buying
            keepBuying();
        } else {
            //ask customer how many items he wants to buy
            console.log("Great! We have the product selected");
            askAmount(product);
        }
    })
};


//define a function to check if the amount of product chosen by customer is available in the database

function inventoryAmountCheck(product, amount) {
    connection.query("SELECT stock_quantity, item_id FROM products WHERE ?", {
        product_name: product
    }, function(err, res) {
        if (err) throw err;

        var inventoryAmount = parseInt(res[0].stock_quantity);
        var inventoryProdID = parseInt(res[0].item_id);

        console.log("The amount in the inventory is: " + inventoryAmount);

        if (inventoryAmount < amount) {
            console.log("We are sorry, there is not enough quantity of this product. There is only this amount left: " + inventoryAmount);
            keepBuying();
        } else {
            console.log("Your order is being processing");
            //update repository with the new amount of the chosen product

            var amountLeft = inventoryAmount - amount;

            console.log("The amount left in the inventory after purchase is: " + amountLeft);

            updateRepository(inventoryProdID, amountLeft);

            // ask costumer if he wants to buy something else
            keepBuying();

        }
    })
};

// define the database with the new amount of the chosen product after customer has bought it

function updateRepository(productID, newAmount) {

    connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: newAmount,

    }, {
        item_id: productID,

    }], function(err, res) {});

    console.log("The updated amount in invetory is: " + newAmount);

};

// function to ask costumer if he wants to keep buying

function keepBuying() {
    var inquirer = require("inquirer");

    // Create a "Prompt" with a series of questions for the customer 

    inquirer.prompt({

        type: "confirm",
        message: "What would you to keep buying?",
        name: "confirm"

    }).then(function(user) {
        //if costumer confirms
        if (user.confirm) {
            // if user wants to keep buying, start a new search
            askProduct();

        } else {

            //if user doesn't want to keep buying, stop the code here
            console.log("Thanks for visiting us. We hope you come back to buy with us again!");
            return
        }
    })

};
