Overview: 
The Inventory Reorder Alert System enables users to manage their inventory items effectively. It offers a user-friendly interface to create, view, update, and delete items. Users can also manage inventory items at their threshold level. An alert is sent when an item's quantity drops below its threshold. The system includes secure user authentication, allowing individuals to sign up and log in to their accounts. It provides profile management and an alert dashboard. The design ensures a seamless user experience and boosts productivity in both personal and professional workspaces.

Features:
•	User Authentication: Signup, login, and logout.
•	Profile management: Manage user details.
•	Inventory Management: Add items, view items, update items, and delete items.
•	Dashboard: Alert dashboard and Inventory levels.

Tech Stack:
•	Frontend: HTML, CSS, JavaScript.
•	Backend: Node.js / Express (API & Services)
•	Database: MongoDB (User and Item Collections)

Getting started:
1.	Clone the repository: git clone https://github.com/prithviraj-jadeja/Inventory-reorder-alert-system.git
2.	Install dependencies: npm install
3.	Environment configuration: Create a .env file  and provide the following details. 
    a.	PORT=5000
    b.	MONGO_URI= your mongo db connection string
    c.	JWT_SECRET= your secret key
4.	Run the application: npm start

EC2 Instance Name and ID: 
SDLCApp (instance id : i-0897228f0dec113e9)
Public IP : 52.65.233.83

EC2 Instance Link: 
https://ap-southeast-2.console.aws.amazon.com/ec2/home?region=ap-southeast-2#InstanceDetails:instanceId=i-0897228f0dec113e9
https://ap-southeast-2.console.aws.amazon.com/ec2/home?region=ap-southeast-2#Instances:tag:Name=SDLCApp;v=3;$case=tags:true%5C,client:false;$regex=tags:false%5C,client:false

UserName and password for project:

email: abc@email.com
password: abc1234

email: lmn@email.com
password: lmn1234


