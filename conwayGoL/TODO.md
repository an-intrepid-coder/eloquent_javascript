# TODO list for web-based Conway's Game of Life (in no particular order):

* Variable height/width
* Buttons to set grid to interesting known seeds, such as glider guns.
* implement Iterable interface for LifeGrid)
* Back/Reverse functionality/buttons.
* Use localStorage to preserve on refresh/reload
* Some kind of unit testing. 
* Modularize into a proper web page using later book projects as a template
* Update to use the canvas and be zoomable/scalable.
* Buttons to control animation speed
* Better page styling and colors (better yet, customizable)

# BUGS:

* Occasional inaccuracies can be observed when manually setting cells to alive/dead. For example, creating a fleet of Gliders after clearing the grid leads to many of them self-destructing rather than assuming the repeating pattern that is expected. Investigation ongoing.

