import "aframe";
import "@ar-js-org/ar.js";
import "aframe-look-at-component";
import "aframe-osm-3d";
import "aframe-event-set-component";
import "aframe-mouse-cursor-component";

// Questions
// is this needed 'const url = new URL...' in serviceworker.js
//
// Notes
// 
//
// add attribution???
//<div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then((registration) => {
      console.log("Service Worker Registered successfully.");
    })
    .catch((e) => {
      console.error(`Service worker registration failed: ${e}`);
    });
} else {
  alert("Sorry, offline functionality not available, please update your browser!");
}

AFRAME.registerComponent("poifinder", {
  init: function () {
    this.camera = document.querySelector("[camera]");
    this.loaded = false;

    // Handling the GPS update
    window.addEventListener("gps-camera-update-position", (e) => {
      if (this.loaded === false) {
        this.el.setAttribute("terrarium-dem", {
          lat: e.detail.position.latitude,
          lon: e.detail.position.longitude,
        });
        document.getElementById("lon").innerHTML = "Longitude: " + e.detail.position.longitude.toFixed(10);
        document.getElementById("lat").innerHTML = "Latitude: " + e.detail.position.latitude.toFixed(10);
      }
    });

    // This event will fire when the OSM data has been downloaded.
    this.el.addEventListener("osm-data-loaded", (e) => {
      console.log("osm data loaded");

      e.detail.pois.forEach((poi) => {
        if (poi.properties.amenity == "cafe") {
          const cafeText = document.createElement("a-text");
          const coffee = document.createElement("a-entity");
          const cafeEntity = document.createElement("a-entity");

          cafeEntity.setAttribute("gps-projected-entity-place", {
            latitude: poi.geometry.coordinates[1],
            longitude: poi.geometry.coordinates[0],
          });

          coffee.setAttribute("gltf-model", "./assets/cap_of_coffee/scene.gltf");
          coffee.setAttribute("scale", "1 1 1");
          coffee.setAttribute("animation", {
            property: "rotation",
            to: "0 360 0",
            loop: true,
            dur: 6000,
          });

          cafeText.setAttribute("scale", "20 20 20");
          cafeText.setAttribute("look-at", "[gps-projected-camera]");
          cafeText.setAttribute("position", "0 30 0");
          cafeText.setAttribute("align", "center");
          cafeText.setAttribute("value", poi.properties.name || "Name missing");

          cafeEntity.appendChild(cafeText);
          cafeEntity.appendChild(coffee);

          if (poi.properties.website) {
            cafeEntity.setAttribute("clicker", { name: poi.properties.name, website: poi.properties.website });
          }

          this.el.sceneEl.appendChild(cafeEntity);
        } else if (poi.properties.amenity == "restaurant") {
          const restaurantText = document.createElement("a-text");
          const hotdog = document.createElement("a-entity");
          const restaurantEntity = document.createElement("a-entity");

          restaurantEntity.setAttribute("gps-projected-entity-place", {
            latitude: poi.geometry.coordinates[1],
            longitude: poi.geometry.coordinates[0],
          });

          hotdog.setAttribute("gltf-model", "./assets/hotdog/scene.gltf");
          hotdog.setAttribute("scale", "0.1 0.1 0.1");
          hotdog.setAttribute("rotation", "0 0 30");
          hotdog.setAttribute("animation", {
            property: "rotation",
            to: "0 360 30",
            loop: true,
            dur: 8000, //check with Nick on why the animation is not smooth
          });

          restaurantText.setAttribute("scale", "20 20 20");
          restaurantText.setAttribute("look-at", "[gps-projected-camera]");
          restaurantText.setAttribute("position", "0 30 0");
          restaurantText.setAttribute("align", "center");
          restaurantText.setAttribute("value", poi.properties.name || "Name missing");

          restaurantEntity.appendChild(restaurantText);
          restaurantEntity.appendChild(hotdog);

          if (poi.properties.website) {
            restaurantEntity.setAttribute("clicker", { name: poi.properties.name, website: poi.properties.website });
          }
          this.el.sceneEl.appendChild(restaurantEntity);
        } else if (poi.properties.amenity == "pub") {
          const pubText = document.createElement("a-text");
          const beer = document.createElement("a-entity");
          const pubEntity = document.createElement("a-entity");

          pubEntity.setAttribute("gps-projected-entity-place", {
            latitude: poi.geometry.coordinates[1],
            longitude: poi.geometry.coordinates[0],
          });

          beer.setAttribute("gltf-model", "./assets/beer_can/scene.gltf");
          beer.setAttribute("scale", "10 10 10");
          beer.setAttribute("animation", {
            property: "rotation",
            to: "0 360 0",
            loop: true,
            dur: 6000, //check with Nick on why the animation is not smooth
          });

          pubText.setAttribute("scale", "20 20 20");
          pubText.setAttribute("look-at", "[gps-projected-camera]");
          pubText.setAttribute("position", "0 30 0");
          pubText.setAttribute("align", "center");
          pubText.setAttribute("value", poi.properties.name || "Name missing");

          pubEntity.appendChild(pubText);
          pubEntity.appendChild(beer);

          if (poi.properties.website) {
            pubEntity.setAttribute("clicker", { name: poi.properties.name, website: poi.properties.website });
          }
          this.el.sceneEl.appendChild(pubEntity);
        }
      });
    });
  },
});
AFRAME.registerComponent("clicker", {
  schema: {
    name: {
      type: "string",
      default: "",
    },
    website: {
      type: "string",
      default: "",
    },
  },
  init: function () {
    this.el.addEventListener("click", (e) => {
      alert(`Opening "${this.data.name}" website with the following url: \n ${this.data.website}`);
      window.open(`${this.data.website}`);
    });
  },
});
