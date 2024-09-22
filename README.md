# Members-Only

Members only project using passport.js
Implemented passport.js authentication using the LocalStrategy in passport
Users can register and login to create messages
Users cannot see the date and author of messages if they are not a secret club member
Users have to provide a secret password to join the secret club to view the author and dates of all messages

Created admin members that can register and login as admins to delete messages this logic is only available to admins!

Used various libraries like connect-pg-simple, passport.js, express-async-handler and many more
Created database relations between tables to streamline sql queries to fetch data
Validated all form fields using express-validator and implemented a custom validator through express-validator as well

