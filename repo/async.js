const fruits = ['apple', 'banana', 'orange'];

for (var i = 0; i < fruits.length; i++) {
    let fruit = fruits[i];
    setTimeout(() => console.log(fruit), i * 1000);
}
