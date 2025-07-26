/*
MagicMirror Module: MMM-SzczecinZDITM
Displays real-time departure information for Szczecin public transport using ZDiTM Szczecin API.

Author: Adapted from MMM-CracowMPK and MMM-SzczecinMPK
*/

Module.register("MMM-SzczecinZDITM", {
    defaults: {
        updateInterval: 30 * 1000, // 30 seconds
        maxDepartures: 5,
        stopId: null,            // Numeric ID of the stop
        stopName: "",            // Optional display name
        lineNumber: null,        // Specific line to filter
        apiKey: "",
        apiBase: "https://www.zditm.szczecin.pl/api/v1/departures",
        stopsApi: "https://www.zditm.szczecin.pl/api/v1/stops"
    },

    getStyles: function() {
        return [this.name + ".css"];
    },

    start: function() {
        this.loaded = false;
        this.departures = [];
        this.fetchStops();
        this.scheduleUpdate(0);
    },

    fetchStops: function() {
        var self = this;
        fetch(this.config.stopsApi)
            .then(response => response.json())
            .then(data => {
                if (!self.config.stopId && data.length) {
                    self.config.stopId = data[0].id;
                    self.config.stopName = data[0].name;
                } else if (!self.config.stopName) {
                    var found = data.find(s => s.id === self.config.stopId);
                    if (found) self.config.stopName = found.name;
                }
                self.loaded = true;
                self.updateDom();
            })
            .catch(error => console.error("[MMM-SzczecinZDITM] Error fetching stops:", error));
    },

    fetchDepartures: function() {
        var self = this;
        if (!this.config.stopId) return;
        var url = `${this.config.apiBase}?stopId=${this.config.stopId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // filter by lineNumber if set
                var list = data;
                if (self.config.lineNumber) {
                    list = list.filter(d => d.line == self.config.lineNumber.toString());
                }
                self.departures = list.slice(0, self.config.maxDepartures);
                self.updateDom();
            })
            .catch(error => console.error("[MMM-SzczecinZDITM] Error fetching departures:", error));
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "mpk";

        if (!this.loaded) {
            wrapper.innerHTML = "Ładowanie danych...";
            return wrapper;
        }
        if (this.departures.length === 0) {
            wrapper.innerHTML = "Brak odjazdów";
            return wrapper;
        }

        var header = document.createElement("div");
        header.className = "mpk__header-wrapper";
        var title = this.config.stopName || this.config.stopId;
        var lineInfo = this.config.lineNumber ? `, linia ${this.config.lineNumber}` : "";
        header.innerHTML = `<div class="mpk__header">Przystanek: ${title}${lineInfo}</div>`;
        wrapper.appendChild(header);

        this.departures.forEach(dep => {
            var item = document.createElement("div");
            item.className = "mpk__item";
            item.innerHTML = `<span class="mpk__line-number">${dep.line}</span> ${dep.departureTime}`;
            wrapper.appendChild(item);
        });
        return wrapper;
    },

    scheduleUpdate: function(delay) {
        var nextLoad = typeof delay === "number" && delay >= 0 ? delay : this.config.updateInterval;
        setTimeout(() => {
            this.fetchDepartures();
            this.scheduleUpdate();
        }, nextLoad);
    }
});
