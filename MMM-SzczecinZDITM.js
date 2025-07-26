/*
MagicMirror Module: MMM-SzczecinZDITM
Displays real-time departure information for Szczecin public transport using ZDiTM Szczecin API.

Author: Adapted from MMM-CracowMPK and MMM-SzczecinMPK
*/

Module.register("MMM-SzczecinZDITM", {
    defaults: {
        updateInterval: 30 * 1000, // 30 seconds
        maxDepartures: 5,
        stopId: null,          // Numeric ID of the stop
        apiKey: "",
        apiBase: "https://www.zditm.szczecin.pl/pl/zditm/dla-programistow/api-tablice-odjazdow",
        stopsApi: "https://www.zditm.szczecin.pl/pl/zditm/dla-programistow/api-przystanki"
    },

    // Load CSS
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
                self.departures = data.slice(0, this.config.maxDepartures);
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
        header.innerHTML = `<div class=\"mpk__header\">Przystanek: ${this.config.stopId}</div>`;
        wrapper.appendChild(header);

        this.departures.forEach(dep => {
            var item = document.createElement("div");
            item.className = "mpk__item";
            item.innerHTML = `<span class=\"mpk__line-number\">${dep.line}</span> ${dep.departureTime}`;
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