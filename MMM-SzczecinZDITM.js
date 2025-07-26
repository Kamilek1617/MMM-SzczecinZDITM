/*
MagicMirror Module: MMM-SzczecinZDITM
Displays real-time departure info from ZDiTM Szczecin using departure boards API.
*/

Module.register("MMM-SzczecinZDITM", {
    defaults: {
        updateInterval: 60000,
        maxDepartures: 5,
        stops: [],
        apiBase: "https://www.zditm.szczecin.pl/api/v1/displays/"
    },

    getStyles: function () {
        return [this.name + ".css"];
    },

    start: function () {
        this.loaded = true;
        this.departures = [];
        this.scheduleUpdate(0);
    },

    fetchDepartures: function () {
        var self = this;
        let mergedDepartures = [];
        let stopsProcessed = 0;

        this.config.stops.forEach(stop => {
            const url = `${this.config.apiBase}${stop.number}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    let departures = data.departures || [];
                    if (stop.line) {
                        departures = departures.filter(d => d.line_number == stop.line.toString());
                    }
                    departures.forEach(d => {
                        d.stopName = stop.name;
                        d.stopNumber = stop.number;
                        d.lineFilter = stop.line;
                    });
                    mergedDepartures = mergedDepartures.concat(departures);
                    stopsProcessed++;

                    if (stopsProcessed === self.config.stops.length) {
                        mergedDepartures.sort((a, b) => {
                            const aTime = a.time_real ?? parseInt(a.time_scheduled?.split(':')[0]) * 60 + parseInt(a.time_scheduled?.split(':')[1]);
                            const bTime = b.time_real ?? parseInt(b.time_scheduled?.split(':')[0]) * 60 + parseInt(b.time_scheduled?.split(':')[1]);
                            return aTime - bTime;
                        });

                        self.departures = mergedDepartures.slice(0, self.config.maxDepartures);
                        self.updateDom();
                    }
                })
                .catch(err => console.error("[MMM-SzczecinZDITM] Error fetching departures:", err));
        });
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "mpk-multi";

        if (!this.loaded) {
            wrapper.innerHTML = "Ładowanie danych...";
            return wrapper;
        }

        if (!this.departures.length) {
            wrapper.innerHTML = "Brak odjazdów";
            return wrapper;
        }

        var directionHeader = document.createElement("div");
        directionHeader.className = "mpk__header-wrapper";
        directionHeader.innerHTML = `<div class="mpk__header">Kierunek: ${this.departures[0].direction}</div>`;
        wrapper.appendChild(directionHeader);

        this.departures.forEach(dep => {
            var item = document.createElement("div");
            item.className = "mpk__item";
            const when = dep.time_real
                ? `${dep.time_real} min`
                : (dep.time_scheduled || "brak danych");
            const line = dep.line_number;
            item.innerHTML = `<span class="mpk__line-number line-${line}">${line}</span> z ${dep.stopName} – ${when}`;
            wrapper.appendChild(item);
        });

        return wrapper;
    },

    scheduleUpdate: function (delay) {
        var next = typeof delay === "number" && delay >= 0 ? delay : this.config.updateInterval;
        setTimeout(() => {
            this.fetchDepartures();
            this.scheduleUpdate();
        }, next);
    }
});
