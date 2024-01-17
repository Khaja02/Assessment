function Catalogue() {
    this.products = {
        "Product A": 20,
        "Product B": 40,
        "Product C": 50
    };
    this.discountRules = {
        "flat_10_discount": function (quantity, total) { return total > 200 ? 10 : 0; },
        "bulk_5_discount": function (quantity, total, price) { return quantity > 10 ? 0.05 * quantity * price : 0; },
        "bulk_10_discount": function (quantity, total) { return quantity > 20 ? 0.10 * total : 0; },
        "tiered_50_discount": function (quantity, total, price) { return quantity > 30 ? 0.50 * (quantity - 15) * price : 0; }
    };
    this.giftWrapFee = 1;
    this.shippingFeePerPackage = 5;
    this.unitsPerPackage = 10;

    this.calculateDiscount = function (quantity, total, price) {
        var discounts = {};
        for (var rule in this.discountRules) {
            discounts[rule] = this.discountRules[rule](quantity, total, price);
        }

        var maxDiscountRule = Object.keys(discounts).reduce(function (a, b) {
            return discounts[a] > discounts[b] ? a : b;
        });
        return [maxDiscountRule, discounts[maxDiscountRule]];
    };

    this.calculateShippingFee = function (totalUnits) {
        return Math.floor(totalUnits / this.unitsPerPackage) * this.shippingFeePerPackage;
    };

    this.calculateProductCost = function (product, quantity, giftWrap) {
        var pricePerUnit = this.products[product];
        var totalPrice = quantity * pricePerUnit;
        var discountInfo = this.calculateDiscount(quantity, totalPrice, pricePerUnit);

        var giftWrapFee = this.giftWrapFee * quantity * (giftWrap ? 1 : 0);
        var shippingFee = this.calculateShippingFee(quantity);

        var subtotal = totalPrice;
        var total = subtotal - discountInfo[1] + shippingFee + giftWrapFee;

        return {
            Product: product,
            Quantity: quantity,
            "Total Amount": totalPrice,
            Subtotal: subtotal,
            "Discount Applied": { Rule: discountInfo[0], Amount: discountInfo[1] },
            "Shipping Fee": shippingFee,
            "Gift Wrap Fee": giftWrapFee,
            Total: total
        };
    };
}

function main() {
    var catalogue = new Catalogue();

    for (var product in catalogue.products) {
        var quantity = parseInt(prompt("Enter the quantity of " + product + ":"), 10);
        var giftWrap = prompt("Is " + product + " wrapped as a gift? (yes/no):").toLowerCase() === 'yes';

        var result = catalogue.calculateProductCost(product, quantity, giftWrap);

        console.log("\nDetails:");
        for (var key in result) {
            console.log(key + ": " + result[key]);
        }
        console.log("\n" + "=".repeat(30) + "\n");
    }
}

main();
