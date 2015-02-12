# bc-workshop
Community mapping tools and services

## Installation Instructions

Install dependencies
```
bower install
```

## tiles.js
The bcWorkshop map uses Mapbox tiles. To add your own tiles to the map, create a file called tiles.js with the contents:
```
var tileAddress = 'https://{s}.<tile-server>/{z}/{x}/{y}.png?<parameters>';
```
or just replace the `tileAddress` variable in main.js.

## Client Functions

### init
- Create session ID
- `init_map()`
- `setup_events()`
- `resize()`

### init_map
- Load tiles
- Set bounds

### setup_events
- Add a few click listeners for UI events
- Form submit for naming

### new_neighborhood
- Show drawing tools

### draw_start
- Show clear / delete buttons
- If current neighborhood exists, `clear_neighborhood()`

### clear_neighborhood
- Javascript confirm box
- On success, clear polygon and `reset_ui`

### finish_draw
- Hide drawing tools
- Show clear / name grouping

### reset_ui
- Returns UI buttons back to initial state

### name_neighborhood
- Display lightbox form

### neighborhood_submit
- Submit POST form
- Display loading screen
- On success, display success screen
