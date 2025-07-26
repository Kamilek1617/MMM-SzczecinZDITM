/*
MagicMirror Module: MMM-SzczecinZDITM
Displays real-time departure information for multiple Szczecin stops using ZDiTM Szczecin API.

Author: Final no-CORS version
*/

Module.register("MMM-SzczecinZDITM", {
    defaults: {
        updateInterval: 30000,
        maxDepartures: 5,
        stops: [], // Manual stops only
        apiBase: "https://www.zditm.szczecin.pl/api/v1/departures"
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
            var url = `${this.config.apiBase}?stopId=${stop.id}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    var list = data;
                    if (stop.line) {
                        list = list.filter(d => d.line == stop.line.toString());
                    }
                    self.departures[stop.id] = list.slice(0, self.config.maxDepartures);
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

            var deps = this.departures[stop.id] || [];
            if (deps.length === 0) {
                var empty = document.createElement("div");
                empty.className = "mpk__no-deps";
                empty.innerHTML = "Brak odjazdów";
                section.appendChild(empty);
            } else {
                deps.forEach(dep => {
                    var item = document.createElement("div");
                    item.className = "mpk__item";
                    item.innerHTML = `<span class="mpk__line-number">${dep.line}</span> ${dep.departureTime}`;
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
