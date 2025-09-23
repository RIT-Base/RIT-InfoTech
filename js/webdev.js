(() => {
    const runBtn = document.getElementById("run-btn"); 
    const htmlInput = document.getElementById("html-input");
    const cssInput = document.getElementById("css-input");
    const output = document.getElementById("code-output");

    if (!htmlInput || !cssInput || !output) {
        console.warn("WebDev editor elements not found!");
        return;
    }

    const updatePreview = () => {
        const html = htmlInput.value;
        const css = `<style>${cssInput.value}</style>`;
        const doc = output.contentDocument || output.contentWindow.document;
        
        requestAnimationFrame(() => {
            doc.open();
            doc.write(css + html);
            doc.close();
        });
    };

    htmlInput.addEventListener("input", updatePreview);
    cssInput.addEventListener("input", updatePreview);

    updatePreview();
})();