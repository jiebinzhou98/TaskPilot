const adjectives = ['Brave','Happey','Sleepy','Curious','Fuzzy','Wild','Clever','Quiet','Silly','Chill','Energetic','Gentle'];
const animals = ['Koala','Penguin','Fox','Otter','Tiger','Owl','Dolphin','Rabbit','Raccoon','Bear','Hedgehog','Parrot']

export function generateRandomNickName(){
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)]
    return `${adj} ${animal}`
}
