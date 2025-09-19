(() => {
  const led = document.getElementById("iot-led");
  const buttons = document.querySelectorAll(".iot-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      led.style.background = color;
      led.style.boxShadow = `0 0 20px ${color}`;
    });
  });
})();
