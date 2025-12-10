# MongoDB Setup Guide

## Installing MongoDB

### Windows

1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the installation wizard
3. Choose "Complete" setup type
4. Select "Run service as Network Service user" 
5. Choose the default data directory or specify a custom one
6. Complete the installation

### macOS

Using Homebrew:
```bash
brew tap mongodb/brew
brew install mongodb-community
```

### Ubuntu/Debian

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

## Starting MongoDB

### Windows

MongoDB should start automatically as a service. If not:
1. Open Services (services.msc)
2. Find "MongoDB Server"
3. Right-click and select "Start"

Or use Command Prompt as Administrator:
```cmd
net start MongoDB
```

### macOS

```bash
brew services start mongodb-community
```

### Ubuntu/Debian

```bash
sudo systemctl start mongod
```

## Verifying Installation

Connect to MongoDB using the mongo shell:
```bash
mongo
```

You should see a prompt like:
```
MongoDB shell version v5.0.0
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("...") }
MongoDB server version: 5.0.0
================
Warning: the "mongo" shell has been superseded by "mongosh":
...
================
>
```

Type `exit` to quit the shell.

## Database Configuration

This todo list app uses:
- Database name: `todo-list`
- Collection name: `todos`

The connection string is: `mongodb://localhost:27017/todo-list`

You don't need to manually create the database or collection. The app will create them automatically when you add your first todo item.

## Troubleshooting

### Connection Issues

If you get connection errors:
1. Ensure MongoDB service is running
2. Check if the port (27017) is correct
3. Verify firewall settings

### Permission Issues (macOS/Linux)

If you get permission errors:
```bash
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
```

Then restart MongoDB:
```bash
sudo systemctl restart mongod
```