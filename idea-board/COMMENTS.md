# Developer Comments

Went as hard as I could to get the coverage up, 
get all the requirements in `README.md` done,
and go for a stretch (localStorage save).

Total time was just a little over 3 hours.

The `<App />` component serves as a parent for `<Card />`, updating a base state appropriately.
Didn't think it needed anything like Redux, and the context API would have only served it had
it needed more components. Kept it fairly simple so could also test `<Card />` in isolation, along with utils that needed it, too. 

Test coverage is at 100% and proptypes have been declared for child component.

## Areas for improvement, next steps:

1. Introduce a loading state so that it does not rely on `componentWillMount`, but didn't come back around to refactoring it.

2. Make it look a little better - used Bootstrap just to get stuff down and concentrate on the testing. There will no doubt be some optimization with overflow the more carsd there are, the textarea could do with some styling/height adjustments, and text in general could be fiddled around with more to give it more clarity. Syntactically, for accessibility purposes, it's tabbable and all aria tags and screenreader labels are included.

3. Move the sorting functions out into their own utilitiy file from App.js

4. Linting

5. Cypress to test all behavioural sets


## Installing caveats and create-react-app ejecting japes that would need ironing out:

1. `yarn test` throws up some handlebars noise 🤷 - but you can still scroll to the top and see the coverage.

2. installing dependencies on this ejected stack are kind of sketchy. ie. if you see something like this after installing/trying to test, blast the deps and reinstall:
`can't find module ... node_modules/jest-cli`

I have locked off a node engine in the package.json file just to be sure you install everything the same as me (v10.17.0) 👌

Thanks very much and hope you like it,
Harry