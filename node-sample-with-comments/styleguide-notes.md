# Style Guide Review by Nils Whitmont <nils.whitmont@gmail.com>


### Section: Tabs for indentation
Agree.  Let's forget about this war and get on to using .editorconfig and
properly configured linting tools like ESLint.

### Section: Newlines
Agree. Always use linux-style newlines.

### Section: No trailing whitespace
Agree. thank goodness for linting tools! This is what they are for.

### Section: Use semicolons
Yes, yes, and yes definitely

### Section: 80 characters per line
Agree, keep lines short so there's no need for line wrap, & keeps things on
the screen at all times.

### Section: Use single quotes.
Agree.  I always do this except when formatting JSON.

### Section: Skip braces for single line
Agree.  allows for better readability of code during review phase.  Also
good to enforce this with .editorconfig/ESLint

### Section: Declare one variable per statement
Agree.  Seems simple to use multiple lines but turns out it makes it slower
to refactor later.  I prefer this style.

### Section: Do not universally use lowerCamelCase
This section is confusing. Is this what it's intended to say?  Seems like it
should say `Do use lowerCamelCase` because the 'Right' example uses
lowerCamelCase. So I'm going to refer to the example instead of the descriptive
text for all further review comments.
Edit: maybe I'm not reading this right since all the code examples do use
underscore style comments.  Or maybe that is part of the test.

### Section: UpperCamelCase for class names
Agree. Helps identify classes quickly.

### Section: Use uppercase for constants
Agree. standard industry practice.

### Section: Git branches are lowercase with dashes.
Agree with this section, but in the scenario of JIRA or GitHub issue linking to
commits, including the issue number can actually be useful in that it allows
JIRA/GitHub to link the commit to the issue and provide a link in the Web UI.
When I'm using JIRA with issue linking configured I use the following format:
`PROJ-123_summary-off-issue-intent` where `PROJ-123` is the JIRA number.

### Section: Object/Array creation
Agree - commas go at the end of line, not the beginning.  Seems like a
convenience to some, but I find it visually confusing and unnecessary.

### Section: Use the === operator
Agree. best practice to use this over `==` for better debugging info and
strict mode JS processing.

### Section: Use multi-line ternary operator
This section could use some clarification. It two things, so maybe provide
examples for both long and short conditions.

### Section: Using descriptive conditions
Yes, yes and yes.  You don't know how many times I have lectured folks about
I'm a stickler for meaningful and non-short variable names.

### Section: No singletons of factories
Agree.  This seems to be common among folks trying to turn JS into Java. I'm
not a fan of this practice.

### Section: Use callbacks instead of promises
Agree.  I'm not a big fan of promises and I prefer async/callbacks whenever
I'm writing new code. Async FTW!

### Section: Use dependency injection
Yes.

### Section: Refactor often
I am a true believer on this and I am always refactoring my code all the time.

### Section: Write small functions
Agree.  Keep It Simple Silly! KISS principle.

### Section: Don't repeat yourself
Never copy paste code. If you need to reuse code/functions, put it in a util
lib or external file and import/require it where you need it.

### Section: Return early from functions
Agree.  definitely avoid nesting if statements, your future self will thank
you.

### Section: Name anonymous functions
I'm so glad you brought this up! There is a tendency to use anonmous functions
in JS community as if it's this great thing.  Sure, it is possible, but when
building complex its important to consider maintainability and dubugging issues.
Naming functions has saved me time in tracing code paths and is essential for
complex enterprise grade applications.

### Section: Method chaining
Agree. Use proper indentation and one method per line for clarity.

### Section: Use slashes for comments
Agree in general although this I feel is personal preference and if there's
a standard should be enforced by .editorconfig or the like.  I do use multi
line comments when using JSDoc style comments for autogenerated docs.

### Section: Use JSDoc
Yes.

### Section: Object.freeze, Object.preventExtensions, Object.seal, with, eval
Agree. you don't need this stuff.

### Section: Requires at top
Always.

### Section: Getters and setters
Agree.

### Section:Do not extend built-in prototypes
Agree. Make a custom utils lib instead. Or use one of the many existing ones
(eg. lodash etc.) Plus with ES6/7 advanced features, a lot of the reason for
doing this is no longer an issue.

### Section: Avoid alert
Definitely.

### Section: No grids
Yep

### Section: Use semantic elements
Yep, very important for maintainability and debugging

### Section: Use semantic names
Agree, very much so.

### Section: Be minimal
Agree. KISS principle

### Section: Nested divs
Don't do this please!! totally unnecessary.
