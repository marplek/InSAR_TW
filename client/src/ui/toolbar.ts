export function initializeToolbar() {
    document.getElementById('toolbarIcon')?.addEventListener('click', () => {
        const toolbar = document.getElementById('toolbar');
        if (toolbar) {
            if (toolbar.style.display === "none") {
                toolbar.style.display = "block";
            } else {
                toolbar.style.display = "none";
            }
        }
    });
    
    const colorbarGradient = document.getElementById('colorbar-gradient');
    if (colorbarGradient) {
        colorbarGradient.style.background = 'linear-gradient(to right, blue, white, red)';
    }
}