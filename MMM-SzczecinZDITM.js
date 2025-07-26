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
        this.departures = {};
        this.scheduleUpdate(0);
    },

    fetchDepartures: function () {
        var self = this;
        this.config.stops.forEach(stop => {
            const url = `${this.config.apiBase}${stop.number}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    let departures = data.departures || [];
                    if (stop.line) {
                        departures = departures.filter(d => d.line_number == stop.line.toString());
                    }
                    self.departures[stop.number] = departures.slice(0, self.config.maxDepartures);
                    self.updateDom();
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

        if (!this.config.stops.length) {
            wrapper.innerHTML = "Brak skonfigurowanych przystanków";
            return wrapper;
        }

        this.config.stops.forEach(stop => {
            var section = document.createElement("div");
            section.className = "mpk__section";

            var header = document.createElement("div");
            header.className = "mpk__header-wrapper";
            var lineInfo = stop.line ? `, linia ${stop.line}` : "";
            header.innerHTML = `<div class="mpk__header">${stop.name}${lineInfo}</div>`;
            section.appendChild(header);

            var deps = this.departures[stop.number] || [];
            if (deps.length === 0) {
                var empty = document.createElement("div");
                empty.className = "mpk__no-deps";
                empty.innerHTML = "Brak odjazdów";
                section.appendChild(empty);
            } else {
                deps.forEach(dep => {
                    var item = document.createElement("div");
                    item.className = "mpk__item";
                    const when = dep.time_real
                        ? `${dep.time_real} min`
                        : (dep.time_scheduled || "brak danych");
                    item.innerHTML = `<span class="mpk__line-number">${dep.line_number}</span> ${dep.direction} – ${when}`;
                    section.appendChild(item);
                });
            }
            wrapper.appendChild(section);
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
