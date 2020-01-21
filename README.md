# kjs

Minimalstic ES2015 MVVM Framework with zero dependencies. Just ~20KB.

## gains and benefits

- build components
- use State management
- use SSR
- it's isomorphic
- progressive usage
- simple + performant + small
- no dependencies

## workflow

1. `npm install kjs`
2. you have a HTML template `<html>...<div>hello</div>...`
3. add your ES2015 templating syntax `<html>...<div>hello ${messages.greeting[3]}</div>...`
4. create a html_loader 
5. create a data_loader
6. run the server `node server/run.js "path/to/html_loader" "path/to/data_loader"`
7. see page via http://localhost:8080/

## create html_loader

The html_loader defines how you load the html regarding to the requested route.
An Example behavior for a html_loader:

expects a Route:

`http://localhost:8080/user/123` 

could load:

`path/to/project/layout/base.html`
`path/to/project/sites/user/viewprofile.html`
`path/to/project/sites/user/viewprofile.css -->inlined`
`path/to/project/sites/user/viewprofile.js -->inlined`

returns:

`HTML`

## create data_loader

data_loader defines how the data is loaded that will be available.
An Example behavior for a data_loader:

expects a Route:

`http://localhost:8080/user/123` 

could load:

`path/to/project/data/user/model_server.js ${getUser(13)} at nodeJS runtime executes DB query`
`path/to/project/data/user/model_client.js ${getUser(13)} at browser runtime, will make ajax requests`

returns:

`JAVASCRIPT`