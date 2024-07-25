#### SPRINT DUE: 5/25/24

#### SPRINT FINISHED: 6/2/24

# Current Sprint: New Columns

#### Objectives

- [x] Add a `type` field to `Column`, which will determine the type of column it is (additive, subtractive, multiplicative, divisive)
- [x] Add a `factor ` field, which will determine the factor by which your score changed (ex. factor of 2 means that you get 2 added to your score for every one extra on the column). Default is 1.
  - For multiplicative columns, the factor works like a percent increase. The factor + 1 is equal to the value you multiply by. This means that, by default, multiplicative columns multiply by 2. In the ui, the multiplied value should be shown (e.g 2x, 3x, 4x)
- [x] Add a `threshold` field, which will determine the number that you must have in order to gain the factor. A value of -1 means that the threshold is your best score; you have to improve your best in order to gain the multiplier (this is calculated from historical data).
- [x] Add a `stackable` field, which dtermines if you can continue scoring after you exceed your threshold. Whether or not the effect of the column "stacks".
- [x] Add an API route to dynamically calculate the score, given all the columns. This will take into account all the columns you currently have, and what type each of those columns is. It will return a single number as the score
- [x] Implement a modification tooltip/dropdown for each column, which will let you change the settings of a column (change type, threshold, factor, etc)
- [x] Implement an API route to delete a column, given its ID. This can be part of the modification dropdown
- [x] Update the column creation form to include options for type, factor, and threshold

Design Reasoning:

1. Abstract class `ColumnScoreCalculator`
   - After adding the new customization fields to the `Column` record, I realized that calculating score would be a lot harder than I previously thought. There were many things to keep track of, including type, factor, threshold, and stackability. While it is technically possible to handle all of this within a single function, this would lead to an if-else nightmare. This clearly can't be the solution; it's unmaintainable and cancer to write. While seperating functionality into multiple functions might have worked, I opted for the OOP-based approach of using classes and inheritance to reduce the complexity of the code and split it into reusable chunks that can then be extended and modified. To this end, I created an abstract class called ColumnScoreCalculator. The class is inherited by each of the operations (AdditiveScoreCalculator, SubtractiveScoreCalculatr, etc) and each implements the abstract method "getScoreImpactFunction", a higher-order method that determines the change in score given a change in the column. I made it a higher order method to allow for stackability. The idea is that if the column is stackable, the function would simply be called repeatedly.
