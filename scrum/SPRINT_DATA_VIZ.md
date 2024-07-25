#### SPRINT DUE: 6/10/24

# View past data represented in a bar/line graph

#### Objectives

Have a graph view available that can show you your progress/scores visually over the course of whatever time period you select. Graphs should be available for every column in your spreadsheet, as well as a graph for the overall score. You can toggle between different styles of graph, such as bar, line, histogram, and others.

- [x] Add an API route to show column data in a table.
- [x] Add a secondary API route to show productivity score data in a table
- [ ] Add a database model `Graph`, which will contain the preferences on which data you want represented in a graph. You can have multiple graphs (up to 3). Graphs are rendered on the client side, this model simply stores metadata (column to create graph for, type of graph (bar, histo, etc.), color scheme) and connects this metadata to the User so that they are shown it and so that they can have multiple graphs
- [ ] Add API routes (authenticated) for CRUD operations on Graphs
- [ ] Add pinned graphs to the UI
- [x] Modify the API route in task 1 to take an argument for the time period that the data should be returned for (i.e 1 week, 1 month, 1 year, All time)
- [x] Use a library like D3.js or similar to render graphs on the client side.
