import logo from "./logo.svg";
import "./App.css";
import { useState, Fragment } from "react";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

const App = () => {
  const apps = [];
  var appConfig = {};
  var keyMappings = {};

  appConfig["name"] = "App 1";
  appConfig["searchURL"] = "https://api.github.com/users/ejirocodes/followers";
  appConfig["path"] = ["data"];
  keyMappings["url"] = "followers_url";
  keyMappings["text"] = "url";
  keyMappings["title"] = "login";
  appConfig["mapping"] = keyMappings;
  apps.push(appConfig);

  appConfig = {};
  keyMappings = {};
  appConfig["name"] = "App 2";
  appConfig["searchURL"] = "https://api.github.com/users/ejirocodes/followers";
  appConfig["path"] = ["data"];
  keyMappings["url"] = "html_url";
  keyMappings["title"] = "type";
  keyMappings["text"] = "url";

  appConfig["mapping"] = keyMappings;
  apps.push(appConfig);

  const [followers, setFollowers] = useState([]);
  const [followings, setFollowing] = useState([]);

  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [loadedResults, setLoadedResults] = useState(false);

  const traverseResponse = (data, path) => {
    if (path.length === 1) {
      return data[path[0]];
    } else {
      return traverseResponse(data[path[0]], path.splice(1));
    }
  };

  const performSearch = () => {
    // const targetURLs = apps.map((app) => { return app.searchURL.format(search) })

    // axios.get()
    setLoadedResults(false);
    Promise.all(apps.map((app) => axios.get(app.searchURL)))
      .then((data) => {
        data.map((results, index) => {
          results = traverseResponse(results, apps[index].path);
          results = results.slice(0, 5);
          const res = results.map((o) => {
            return {
              source: apps[index].name,
              title: o[apps[index].mapping.title],
              url: o[apps[index].mapping.url],
              text: o[apps[index].mapping.text],
            };
          });
          setSearchResults([...searchResults, ...res]);
        });
      })
      .catch((e) => {
        console.log("Failed due to ", e);
      })
      .finally(() => {
        console.log("Finally ", searchResults);
        setLoadedResults(true);
      });
  };

  const showSearchResult = (item) => {
    return (
      <div>
        <a href={item.url} target="_blank">
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={item.source}
              secondary={
                <Fragment href={item.url}>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {item.title}
                  </Typography>
                  {item.text}
                </Fragment>
              }
            />
          </ListItem>
        </a>
        <Divider variant="inset" component="li" />
      </div>
    );
  };

  return (
    <div className="App">
      <h1> All In One </h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={performSearch}>Search</button>
      {loadedResults && (
        <List
          sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}
        >
          {searchResults.map((item) => {
            return showSearchResult(item);
          })}
        </List>
      )}
    </div>
  );
};

export default App;
