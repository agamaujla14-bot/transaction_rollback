# Rendering on Render

This guide explains how to deploy this transaction rollback system on Render.

## Prerequisites

1. **GitHub Repository** - Your code pushed to GitHub (already done at `https://github.com/agamaujla14-bot/transaction_rollback.git`)
2. **Render Account** - Sign up at https://render.com
3. **MongoDB Atlas Cluster** - Free database at https://www.mongodb.com/cloud/atlas

## Setup Steps

### 1. Create MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas and create a free account
2. Create a new project
3. Build a database (shared/free tier)
4. Choose a region close to your Render deployment region
5. Create credentials (username/password)
6. Get the connection string: `mongodb+srv://username:password@cluster.mongodb.net/transaction_demo?retryWrites=true&w=majority`
7. Replace `username`, `password`, and `cluster` with your actual values

### 2. Deploy on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Fill in the deployment form:
   - **Name**: `transaction-rollback` (or desired name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

5. Add Environment Variables (click **Advanced** → **Add Environment Variable**):
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string from step 1

6. Click **Create Web Service**

Render will automatically:
- Clone your repository
- Install dependencies (`npm install`)
- Start the server with `npm start`
- Assign a public URL (e.g., `https://transaction-rollback-xxx.onrender.com`)

### 3. Test Your Deployment

Once deployed, test the health endpoint:

```bash
curl https://transaction-rollback-xxx.onrender.com/health
```

Should return: `{"status":"ok"}`

### 4. Use the API on Render

Replace `https://transaction-rollback-xxx.onrender.com` with your actual URL:

```bash
# Create accounts
curl -X POST https://transaction-rollback-xxx.onrender.com/accounts \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","balance":1000}'

# Perform transfer
curl -X POST https://transaction-rollback-xxx.onrender.com/transfer \
  -H "Content-Type: application/json" \
  -d '{"fromId":"<accountId1>","toId":"<accountId2>","amount":100}'

# Get logs
curl https://transaction-rollback-xxx.onrender.com/logs
```

## Important Notes

- **Free tier limitations**: Render spins down free services after 15 minutes of inactivity. The first request after inactivity may take 30 seconds.
- **MongoDB Atlas free tier**: Includes 512 MB storage and 3 shared clusters.
- **Environment variables**: Keep your MongoDB connection string secure—never commit it to GitHub.
- **PORT**: Render automatically assigns the PORT environment variable; our code uses `process.env.PORT || 3000`.

## Troubleshooting

1. **Connection refused**: Check MongoDB URI is correct and IP whitelist is open on MongoDB Atlas (0.0.0.0/0 for testing)
2. **Service won't start**: View logs in Render dashboard under **Logs** tab
3. **Transactions fail**: MongoDB transactions require a replica set; MongoDB Atlas provides this by default

## Local Testing Before Deploy

Before pushing to Render, test locally:

```bash
# Start MongoDB locally
mongod --dbpath=./data --replSet rs0
mongo --eval "rs.initiate()"

# Install and run
npm install
npm start
```

Then test endpoints on `http://localhost:3000`.
