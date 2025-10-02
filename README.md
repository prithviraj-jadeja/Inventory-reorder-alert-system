#
# EC2 AWS Info
#
EC2 Instance Name and ID:
SDLCApp (instance id : i-0897228f0dec113e9)
Public IP : 52.65.233.83

EC2 Instance Link:
https://ap-southeast-2.console.aws.amazon.com/ec2/home?region=ap-southeast-2#InstanceDetails:instanceId=i-0897228f0dec113e9
https://ap-southeast-2.console.aws.amazon.com/ec2/home?region=ap-southeast-2#Instances:tag:Name=SDLCApp;v=3;$case=tags:true%5C,client:false;$regex=tags:false%5C,client:false

# Inventory Reorder Alert System

This system helps you manage inventory items, track stock levels, and view delivery schedules based on lead time.

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB

## Getting Started
1. Clone the repository:
    ```bash
    git clone https://github.com/Satyam2600/Inventory-Management.git
    ```
2. Install dependencies for both frontend and backend:
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```
3. Create a `.env` file in the root with:
    ```env
    PORT=5001
    MONGO_URI=your_mongo_db_connection_string
    JWT_SECRET=your_secret_key
    ```
4. Start the backend:
    ```bash
    cd backend && npm start
    ```
5. Start the frontend:
    ```bash
    cd frontend && npm start
    ```




