// DUMP USERS (FOR AUTHENTICATION) AND TRAVELBLOG DATABASE TO ARCHIVE BJSON FILE

mongodump --db=travelBlog [--dumpDbUsersAndRoles] --out=Dropbox/HackReactor/MVP/MongoDB_dump_230125.json

//--dumpDbUsersAndRoles will only work if user exists (for db?)

//mongosh into db then
//db.getUsers()

// Copy dumpfile to production server
// scp -i [path to pem file] [path to yelp.pgsql] username@[server-ip]:[directory to copy file to]

// (from /Users/carolinepeake)
scp -r -i AWS/travel-blog.pem Dropbox/HackReactor/MVP/MongoDB_dump_230125.json ubuntu@50.18.30.182:/home/ubuntu

- scp copies folders or files to/from a remote host
-r (recursive) copies files and folders (do not put / at end of directory)
-i (indentity file)
Selects the file from which the identity (private key) for public
key authentication is read. (file path must be directly after -i b/c -i flags that the next text is the argument to be passed to ssh(1))

// RESTORE MONGO DATABASE FROM LOCAL DIRECTORY CONTAINING BSON FILES CREATED BY MONGO DUMP COMMAND

mongorestore MongoDB_dump_230125.json/

