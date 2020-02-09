export const routes = {
    "home": "home",
    _not_found : "notFound"
};

export function getFile(path) {
    let pathCleaned = path.split("/").filter(e=>e.trim()!=="").join("/");

    for (let i in routes) {
        let file = routes[i];
        let rex = new RegExp(i, "ig");
        let match = pathCleaned.match(rex);
        if(match) {
            return file;
        }
    }
    return routes._not_found;
}