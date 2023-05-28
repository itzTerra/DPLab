# [Double Pendulum Lab](https://itzterra.github.io/DPLab/)
A tool that can simulate double pendulums (and simple pendulums!) with **tons of customization**.  

It's primary purpose is **art** and **fun**, although the simulation is ***fairly* accurate** (computed with the Runge-Kutta method).   

The input constraints are lenient -- if you feed the simulator crazy numbers, it ***will*** break!  
> ***Tip**: Save the settings you don't want to lose as a preset before experimenting.*

### Features
- Generate as many pendulums as your computer can handle
- Single Pendulum support (by setting 2nd bob's Mass to zero)
- Configure the *Simulation Speed*, *Damping*, *Gravity* and *Mode* of each system
- Manage the *Mass*, *Angle*, *Velocity*, *Radius* and *Color* of each bob
- Customize the *Length*, *Width* and *Color* of rods and trails!

- Customizable Canvas with:
  - Pause button
  - Pan and zoom
  - Fullscreen mode
  - Capture the moment with *Right-Click -> Save image as...*

### Tips & Tricks
- Change all colors of a DP at once using the square on the left of the dropdown-header 
- Set some opacity to the Canvas background color for cool phasing effect. 
  > *It has some side-effects - you can set it back to opaque color to get rid of them.*
- The presets use JSON, so you can create cool stuff (that would be really hard to do by hand) with basic programming, e.g. random colors or gradual lengths.
- You can use optimized single pendulum math by setting all *Mass*, *Bob radius*, *Rod width* and *Trail width* of Part 2 to zero.

### Made with:
- <a href="https://vuejs.org/" target="_blank"><strong style="color: #42b883">Vue 3</strong></a> reactivity
- <a href="https://p5js.org/" target="_blank"><strong style="color: #ed225d">p5.js</strong></a> rendering
- <a href="https://getbootstrap.com/" target="_blank"><strong style="color: #7734fb">Bootstrap 5</strong></a> styles
- <a href="https://seballot.github.io/spectrum/" target="_blank"><strong style="color: #e83072">Spectrum</strong></a> color pickers
