import EventsPage from "./components/EventsPage.js";
import PeoplePage from "./components/PeoplePage.js";
import Route from "./models/Route.js";
import Anchor from "./models/Anchor.js";
import ConfigPage from "./components/ConfigPage.js";
import EditPersonPage from "./components/EditPersonPage.js";
import EventPage from "./components/EventPage.js";

export const routes = {
    config: new Route("/config", ConfigPage),
    events: new Route("/events", EventsPage).withAlias("/"),
    event: new Route("/attend/:eventId", EventPage),
    people: new Route("/people", PeoplePage),
    person: new Route("/person/:personId?", EditPersonPage),
};

Object.keys(routes).forEach((name) => routes[name].name = name);

export const mainNav = [routes.events, routes.people, routes.config]
    .map((route) => new Anchor(
        route.toString(),
        route.name.toUpperCase(),
        route.name.slice(0, 1).toUpperCase())
    );

export default new VueRouter({
    routes: Object.values(routes)
});
