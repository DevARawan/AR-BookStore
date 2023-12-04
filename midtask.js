var users = [
    {
        title: 'USA',
        key: 0,
        data:[{title: 'robert', location: 'newyork', key: 0}, {title: 'tom cruise', location: 'syra', key: 1}]
    },
    {
        title: 'india',
        key: 1,
        data:[{title: 'morris', location: 'dehli', key: 0}]
    },
    {
        title: 'pakistan',
        key: 1,
        data:[{title: 'ali akbar', location: 'lahore', key: 0}]
    }
]

function generateUniqueID() {
 
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 6).toString().padStart(4, '0');
    return `${timestamp}${randomNum}`;
  }
  

const newarray = [];
users.forEach((element) =>{
    element.data.forEach((newdata) =>{
        newarray.push({element, ...newdata, key: generateUniqueID()});
    });
});
console.log(newarray);
