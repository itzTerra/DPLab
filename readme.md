<h1>
    <a href="https://itzterra.github.io/DPLab/" target="_blank">
        Double Pendulum Lab 
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 -8 24 24">
        <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
        <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
        </svg>
    </a>
</h1>

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
