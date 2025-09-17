(() => {
    const runBtn = document.getElementById("run-btn");
    const htmlInput = document.getElementById("html-input");
    const cssInput = document.getElementById("css-input");
    const output = document.getElementById("code-output");

    if (!runBtn || !htmlInput || !cssInput || !output) {
        console.warn("WebDev editor elements not found!");
        return;
    }

    runBtn.addEventListener("click", () => {
        const html = htmlInput.value;
        const css = `<style>${cssInput.value}</style>`;
        const doc = output.contentDocument || output.contentWindow.document;
        doc.open();
        doc.write(css + html);
        doc.close();
    });
})();
