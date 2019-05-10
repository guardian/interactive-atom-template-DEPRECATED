import ScrollyTeller from "./scrollyteller"

// just some setup for the example
const dataViz = document.querySelector("#data-viz");
const height = window.innerHeight;
const width = dataViz.parentNode.clientWidth;

dataViz.setAttribute("height", height);
dataViz.setAttribute("width", width);

// ScrollyTeller example code

const scrolly = new ScrollyTeller({
    parent: document.querySelector("#scrolly-1"),
    triggerTop: 1/3, // percentage from the top of the screen that the trigger should fire
    triggerTopMobile: 0.75,
    transparentUntilActive: true
});

scrolly.addTrigger({num: 1, do: () => {
    dataViz.innerHTML = `<text x="${width/2}" y="${height/2}">1</text>`;
}});

scrolly.addTrigger({num: 2, do: () => {
    dataViz.innerHTML = `<text x="${width/2}" y="${height/2}">2</text>`;
}});

scrolly.addTrigger({num: 3, do: () => {
    dataViz.innerHTML = `<text x="${width/2}" y="${height/2}">3</text>`;
}});

scrolly.addTrigger({num: 4, do: () => {
    dataViz.innerHTML = `<text x="${width/2}" y="${height/2}">4</text>`;
}});

scrolly.addTrigger({num: 5, do: () => {
    dataViz.innerHTML = `<text x="${width/2}" y="${height/2}">5</text>`;
}});

scrolly.addTrigger({num: 6, do: () => {
    dataViz.innerHTML = `<text x="${width/2}" y="${height/2}">6</text>`;
}});

scrolly.addTrigger({num: 7, do: () => {
    dataViz.innerHTML = `<text x="${width/2}" y="${height/2}">7</text>`;
}});

scrolly.watchScroll();