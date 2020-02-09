export const routes = {
    "home": "home",
    _not_found : "notFound"
};


export function getFile(path) {
    for (let i in routes) {
        let file = routes[i];
        let rex = new RegExp(i, "ig");
        let match = path.match(rex);
        if(match) {
            return file;
        }
    }
    return routes._not_found;
}