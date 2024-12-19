let sliderView = {
    slider: null,

    setup: function() {
        createCanvas(100, 100);

        // Create a slider and place it at the top of the canvas.
        this.slider = createSlider(0, 255);
        this.slider.position(10, 10);
        this.slider.size(80);
    },

    draw: function() {
        // Clear the canvas
        background(255);

        // Get the slider value
        let g = this.slider.value();

        // Display the slider value
        fill(0);
        textSize(16);
        text("Value: " + g, 10, 50);
    }
};

export {sliderView};