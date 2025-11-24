# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for storing QR codes and model information.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (M0 Free Tier is sufficient)
3. Verify your email address

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** tier (Free forever)
3. Select a cloud provider and region (choose closest to your users)
4. Click **"Create"** (cluster name will be auto-generated)

## Step 3: Create Database User

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username and generate a secure password (save it!)
5. Set user privileges to **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

## Step 4: Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development: Click **"Add Current IP Address"**
4. For production: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

## Step 5: Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## Step 6: Configure Environment Variable

1. In your `backend/.env` file, add:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/ar_qr_models?retryWrites=true&w=majority
   ```

2. Replace:
   - `YOUR_USERNAME` with your database username
   - `YOUR_PASSWORD` with your database password
   - `YOUR_CLUSTER` with your cluster name (e.g., `cluster0.xxxxx`)

## Step 7: Test Connection

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. You should see: `MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net`

## Database Schema

The application will automatically create a `models` collection with the following structure:

```javascript
{
  filename: String,           // Stored filename
  originalFilename: String,   // Original filename
  fileSize: Number,           // File size in bytes
  mimeType: String,          // MIME type (e.g., "model/gltf-binary")
  modelUrl: String,           // URL to the model file
  arViewUrl: String,          // URL to AR viewer
  qrCodeUrl: String,          // URL to QR code image
  qrCodeData: String,         // QR code data (AR view URL)
  qrCodeId: String,           // Unique QR code ID (for matching)
  uploadedAt: Date,           // Upload timestamp
  lastAccessed: Date,          // Last access timestamp
  accessCount: Number,        // Number of times accessed
  description: String,        // Optional description
  tags: [String],             // Optional tags
  isActive: Boolean,          // Active status
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

## Production Deployment

### For Render.com:

1. Go to your Render dashboard
2. Select your backend service
3. Go to **"Environment"** tab
4. Add environment variable:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
5. Save and redeploy

### For Other Platforms:

Add the `MONGODB_URI` environment variable in your hosting platform's environment variable settings.

## Troubleshooting

### Connection Timeout
- Check that your IP address is whitelisted in MongoDB Atlas Network Access
- Verify your connection string is correct

### Authentication Failed
- Double-check username and password in connection string
- Ensure user has proper permissions

### Database Not Found
- The database will be created automatically on first use
- Default database name: `ar_qr_models`

## Security Best Practices

1. **Never commit `.env` files** to version control
2. Use strong passwords for database users
3. Restrict IP access in production (only allow your server IPs)
4. Regularly rotate database passwords
5. Enable MongoDB Atlas monitoring and alerts

## Free Tier Limits

MongoDB Atlas M0 Free Tier includes:
- 512 MB storage
- Shared RAM and vCPU
- No credit card required
- Perfect for development and small applications

For production with high traffic, consider upgrading to a paid tier.

