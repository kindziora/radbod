
<p align="center">
  <img alt="Radbod Logo" src="https://raw.githubusercontent.com/kindziora/radbod/master/logo.png?token=AADL3M6H3J2GJAY6HPB3EN3AKHPN2">
</p>
Minimalstic ES2015 MVVM Framework with zero dependencies. Just ~20KB.

## features

- build components
- use State management
- use SSR
- it's isomorphic
- progressive usage
- simple + performant + small
- no dependencies

## example apps
[create a radbod project](https://github.com/kindziora/create-radbod-project)


## workflow

1. `npm install radbod`
2. you have a HTML template `<html>...<div>hello</div>...`
3. add your ES2015 templating syntax `<html>...<div>hello ${messages.greeting[3]}</div>...`
4. create a html_loader 
5. run the server `node server/run.js "path/to/html_loader"
6. see page via http://localhost:8080/
   
## create own html_loader

The html_loader defines how you load the html regarding to the requested route.
An Example behavior for a html_loader:

expects a Route:

`http://localhost:8080/user/123` 


load:

`path/to/project/layout/base.html`

`path/to/project/sites/user/userprofile.html`

`path/to/project/sites/user/userprofile.css -->inlined`

`path/to/project/sites/user/userprofile.js -->inlined`

returns:

`{ data: "HTML FULL PAGE CONTENT" }`
