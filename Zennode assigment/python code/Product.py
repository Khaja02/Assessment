class Catalogue:
    def __init__(self):
        self.products = {
            "Product A": 20,
            "Product B": 40,
            "Product C": 50
        }
        self.discount_rules = {
            "flat_10_discount": lambda quantity, total, price: 10 if total > 200 else 0,
            "bulk_5_discount": lambda quantity, total, price: 0.05 * quantity * price if quantity > 10 else 0,
            "bulk_10_discount": lambda quantity, total, price: 0.10 * total if quantity > 20 else 0,
            "tiered_50_discount": lambda quantity, total, price: 0.50 * (quantity - 15) * price if quantity > 30 else 0
        }
        self.gift_wrap_fee = 1
        self.shipping_fee_per_package = 5
        self.units_per_package = 10

    def calculate_discount(self, quantity, total, price):
        discounts = {}
        for rule, discount_func in self.discount_rules.items():
            discount = discount_func(quantity, total, price)
            discounts[rule] = discount

 
        max_discount_rule = max(discounts, key=discounts.get)
        return max_discount_rule, discounts[max_discount_rule]

    def calculate_shipping_fee(self, total_units):
        return (total_units // self.units_per_package) * self.shipping_fee_per_package

    def calculate_product_cost(self, product, quantity, gift_wrap):
        price_per_unit = self.products[product]
        total_price = quantity * price_per_unit
        discount_rule, discount_amount = self.calculate_discount(quantity, total_price, price_per_unit)

        gift_wrap_fee = self.gift_wrap_fee * quantity if gift_wrap else 0
        shipping_fee = self.calculate_shipping_fee(quantity)

        subtotal = total_price
        total = subtotal - discount_amount + shipping_fee + gift_wrap_fee

        return {
            "Product": product,
            "Quantity": quantity,
            "Total Amount": total_price,
            "Subtotal": subtotal,
            "Discount Applied": {"Rule": discount_rule, "Amount": discount_amount},
            "Shipping Fee": shipping_fee,
            "Gift Wrap Fee": gift_wrap_fee,
            "Total": total
        }


def main():
    catalogue = Catalogue()

    for product in catalogue.products.keys():
        quantity = int(input(f"Enter the quantity of {product}: "))
        gift_wrap = input(f"Is {product} wrapped as a gift? (yes/no): ").lower() == 'yes'

        result = catalogue.calculate_product_cost(product, quantity, gift_wrap)

        print("\nDetails:")
        for key, value in result.items():
            print(f"{key}: {value}")
        print("\n" + "=" * 30 + "\n")


if __name__ == "__main__":
    main()
