(() => {
  const assemblyView = document.getElementById('assembly-view');
  const simulationView = document.getElementById('simulation-view');
  const components = document.querySelectorAll('.draggable-component');
  const sensorSlot = document.getElementById('sensor-slot');
  const actuatorSlot = document.getElementById('actuator-slot');
  const activateBtn = document.getElementById('activate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const simulatorContent = document.getElementById('simulator-content');

  let draggedItem = null;
  let assembledSensor = null;
  let assembledActuator = null;

  function checkCompletion() {
    if (assembledSensor && assembledActuator) {
      activateBtn.style.display = 'block';
    }
  }
  
  // Fungsi simulasi tidak berubah
  function generateSimulatorUI() {
      simulatorContent.innerHTML = '';

      if (assembledSensor === 'cahaya' && assembledActuator === 'lampu') {
          simulatorContent.innerHTML = `
              <div class="simulator-label">Intensitas Cahaya</div>
              <input type="range" min="0" max="100" value="50" class="simulator-slider" id="light-slider">
              <div id="lamp-icon" class="simulator-item" style="color: #555;">💡</div>
              <p>Saat intensitas cahaya rendah (gelap), lampu akan menyala.</p>
          `;
          const lightSlider = document.getElementById('light-slider');
          const lampIcon = document.getElementById('lamp-icon');
          lightSlider.addEventListener('input', (e) => {
              if (e.target.value < 30) {
                  lampIcon.style.color = '#f1c40f';
                  lampIcon.style.textShadow = '0 0 20px #f1c40f';
              } else {
                  lampIcon.style.color = '#555';
                  lampIcon.style.textShadow = 'none';
              }
          });
      }
      else if (assembledSensor === 'suhu' && assembledActuator === 'kipas') {
          simulatorContent.innerHTML = `
              <div class="simulator-label">Suhu Ruangan (<span id="temp-value">30</span>°C)</div>
              <input type="range" min="20" max="40" value="30" class="simulator-slider" id="temp-slider">
              <div id="fan-icon" class="simulator-item">𖣘</div>
              <p>Saat suhu ruangan melebihi 32°C, kipas akan berputar.</p>
          `;
          const tempSlider = document.getElementById('temp-slider');
          const fanIcon = document.getElementById('fan-icon');
          const tempValue = document.getElementById('temp-value');
          tempSlider.addEventListener('input', (e) => {
              tempValue.textContent = e.target.value;
              if (e.target.value > 32) {
                  fanIcon.style.animation = 'spin 1s linear infinite';
              } else {
                  fanIcon.style.animation = 'none';
              }
          });
          if (!document.getElementById('fan-spin-style')) {
              const style = document.createElement('style');
              style.id = 'fan-spin-style';
              style.innerHTML = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
              document.head.appendChild(style);
          }
      }
      else if (assembledSensor === 'lembab' && assembledActuator === 'pompa') {
          simulatorContent.innerHTML = `
              <div class="simulator-label">Status Kelembapan Tanah</div>
              <button id="moisture-btn" style="background-color: #8d6e63;">Kering</button>
              <div style="position: relative; margin-top: 20px;">
                <span id="plant-icon" class="simulator-item">🌱</span>
                <span id="droplet-icon" class="simulator-item" style="position: absolute; left: 0; top:-20px; opacity: 1;">💧</span>
              </div>
              <p>Saat tanah kering, pompa akan aktif menyiram tanaman.</p>
          `;
          const moistureBtn = document.getElementById('moisture-btn');
          const dropletIcon = document.getElementById('droplet-icon');
          let isDry = false;

          moistureBtn.addEventListener('click', () => {
              isDry = !isDry;
              if (isDry) {
                moistureBtn.textContent = 'Kering';
                moistureBtn.style.backgroundColor = '#8d6e63';
                dropletIcon.style.opacity = '1';
              } else {
                moistureBtn.textContent = 'Lembap';
                moistureBtn.style.backgroundColor = '#2962ff';
                dropletIcon.style.opacity = '0';
              }
          });
      }
      else {
          let message = `<p style="color: #ffcdd2;">Kombinasi antara <strong>${assembledSensor}</strong> dan <strong>${assembledActuator}</strong> tidak kompatibel atau belum memiliki simulasi.</p>`;
          const sensor = assembledSensor;
          const actuator = assembledActuator;

          if (sensor === 'cahaya' && actuator === 'kipas') {
              message = '<p><strong>Tidak Sesuai!</strong><br>Sensor cahaya mendeteksi gelap/terang, sementara kipas merespon suhu. Keduanya tidak saling berhubungan secara logis.</p>';
          } else if (sensor === 'cahaya' && actuator === 'pompa') {
              message = '<p><strong>Tidak Sesuai!</strong><br>Kondisi cahaya tidak bisa menjadi acuan untuk menyiram tanaman dengan pompa air.</p>';
          } else if (sensor === 'suhu' && actuator === 'lampu') {
              message = '<p><strong>Tidak Sesuai!</strong><br>Sensor suhu mengukur panas, sedangkan lampu menerangi ruangan. Tidak ada logika kontrol yang umum di antara keduanya.</p>';
          } else if (sensor === 'suhu' && actuator === 'pompa') {
              message = '<p><strong>Tidak Sesuai!</strong><br>Suhu udara bukanlah parameter yang tepat untuk mengaktifkan pompa penyiram tanaman.</p>';
          } else if (sensor === 'lembab' && actuator === 'lampu') {
              message = '<p><strong>Tidak Sesuai!</strong><br>Kelembapan tanah tidak relevan untuk menyalakan atau mematikan lampu secara otomatis.</p>';
          } else if (sensor === 'lembab' && actuator === 'kipas') {
              message = '<p><strong>Tidak Sesuai!</strong><br>Sensor kelembapan tanah ditujukan untuk irigasi, bukan untuk mengontrol kipas pendingin ruangan.</p>';
          }
          simulatorContent.innerHTML = message;
      }
  }

  function resetAssembly() {
      draggedItem = null;
      assembledSensor = null;
      assembledActuator = null;
      sensorSlot.innerHTML = '<span>Slot Input Sensor</span><span class="check-icon">✓</span>';
      actuatorSlot.innerHTML = '<span>Slot Output</span><span class="check-icon">✓</span>';
      sensorSlot.classList.remove('filled');
      actuatorSlot.classList.remove('filled');
      components.forEach(c => c.classList.remove('used'));
      activateBtn.style.display = 'none';
  }

  // --- PEMBARUAN UTAMA DIMULAI DI SINI ---

  const isMobile = window.innerWidth <= 600;

  if (isMobile) {
    // Mode Klik untuk Mobile
    components.forEach(item => {
      item.setAttribute('draggable', 'false'); // Matikan drag
      item.style.cursor = 'pointer';

      item.addEventListener('click', () => {
        if (item.classList.contains('used')) return;

        const type = item.dataset.type;
        const targetSlot = (type === 'sensor') ? sensorSlot : actuatorSlot;
        
        // BUG FIX: Jangan timpa jika slot sudah terisi
        if (targetSlot.classList.contains('filled')) return;

        if (type === 'sensor') assembledSensor = item.dataset.component;
        if (type === 'actuator') assembledActuator = item.dataset.component;

        targetSlot.innerHTML = item.innerHTML + '<span class="check-icon">✓</span>';
        targetSlot.classList.add('filled');
        item.classList.add('used');
        checkCompletion();
      });
    });
  } else {
    // Mode Drag & Drop untuk Desktop
    components.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        const draggable = e.target.closest('.draggable-component');
        if (draggable && !draggable.classList.contains('used')) {
          draggedItem = draggable;
        } else {
          e.preventDefault();
        }
      });
    });

    [sensorSlot, actuatorSlot].forEach(slot => {
      slot.addEventListener('dragover', (e) => { 
          e.preventDefault(); 
          // BUG FIX: Jangan beri efek glow jika slot terisi
          if(slot.classList.contains('filled')) return;
          const accepts = slot.getAttribute('data-accepts'); 
          if (draggedItem && draggedItem.dataset.type === accepts) { 
              slot.classList.add('glow'); 
          } 
      });
      slot.addEventListener('dragleave', () => { slot.classList.remove('glow'); });
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('glow');
        
        // BUG FIX: Jangan timpa jika slot sudah terisi
        if (slot.classList.contains('filled')) return;

        const accepts = slot.getAttribute('data-accepts');
        if (draggedItem && draggedItem.dataset.type === accepts) {
          if (accepts === 'sensor') assembledSensor = draggedItem.dataset.component;
          if (accepts === 'actuator') assembledActuator = draggedItem.dataset.component;
          
          slot.innerHTML = draggedItem.innerHTML + '<span class="check-icon">✓</span>';
          
          slot.classList.add('filled');
          draggedItem.classList.add('used');
          draggedItem = null;
          checkCompletion();
        }
      });
    });
  }

  // Event listener untuk tombol tidak berubah
  activateBtn.addEventListener('click', () => {
    assemblyView.style.display = 'none';
    simulationView.style.display = 'block';
    generateSimulatorUI();
  });

  resetBtn.addEventListener('click', () => {
    simulationView.style.display = 'none';
    assemblyView.style.display = 'block';
    resetAssembly();
  });
})();