const mongoose  = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

let mongoURL = 'mongodb://127.0.0.1:27017/wanderlist';

main()
.then(()=>{
    console.log("connected to db!!")
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoURL);
}


const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'6595147c34d02092f21ef7d7'}))
    await Listing.insertMany(initData.data);
    console.log("data is intitialised ");
}
initDB();
