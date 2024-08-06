# Time Tracker App

This app will be able to log your time in both work and not work, being able to adapt flexibly to whatever your schedule is. It operates similar to my google sheet, calculating metrics and giving long term data that can be used to optimize your routine.

## User stories

#### Add data: FINISHED

The user should be able to add data into the application. This data should be addable to any of the columns, but only for today. This data can be edited on the same day, but if the day you're trying to edit is not today, it shouldn't let you add it.

1. Implement a `Row` model in the database, with a field `stats` of type `Column[]`, and another field for the date
2. Implement a simple `Column` model in the database, with a single field containing the statistic
3. Create a graphQL resolver, that creates the Column for a row, given the statistic.
4. Implement a front-end form interface that sends a request to the resolver and creates the record.
5. Implement a check to make sure that the date you are updating is actually today, and prevent updates if they are updating a prior date's metrics.

#### Create new columns/trackers with additive, subtractive, multiplicative, and divisive effects on the productivity score: FINISHED

Have a column/statistic called "productivity score", which is calculated based on all the columns you have in your sheet. Different columns can be added, and data can be recorded in them. Furthermore, each column can have a different effect on the productivity score. For instance, if you're tracking a negative habit that you want to break, you could add a divisive column, which will divide your productivity score by a certain factor if you perform exceed the threshold (which you can configure). This same behavior is available for multiplicative columns as well, with a multiplier instead of a divisor. If you're tracking a positive habit, like lines of code written, you can create an additive column that will add a certain amount to the productivity score for every increase. This is the same behavior as the subtractive column, which subtracts instead of adds.

1. Add a `type` field to `Column`, which will determine the type of column it is (additive, subtractive, multiplicative, divisive)
2. Add a `factor ` field, which will determine the factor by which your score changed (ex. factor of 2 means that you get 2 added to your score for every one extra on the column). Default is 1.
   - For multiplicative columns, the factor works like a percent increase. The factor + 1 is equal to the value you multiply by. This means that, by default, multiplicative columns multiply by 2. In the ui, the multiplied value should be shown (e.g 2x, 3x, 4x)
3. Add a `threshold` field, which will determine the number that you must have in order to gain the factor. A value of -1 means that the threshold is your best score; you have to improve your best in order to gain the multiplier (this is calculated from historical data).
4. Add an API route to dynamically calculate the score, given all the columns. This will take into account all the columns you currently have, and what type each of those columns is. It will return a single number as the score

#### User Authentication: FINISHED

Have user authentication to allow people other than me to use the site and have data tailored to them. This provides security and privacy, as well as the ability to customize your own system.

1. Add an auth provider like Auth.js or similar
2. Extend the current APIResponseTestable abstract class to allow for authentication per route
3. Add login and signin pages, as well as a protected route on the main page to ensure that users are signed in
4. Update existing API routes to use authentication where needed
5. Add an API route that returns the current user, to be used for front-end checking if you are signed in

#### Edit past data

If there is a blank spot in past records, you should be able to go back and update them with the correct value. This overrides the rule that you can't edit past records. This only happens if there is a blank spot in the data, as in, you didn't fill out the sheet with that specific stat at the time.

#### View past data represented in a bar/line graph: DONE

Have a graph view available that can show you your progress/scores visually over the course of whatever time period you select. Graphs should be available for every column in your spreadsheet, as well as a graph for the overall score. You can toggle between different styles of graph, like bar, line, histogram, and others.

1. Add an API route to show column data in a table.
2. Add a secondary API route to show productivity score data in a table
3. Add a database model `Graph`, which will contain the preferences on which data you want represented in a graph. You can have multiple graphs (up to 3). Graphs are rendered on the client side, this model simply stores metadata (column to create graph for, type of graph (bar, histo, etc.), color scheme) and connects this metadata to the User so that they are shown it and so that they can have multiple graphs
4. Add API routes (authenticated) for CRUD operations on Graphs
5. Modify the API route in task 1 to take an argument for the time period that the data should be returned for (i.e 1 week, 1 month, 1 year, All time)
6. Use a library like D3.js or similar to render graphs on the client side.

#### Blog for productivity tips

Have a help center that has articles on ways to improve your productivity scores and using the system well, incorporating knowledge that I gained through my PKM system. The blog should be part of the website (as in, not just a static markdown blog), and should have an interface for admins to add articles, while also having a comments section.

#### Setting target productivity scores for a day/week/month: DONE

The user is able to set target productivity scores for a given day, week, or month. For a week or month, the target represents the total score from every day in that period. Target scores appear next to the input for the actual score, or more discreetly for week and month long periods. These scores serve no purpose other than to motivate the user into following the system they have set up.


#### User-controlled forum space for discussion and help 

Users can access the forum space to discuss each other's personal progress/setbacks. They can exchange tips in a similar way to the blog, but from user to user rather than staff to user. Forum's open the door to more authentic communication between users and perhaps will lead to greater retention as they gain more knowledge about the system 
