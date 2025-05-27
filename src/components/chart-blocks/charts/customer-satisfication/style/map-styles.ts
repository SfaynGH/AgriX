export const mapStyles = [
  {
    // Emerald theme
    name: "emerald",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    options: {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    },
    customCSS: `
      .leaflet-control-zoom a {
        background-color: white !important;
        color: #333 !important;
        border-color: #e2e8f0 !important;
      }
      .leaflet-control-zoom a:hover {
        background-color: #f8fafc !important;
      }
      .leaflet-control-attribution {
        background-color: rgba(255, 255, 255, 0.7) !important;
        color: #64748b !important;
        font-size: 10px !important;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 0.375rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
      .leaflet-popup-tip {
        background-color: white !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
    `,
  },
  {
    // Dark theme
    name: "dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    options: {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    },
    customCSS: `
      .leaflet-control-zoom a {
        background-color: #1e293b !important;
        color: #e2e8f0 !important;
        border-color: #334155 !important;
      }
      .leaflet-control-zoom a:hover {
        background-color: #334155 !important;
      }
      .leaflet-control-attribution {
        background-color: rgba(30, 41, 59, 0.7) !important;
        color: #94a3b8 !important;
        font-size: 10px !important;
      }
      .leaflet-popup-content-wrapper {
        background-color: #1e293b !important;
        color: #e2e8f0 !important;
        border-radius: 0.375rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
      .leaflet-popup-tip {
        background-color: #1e293b !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
    `,
  },
  {
    // Blueprint theme
    name: "blueprint",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    options: {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    },
    customCSS: `
      .leaflet-control-zoom a {
        background-color: white !important;
        color: #333 !important;
        border-color: #e2e8f0 !important;
      }
      .leaflet-control-zoom a:hover {
        background-color: #f8fafc !important;
      }
      .leaflet-control-attribution {
        background-color: rgba(255, 255, 255, 0.7) !important;
        color: #64748b !important;
        font-size: 10px !important;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 0.375rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
      .leaflet-popup-tip {
        background-color: white !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
    `,
  },
  {
    // Emerald custom
    name: "emerald-custom",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    options: {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
      className: "emerald-map-tiles",
    },
    customCSS: `
      .emerald-map-tiles {
        filter: hue-rotate(120deg) saturate(0.8) !important;
      }
      .leaflet-control-zoom a {
        background-color: white !important;
        color: #333 !important;
        border-color: #e2e8f0 !important;
      }
      .leaflet-control-zoom a:hover {
        background-color: #f8fafc !important;
      }
      .leaflet-control-attribution {
        background-color: rgba(255, 255, 255, 0.7) !important;
        color: #64748b !important;
        font-size: 10px !important;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 0.375rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
      .leaflet-popup-tip {
        background-color: white !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
    `,
  },
]

