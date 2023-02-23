import {getPropertyByPath, setPropertyByPath} from "../index.js";

test('get property by path', () => {
	let data = {
		animals: {
			cat: {name: 'Alice', age: 1},
			dog: {name: 'Bob', age: 5}
		}
	};

	let result = getPropertyByPath(data, 'animals.cat.name');
	expect(result).toBe("Alice");
});


test('set property by path', () => {
	let data = {
		animals: {
			cat: {name: 'Alice', age: 1},
			dog: {name: 'Bob', age: 5}
		}
	};

	setPropertyByPath(data, 'animals.dog.age', 6);
	expect(data.animals.dog.age).toBe(6);
});