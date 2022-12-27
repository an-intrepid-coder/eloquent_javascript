# TODO list for web-based Conway's Game of Life (in no particular order):

* separate JS and CSS in to separate files.
* Button that lets user input # of gens
* Variable height/width
* implement Iterable interface for LifeGrid)
* Back/Reverse functionality/buttons (how far back? to be determined)
* Use localStorage to preserve state on refresh/reload
* Some kind of unit testing. 
* Make into a proper web page using later book projects as a template
* A little more styling.
* Update to use the canvas <-- Soon!
* Zoomable/Scaleable
* Buttons to control animation speed
* Implement the optimization from Wikipedia that automatically skips cells it knows won't be updated.

# BUGS:

* Occasional inaccuracies can be observed when manually setting cells to alive/dead. For example, creating a fleet of Gliders after clearing the grid leads to many of them self-destructing rather than assuming the repeating pattern that is expected. I think this is something to do with the checkbox logic and not with the GoL implementation at this point, because it seems to be deterministic from a given seed when not manually checked/unchecked. Investigation ongoing. 

