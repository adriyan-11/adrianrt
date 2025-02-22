
const mainMenu = document.querySelector(".mainMenu")
const closeMenu = document.querySelector(".closeMenu")
const openMenu = document.querySelector(".openMenu")
const menu_items = document.querySelectorAll("nav .mainMenu li a")

openMenu.addEventListener("click", show)
closeMenu.addEventListener("click", close)

// Close menu when you click on a menu item
menu_items.forEach((item) => {
  item.addEventListener("click", () => {
    close()
  })
})

function show() {
  mainMenu.style.display = "flex"
  mainMenu.style.top = "0"
}

function close() {
  mainMenu.style.top = "-100%"
}

// Add resize event listener to handle menu visibility on screen size change
window.addEventListener("resize", () => {
  if (window.innerWidth > 800) {
    mainMenu.style.display = "flex"
    mainMenu.style.top = "0"
  } else {
    mainMenu.style.display = "none"
    mainMenu.style.top = "-100%"
  }
})


