Usage:

Import library

    import {getPropertyByPath, setPropertyByPath} from "objectutils-propertybypath";

    let data = {
        animals: {
            cat: {name: 'Alice', age: 1},
            dog: {name: 'Bob', age: 5}
        }
    }

get value by path:

    let aliceAge = getPropertyByPath(data, 'animals.cat.age')

set new value by path:

    setPropertyByPath(data, 'animals.cat.age', aliceAge+1);
