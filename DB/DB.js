const  dotenv =require('dotenv').config();
const  mongoose =require('mongoose');


const ConnectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://rahul658541:Rahul1234@cluster0.jyfnp.mongodb.net/';
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports={ConnectDB};
