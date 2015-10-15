# Server-Side Unit Tests

This folder is for server-side unit tests only! If you need to
write a unit test, go to server/tests/integration.

Any file in this folder that is that fulfills the pattern *-test.js
will be run as a mocha test on call to the gulp 'test' task.

If you want to write a server-side unit test, follow the following
instructions. Suppose you want to test the class 'module',

1. Copy 'template.js' onto a file called 'module-test.js' by typing

    cp template.js module-test.js

2. Fill out the 'describe' block in template.js and duplicate it to create
more extensive tests if needed. Write at least one assertion inside each 'it'
block. Expressively name the 'describe' and 'it' blocks so that the rest of
us know what is being tested!

3. Run the gulp 'test' task to confirm that you have written a failing test:

    gulp test