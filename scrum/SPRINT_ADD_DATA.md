#### SPRINT DUE: 5/16/24

#### SPRINT FINISHED: 5/16/24

# Current sprint: Add data

#### Objectives

The user should be able to add data into the application. This data should be addable to any of the columns, but only for the current day. This data can be edited on the same day, but if the day you're trying to edit is not today, it shouldn't let you add it.

- [x] Implement a `Row` model in the database, with a field `stats` of type `Column[]`, and another field for the date
- [x] Implement a simple `Column` model in the database, with a single field containing the statistic
- [x] Create an API interface, that creates the Column for a row, given the statistic.
- [x] Implement a front-end form interface that sends a request to the resolver and creates the record.

Design reasoning:

1. Database choice: SQLite

   - Sqlite is an extremely easy database to use, and I don't have to set up a server for it. I can simply install an npm package and it works. However, on the cloud, this solution will not work because the cloud environment is stateless. I would need to get an actual database set up somewhere in the cloud for actual data storage.

2. Production Database: PostgreSQL on Vercel

   - PostgreSQL is a well known and popular database. I haven't used it very much, though. It has all the features of SQlite and more, so there shouldn't be issues over switching over. More importantly, Vercel is free, so I can use it without paying for either the database or the cloud container running my code.

3. Database ORM: Prisma

   - Prisma is a very easy-to-use ORM, with an inbuilt schema and type-safe generation that allows me to access data easily. Unlike other orms like Kysely and Drizzle, I don't have to know SQL in order to use it effectively (and I don't know SQL, so that's a plus). Prisma has enough flexibility for this project.

4. API: RESTful

   - This app isn't that complex to where I need to have a large GraphQL API. Most data is tabular, not graph based, and so it is unwise to use a complex GraphQL API when a RESTful one will suffice. A RESTful API is very simple to set up, and uses standard browser APIs to function (fetch, HTTP requests/responses). Not to mention, each component can call the API independently, allowing me to access data on an as-needed basis (whereas in a GraphQL API I would need to plop everything into the main load function to gain the benefits of using GraphQL). No new, fancy technologies are required, and this allows me to test the code much easier without having to jump through a bunch of hoops to get tests working.

5. Rows of columns vs Columns of rows

   - While designing the API, I came across a problem: How should I structure the user data? Should the user have a `Column` field, and each column have a `Row[]` field to keep track of the data? Or should the user have a `Row` field, and each row has many `Column`s? My decision is the first option, where a user has many columns, and each column has many rows. For one, this makes it easier to add new columns (in a future sprint), because they're being added directly to the user instead of having to trace through each row object to update it. I also find that it is easier for me to process and understand the columns of rows structure rather than the rows of columns structure. For these reasons, I will be designing a columns of rows structure.

6. Testing code on the API side

   - Sveltekit's API solution does a lot of things well, but one of the things it doesn't do well is testing. It absorbs my code into the framework specific jargon, and it doesn't let me test my code in a normal environment. To overcome this limitation, I decided to create an abstract class to handle API routes. This class will sit next to whatever sveltekit is doing, providing an easy way for me to access my code. It will be able to perform dependency injection with the prisma client, allowing me to mock it easily. It will also come with a basic API endpoint that I can re-export from the +server.ts file, and all this endpoint will do is call the functionality and return whatever it gave, almost like a translator between my code and the sveltekit code. This is all in the name of improving testability of my backend.

7. Type system

   - To maintain consistency throughout the API, I'm deciding to add a type system. It will have return types for everything, like a Column, a Row, historical data, etc. The idea behind this is that once everything has a type, then I am forced to be consistent about how I return data, and consistency will create a better experience for myself when I write the frontend

8. Mocking the database
   - Best practices say that you should mock your database during testing in order to have complete isolation; if your database is unmocked, there's a chance your tests are failing because of a database issue rather than an issue in your code. I have decided to ignore this advice and run tests directly against the database. I decided this for a few reasons, the biggest of which being advanced testing. A mock of the PrismaClient only gets so far: you can't actually manipulate data because the functionality of the mock to store data has been removed. You are limited to simple queries, and you can't perform CRUD operations and then measure an effect of that operation in the database, because the data doesn't exist. It is also much easier to seed data without having to deal with the restrictions of a mock. The data is real, it's not fake and you don't have to bend over backwards to make it look real.
