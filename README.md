# kuomu

Small web app for finding the closest free Puuilo trailers, as the rental sites don't have a nice interface for just finding the closest free trailer, but require you to click through each store and then the trailer options in that store.

## Features

- Map with your location, all stores and their free capacity
  - Clicking takes to store rental site
- List with all free trailers, complete with trailer images and names, sorted by distance to store
  - Clicking a trailer name takes to that trailer's rental site
- Date picker, affects both map marker numbers and list
- City selector, zooms map into location and closest store and re-orders the list based on distance
- Button to use your location (city)

<img src="https://i.imgur.com/ZdPUSuL.png" width="49%"/>
<img src="https://i.imgur.com/FXesJPz.png" width="49%"/>

## Todo

- Split `usePuuiloStores` into multiple parts which do not make the user wait for all details to be loaded
  - Load stores -> show in list -> load locations -> draw empty markers onto map -> load free slots -> fill the numbers
- Re-brand as Guomu
- Make it look less engineer-y

<a href="https://www.flaticon.com/free-icons/truck" title="truck icons">Trailer icons created by Freepik - Flaticon</a><br>
<a href="https://www.flaticon.com/free-icons/gps" title="gps icons">Gps icons created by bqlqn - Flaticon</a><br>
<a href="https://www.flaticon.com/free-icons/location" title="location icons">Location icons created by IconMarketPK - Flaticon</a>
