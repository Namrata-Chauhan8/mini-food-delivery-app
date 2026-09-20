import { MenuItem } from '../types';
import { IMAGES, ImageKey } from './images';

/** [name, description, price, section, isVeg, image] */
type MenuSeed = [string, string, number, string, boolean, ImageKey];

const SEEDS: Record<string, MenuSeed[]> = {
  r1: [
    ['Margherita Pizza', 'San Marzano tomato, fior di latte, fresh basil', 329, 'Pizzas', true, 'pizza'],
    ['Diavola Pizza', 'Spicy salami, mozzarella, chilli oil', 449, 'Pizzas', false, 'pizza'],
    ['Quattro Formaggi', 'Mozzarella, gorgonzola, parmesan, fontina', 479, 'Pizzas', true, 'pizza'],
    ['Truffle Mushroom Pizza', 'Wild mushrooms, truffle cream, rocket', 529, 'Pizzas', true, 'pizza'],
    ['Penne Arrabbiata', 'Penne in spicy tomato and garlic sauce', 299, 'Pasta', true, 'bowl'],
    ['Chicken Alfredo', 'Fettuccine, grilled chicken, parmesan cream', 399, 'Pasta', false, 'bowl'],
    ['Garlic Bread', 'Wood-fired, herb butter, parmesan crust', 169, 'Sides', true, 'cake'],
    ['Tiramisu', 'Mascarpone, espresso-soaked savoiardi', 249, 'Desserts', true, 'dessert'],
  ],
  r2: [
    ['Classic Cheeseburger', 'Beef patty, cheddar, pickles, house sauce', 279, 'Burgers', false, 'burger'],
    ['Double Bacon Stack', 'Two patties, smoked bacon, caramelised onion', 429, 'Burgers', false, 'burger'],
    ['Crispy Chicken Burger', 'Buttermilk-fried chicken, slaw, sriracha mayo', 319, 'Burgers', false, 'burger'],
    ['Paneer Tikka Burger', 'Char-grilled paneer, mint chutney, onion', 259, 'Burgers', true, 'paneer'],
    ['Loaded Cheese Fries', 'Cheddar sauce, jalapeños, spring onion', 199, 'Sides', true, 'burger'],
    ['Peri Peri Fries', 'Hand-cut fries tossed in peri peri', 149, 'Sides', true, 'burger'],
    ['Chocolate Thick Shake', 'Belgian chocolate, vanilla ice cream', 199, 'Shakes', true, 'smoothie'],
    ['Oreo Shake', 'Cookies and cream, whipped top', 209, 'Shakes', true, 'smoothie'],
  ],
  r3: [
    ['Hyderabadi Chicken Dum Biryani', 'Long-grain basmati, slow-cooked on dum', 389, 'Biryani', false, 'biryani'],
    ['Mutton Dum Biryani', 'Tender mutton, saffron, fried onion', 489, 'Biryani', false, 'biryani'],
    ['Veg Dum Biryani', 'Seasonal vegetables, whole spices', 279, 'Biryani', true, 'biryani'],
    ['Egg Biryani', 'Boiled eggs, masala rice, mint', 249, 'Biryani', false, 'biryani'],
    ['Chicken 65', 'Crisp fried chicken, curry leaf, chilli', 289, 'Starters', false, 'falafel'],
    ['Mirchi Ka Salan', 'Peanut and sesame chilli curry', 129, 'Sides', true, 'paneer'],
    ['Double Ka Meetha', 'Fried bread pudding, saffron milk', 149, 'Desserts', true, 'dessert'],
    ['Masala Raita', 'Whisked curd, onion, roasted cumin', 79, 'Sides', true, 'bowl'],
  ],
  r4: [
    ['Masala Dosa', 'Crisp dosa, spiced potato, chutney, sambar', 159, 'Dosa', true, 'dosa'],
    ['Mysore Masala Dosa', 'Red chilli chutney spread, potato masala', 189, 'Dosa', true, 'dosa'],
    ['Paneer Butter Dosa', 'Paneer bhurji filling, butter roast', 219, 'Dosa', true, 'dosa'],
    ['Rava Onion Dosa', 'Semolina batter, onion, green chilli', 179, 'Dosa', true, 'dosa'],
    ['Idli Sambar (4 pcs)', 'Steamed rice cakes, sambar, chutney', 119, 'Idli & Vada', true, 'bowl'],
    ['Medu Vada (2 pcs)', 'Crisp lentil donuts, coconut chutney', 99, 'Idli & Vada', true, 'falafel'],
    ['Filter Coffee', 'Traditional South Indian degree coffee', 69, 'Beverages', true, 'coffee'],
    ['Curd Rice', 'Tempered curd rice, pomegranate', 139, 'Rice', true, 'bowl'],
  ],
  r5: [
    ['Hakka Noodles', 'Wok-tossed noodles, julienne vegetables', 229, 'Noodles', true, 'noodles'],
    ['Chicken Schezwan Noodles', 'Fiery schezwan sauce, shredded chicken', 289, 'Noodles', false, 'noodles'],
    ['Pad Thai', 'Rice noodles, tamarind, peanut, lime', 329, 'Noodles', true, 'noodles'],
    ['Veg Fried Rice', 'Burnt garlic, spring onion, soy', 209, 'Rice', true, 'bowl'],
    ['Chilli Paneer Dry', 'Crisp paneer, bell pepper, chilli soy', 269, 'Starters', true, 'paneer'],
    ['Chicken Momos (8 pcs)', 'Steamed dumplings, schezwan chutney', 199, 'Starters', false, 'falafel'],
    ['Thai Green Curry', 'Coconut, basil, seasonal vegetables', 299, 'Curries', true, 'bowl'],
    ['Honey Chilli Potato', 'Crisp potato batons, honey chilli glaze', 189, 'Starters', true, 'burger'],
  ],
  r6: [
    ['Quinoa Power Bowl', 'Quinoa, chickpea, avocado, tahini', 349, 'Bowls', true, 'bowl'],
    ['Grilled Chicken Caesar', 'Romaine, parmesan, herbed croutons', 379, 'Salads', false, 'salad'],
    ['Greek Salad', 'Feta, olive, cucumber, oregano vinaigrette', 299, 'Salads', true, 'salad'],
    ['Falafel Mezze Bowl', 'Falafel, hummus, pickled veg, pita', 329, 'Bowls', true, 'falafel'],
    ['Avocado Toast', 'Sourdough, smashed avocado, chilli flakes', 259, 'Toasts', true, 'pancakes'],
    ['Berry Protein Smoothie', 'Mixed berries, whey, almond milk', 229, 'Smoothies', true, 'smoothie'],
    ['Green Detox Juice', 'Spinach, apple, celery, ginger', 189, 'Smoothies', true, 'smoothie'],
    ['Overnight Oats', 'Rolled oats, chia, banana, honey', 199, 'Breakfast', true, 'pancakes'],
  ],
  r7: [
    ['Paneer Butter Masala', 'Cashew tomato gravy, cream, kasuri methi', 329, 'Main Course', true, 'paneer'],
    ['Butter Chicken', 'Tandoori chicken, silky makhani gravy', 389, 'Main Course', false, 'paneer'],
    ['Dal Makhani', 'Black lentils simmered overnight', 269, 'Main Course', true, 'bowl'],
    ['Kadai Chicken', 'Bell pepper, onion, freshly ground masala', 369, 'Main Course', false, 'paneer'],
    ['Paneer Tikka', 'Char-grilled, mint chutney, onion rings', 299, 'Tandoor', true, 'paneer'],
    ['Tandoori Chicken (Half)', 'Yoghurt and spice marinade, clay oven', 349, 'Tandoor', false, 'steak'],
    ['Butter Naan (2 pcs)', 'Tandoor-baked, brushed with butter', 89, 'Breads', true, 'cake'],
    ['Gulab Jamun (2 pcs)', 'Warm khoya dumplings in rose syrup', 119, 'Desserts', true, 'dessert'],
  ],
  r8: [
    ['Belgian Chocolate Truffle', 'Dark chocolate ganache, 1 lb', 749, 'Cakes', true, 'cake'],
    ['Red Velvet Cheesecake', 'Cream cheese frosting, cocoa sponge', 699, 'Cakes', true, 'cake'],
    ['Classic New York Cheesecake', 'Graham base, baked vanilla cheesecake', 329, 'Slices', true, 'cake'],
    ['Chocolate Chip Cookies (6)', 'Brown butter, dark chocolate chunks', 249, 'Cookies', true, 'dessert'],
    ['Almond Croissant', 'Laminated 48 hours, almond frangipane', 179, 'Bakes', true, 'pancakes'],
    ['Tiramisu Jar', 'Espresso, mascarpone, cocoa dust', 289, 'Desserts', true, 'dessert'],
    ['Vanilla Bean Ice Cream', 'Madagascar vanilla, 500 ml tub', 349, 'Ice Cream', true, 'icecream'],
    ['Blueberry Muffin', 'Buttermilk crumb, fresh blueberries', 149, 'Bakes', true, 'cake'],
  ],
  r9: [
    ['Cappuccino', 'Double shot, velvet steamed milk', 189, 'Coffee', true, 'coffee'],
    ['Cold Brew', 'Steeped 18 hours, served over ice', 219, 'Coffee', true, 'coffee'],
    ['Hazelnut Latte', 'Espresso, hazelnut syrup, steamed milk', 239, 'Coffee', true, 'coffee'],
    ['Iced Americano', 'Double ristretto over chilled water', 179, 'Coffee', true, 'coffee'],
    ['Mango Smoothie', 'Alphonso mango, yoghurt, honey', 229, 'Smoothies', true, 'smoothie'],
    ['Strawberry Milkshake', 'Fresh strawberries, vanilla gelato', 249, 'Shakes', true, 'smoothie'],
    ['Butter Croissant', 'Flaky, French butter, baked fresh', 159, 'Bakes', true, 'pancakes'],
    ['Blueberry Pancakes', 'Buttermilk stack, maple syrup', 289, 'All Day Breakfast', true, 'pancakes'],
  ],
  r10: [
    ['Chicken Soft Tacos (3)', 'Grilled chicken, pico de gallo, lime crema', 329, 'Tacos', false, 'tacos'],
    ['Veg Fajita Tacos (3)', 'Charred peppers, onion, guacamole', 289, 'Tacos', true, 'tacos'],
    ['Loaded Nachos', 'Cheese sauce, jalapeño, salsa, sour cream', 279, 'Starters', true, 'tacos'],
    ['Chicken Burrito', 'Cilantro rice, beans, cheese, salsa verde', 369, 'Burritos', false, 'bowl'],
    ['Burrito Bowl', 'Rice, black beans, corn salsa, guacamole', 329, 'Burritos', true, 'bowl'],
    ['Quesadilla', 'Three-cheese blend, charred tortilla', 259, 'Starters', true, 'tacos'],
    ['Churros with Chocolate', 'Cinnamon sugar, warm chocolate dip', 219, 'Desserts', true, 'dessert'],
    ['Guacamole & Chips', 'Hand-mashed avocado, corn tortilla chips', 239, 'Starters', true, 'salad'],
  ],
  r11: [
    ['Grilled Chicken Steak', 'Herb butter, mash, seasonal vegetables', 549, 'Grills', false, 'steak'],
    ['Lamb Chops', 'Rosemary marinade, red wine jus', 749, 'Grills', false, 'steak'],
    ['BBQ Pork Ribs', 'Slow-cooked 6 hours, smoky BBQ glaze', 699, 'Grills', false, 'steak'],
    ['Grilled Cottage Cheese Steak', 'Paneer steak, peri peri, grilled veg', 449, 'Grills', true, 'paneer'],
    ['Herb Roasted Potatoes', 'Rosemary, garlic, sea salt', 189, 'Sides', true, 'burger'],
    ['Creamy Mushroom Soup', 'Button mushrooms, thyme, cream', 199, 'Soups', true, 'bowl'],
    ['Caesar Salad', 'Cos lettuce, parmesan, classic dressing', 269, 'Salads', true, 'salad'],
    ['Molten Lava Cake', 'Warm chocolate centre, vanilla scoop', 259, 'Desserts', true, 'dessert'],
  ],
  r12: [
    ['Pani Puri (6 pcs)', 'Crisp puri, spiced mint water, potato', 79, 'Chaat', true, 'samosa'],
    ['Sev Puri', 'Crushed puri, chutneys, nylon sev', 99, 'Chaat', true, 'samosa'],
    ['Dahi Puri', 'Chilled curd, sweet chutney, pomegranate', 109, 'Chaat', true, 'samosa'],
    ['Samosa (2 pcs)', 'Flaky pastry, spiced potato and pea', 69, 'Snacks', true, 'samosa'],
    ['Vada Pav', 'Mumbai style, dry garlic chutney', 59, 'Snacks', true, 'burger'],
    ['Pav Bhaji', 'Buttery mashed vegetables, toasted pav', 159, 'Snacks', true, 'bowl'],
    ['Masala Chaas', 'Spiced buttermilk, roasted cumin', 49, 'Beverages', true, 'smoothie'],
    ['Jalebi (250g)', 'Crisp spirals soaked in saffron syrup', 129, 'Desserts', true, 'dessert'],
  ],
};

function buildMenu(restaurantId: string, seeds: MenuSeed[]): MenuItem[] {
  return seeds.map(([name, description, price, section, isVeg, image], index) => ({
    id: `${restaurantId}-m${index + 1}`,
    restaurantId,
    name,
    description,
    price,
    section,
    isVeg,
    image: IMAGES[image],
  }));
}

export const MENUS: Record<string, MenuItem[]> = Object.fromEntries(
  Object.entries(SEEDS).map(([restaurantId, seeds]) => [
    restaurantId,
    buildMenu(restaurantId, seeds),
  ]),
);

export const ALL_MENU_ITEMS: MenuItem[] = Object.values(MENUS).flat();

export function getMenuForRestaurant(restaurantId: string): MenuItem[] {
  return MENUS[restaurantId] ?? [];
}

/** Menu grouped into the sections a details screen renders as headers. */
export function getMenuSections(restaurantId: string): { title: string; data: MenuItem[] }[] {
  const items = getMenuForRestaurant(restaurantId);
  const order: string[] = [];
  const bySection = new Map<string, MenuItem[]>();

  for (const item of items) {
    if (!bySection.has(item.section)) {
      bySection.set(item.section, []);
      order.push(item.section);
    }
    bySection.get(item.section)!.push(item);
  }

  return order.map((title) => ({ title, data: bySection.get(title)! }));
}
