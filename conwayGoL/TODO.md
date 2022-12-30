# TODO list for web-based Conway's Game of Life (in no particular order):

* Preserve state when scale is changed
* color picker instead of calls to prompt() for BG/FG Color buttons
* Sliders for speed/scale instead of buttons
* Implement the optimization from Wikipedia that automatically skips cells it knows won't be updated.
* click-and-drag toggling of multiple cells
* Set/Save seeds in localStorage
* Button for **fleets** of duelling gliders 
* user input # for duelling gliders.
* implement Iterable interface for LifeGrid)
* Back/Reverse functionality/buttons (all the way back probably, via saved seed states)
* Use localStorage to preserve state on refresh/reload
* Some kind of unit testing. 
* Make into a proper web page using later book projects as a template
* A little more styling.
* auto-detect when the sim is at or close to its finished state (including checks for long-period oscillators)

# BUGS:

* Handle cancelled prompts more cleanly
* Switch some of the checkboxes to custom buttons which behave more consistently in edge cases.

