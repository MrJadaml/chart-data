Exercise:

Attached is sample sensordata for about a week's worth of data, representative of the type of data we get in the wild (warts, gaps and all).  It is in a format that you should be able to import directly into a Mongo DB.

If you're not familiar with Mongo, these two references should get you up and running quickly:
Install: https://treehouse.github.io/installation-guides/mac/mongo-mac.html
Import: https://docs.mongodb.com/getting-started/shell/import-data/

The data consists of a single reading for a single type of sensor.

Each row contains some important properties:
'room': physical space the sensor is located in
'title': the type of sensor ('temperature', 'humidity', etc)
'value': contains the actual reading
'timestamp': time at which reading was collected

Your assignment (assuming you have already accepted) is to build a simple API in NodeJS that exposes a single endpoint:

GET /chartdata

It takes three required arguments,
- 'room'
- 'start_date'
- 'title'

And one optional,
- 'length' in hours, defaulting to 72 if not specified

It returns a data series, that can be plotted directly on one line corresponding to the mean of the chosen room over a 10 minute period.  So for the default period of 72 hours, it should return 432 items to plot... in the ideal case.  However there are likely gaps in the data, and something to consider is how you would handle those cases.

The results should provided an array in the form of [{timestamp: "2017...", value: 0.43}]

The project should support 'npm start', 'npm test'

I would encourage you to think of this from a test-driven development standpoint.  The code will be judged in order of the following criteria:
a) test coverage and testability, error handling
b) performance
c) general readability, extensibility, etc.

Out of scope:
a) security concerns - for the purpose of this exercise don't worry about authentication
b) changing / optimizing DB schema, though if you do recommend/require specific indices to be created please note that

As I mentioned the answer should be provided in the from of a NodeJS project but you can use whatever testing framework you prefer, along with whatever flavor of JS (eg. ES2105).
