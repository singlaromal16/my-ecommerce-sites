import { MongoClient, Db, ServerApiVersion } from 'mongodb';

// This variable will hold the cached database connection
// and client to avoid multiple connections.
let cachedDb: Db | null = null;
let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {

    if(cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ijkamvi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

        await client.connect();

        cachedClient = client;
        cachedDb = client.db("ecommerce-nextjs");
  
        return {client, db: client.db("ecommerce-nextjs")};
}
