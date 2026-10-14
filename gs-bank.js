MyMod.launch = function(){

(function() {
  let goldenBank = 0;
  let bankEnabled = true;

  Game.registerMod("golden bank", {
    init: function() {
      Game.Notify("Golden Bank loaded!", "", [16, 5]);

      // --- UI ---
      const widget = document.createElement("div");
      widget.id = "golden-bank-widget";
      widget.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: rgba(0,0,0,0.75);
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px;
        font-family: sans-serif;
        font-size: 14px;
        user-select: none;
        display: flex;
        align-items: center;
        gap: 8px;
      `;

      const countEl = document.createElement("span");
      countEl.id = "gb-count";
      countEl.textContent = "🍪 " + goldenBank;
      widget.appendChild(countEl);

      const releaseBtn = document.createElement("button");
      releaseBtn.textContent = "Soltar";
      releaseBtn.style.cssText = "padding:4px 10px;cursor:pointer;border-radius:4px;border:none;background:#c90;color:#fff;";
      releaseBtn.onclick = releaseGolden;
      widget.appendChild(releaseBtn);

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = bankEnabled ? "ON" : "OFF";
      toggleBtn.style.cssText = "padding:4px 10px;cursor:pointer;border-radius:4px;border:none;background:" + (bankEnabled ? "#4a4" : "#a44") + ";color:#fff;";
      toggleBtn.onclick = () => {
        bankEnabled = !bankEnabled;
        toggleBtn.textContent = bankEnabled ? "ON" : "OFF";
        toggleBtn.style.background = bankEnabled ? "#4a4" : "#a44";
      };
      widget.appendChild(toggleBtn);

      document.body.appendChild(widget);

      // --- Capture loop ---
      setInterval(() => {
        if (!bankEnabled) return;
        for (let i = Game.shimmers.length - 1; i >= 0; i--) {
          if (Game.shimmers[i].type === "golden" && !Game.shimmers[i].banked && !Game.shimmers[i].released) {
            Game.shimmers[i].banked = true;
            Game.shimmers[i].x = -9999;
            goldenBank++;
            updateCount();
          }
        }
      }, 50);
    },

    save: function() {
      return JSON.stringify({ bank: goldenBank, enabled: bankEnabled });
    },

    load: function(str) {
      try {
        const data = JSON.parse(str) || {};
        goldenBank = data.bank || 0;
        bankEnabled = data.enabled !== false;
      } catch(e) {}
      updateCount();
      const toggleBtn = document.querySelector("#golden-bank-widget button:last-child");
      if (toggleBtn) {
        toggleBtn.textContent = bankEnabled ? "ON" : "OFF";
        toggleBtn.style.background = bankEnabled ? "#4a4" : "#a44";
      }
    }
  });

  function releaseGolden() {
    if (goldenBank <= 0) return;
    goldenBank--;
    updateCount();
    var s = new Game.shimmer("golden");
    s.released = true;
  }

  function updateCount() {
    const el = document.getElementById("gb-count");
    if (el) el.textContent = "🍪 " + goldenBank;
  }
})();

    MyMod.isLoaded = 1;
}
