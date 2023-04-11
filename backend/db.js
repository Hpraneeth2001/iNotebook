const mongoose=require('mongoose');


const mongoURI='mongodb://127.0.0.1:27017/inotebook'

const connectToMongo= ()=>{
    mongoose.connect(mongoURI, {
        //useNewUrlParser: true,
       useUnifiedTopology: true,
       // useCreateIndex: true,
      }).then(()=>{
        console.log("Connected to mongo Successfully");
    }).catch((err)=>{console.log(err)});
}
//connectToMongo();
module.exports= connectToMongo;