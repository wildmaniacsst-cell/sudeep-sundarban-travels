
// ============================================
// SUDEEP SUNDARBAN TRAVELS
// Main Frontend JavaScript
// GitHub Pages + Google Apps Script + Google Sheets
// ============================================

const SST_CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbxuFasUaPeGIzCv3cCA0TDQgpd3V01O0n2dTLH-VWGCmO99te7_EFrVWj8NxgJVP_ru5Q/exec",
  whatsapp: "919123388206",
  email: "wildmaniacsst@gmail.com",
  businessName: "Sudeep Sundarban Travels"
};

// ============================================
// DOM READY
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializePackages();
  initializeInquiryForm();
  initializeDateValidation();
  initializeSmoothScrolling();
  initializeFooterYear();
});

// ============================================
// NAVIGATION / MOBILE MENU
// ============================================

function initializeNavigation() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("active");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mainNav.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  // Close menu after clicking a navigation link
  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      mainNav.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", event => {
    if (
      mainNav.classList.contains("active") &&
      !mainNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      mainNav.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      mainNav.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
    }
  });

  // Close menu with Escape
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      mainNav.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      mainNav.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
    }
  });
}

// ============================================
// GOOGLE SHEETS - LOAD TOUR PACKAGES
// ============================================

async function initializePackages() {
  const packageGrid = document.getElementById("packageGrid");
  const packageLoading = document.getElementById("packageLoading");

  if (!packageGrid) return;

  try {
    const response = await fetch(SST_CONFIG.apiUrl, {
      method: "GET",
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error("Package API returned an error.");
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.packages)) {
      throw new Error("Invalid package data.");
    }

    const activePackages = data.packages
      .filter(pkg => pkg.active !== false)
      .sort((a, b) => {
        return Number(a.displayOrder || 999) -
               Number(b.displayOrder || 999);
      });

    renderPackages(activePackages);

  } catch (error) {
    console.error("Package loading error:", error);

    if (packageLoading) {
      packageLoading.textContent =
        "Our tour packages are temporarily unavailable. Please contact us directly.";
    }
  }
}

// ============================================
// RENDER PACKAGE CARDS
// ============================================

function renderPackages(packages) {
  const packageGrid = document.getElementById("packageGrid");
  const packageLoading = document.getElementById("packageLoading");

  if (!packageGrid) return;

  if (packageLoading) {
    packageLoading.style.display = "none";
  }

  packageGrid.innerHTML = "";

  if (!packages.length) {
    packageGrid.innerHTML = `
      <div class="package-empty">
        <p>Tour packages will be updated shortly.</p>
      </div>
    `;
    return;
  }

  packages.forEach((pkg, index) => {
    const features = parseFeatures(pkg.features);
    const tierName = String(pkg.name || "").toLowerCase();
    let displayFeatures = features;
    let durationDisplay = escapeHTML(pkg.duration || "");

    if (tierName.includes("basic jungle")) {
      displayFeatures = features.filter(feature => !/guided tour/i.test(feature));
      durationDisplay = '<span class="duration-option">1 Night / 2 Days</span><span class="duration-option">2 Nights / 3 Days</span>';
    } else if (tierName.includes("advanced wildlife") || tierName.includes("wildlife expedition")) {
      displayFeatures = [
        "Naturalist-guided tour",
        "All meals as per itinerary",
        "Houseboat accommodation",
        "Indian & Continental cuisine as per meal plan",
        "Kolkata pick-up and drop as per itinerary",
        "Forest entry / permit fees",
        "Eco-guide fees",
        "Boat safari / cruise as per itinerary"
      ];
    } else if (tierName.includes("ultimate adventure")) {
      displayFeatures = [
        "Houseboat / eco-resort accommodation",
        "Expert naturalist-guided tour",
        "Photographic assistance",
        "Exclusive safari boat access",
        "Indian & Continental cuisine as per meal plan",
        "Kolkata pick-up and drop as per itinerary",
        "Forest entry / permit fees",
        "Eco-guide fees",
        "Boat safari / cruise as per itinerary"
      ];
    }

    const card = document.createElement("article");
    card.className = "package-card";
    if (tierName.includes("basic jungle")) card.classList.add("package-basic");
    if (tierName.includes("ultimate adventure")) card.classList.add("package-ultimate");

    if (index === 1) {
      card.classList.add("package-popular");
    }

    card.innerHTML = `
      ${index === 1 ? `
        <span class="package-badge">Popular</span>
      ` : ""}

      <div class="package-card-content">
        <h3 class="package-title">${escapeHTML(pkg.name || "Wildlife Expedition")}</h3>

        <div class="package-duration">
          ${durationDisplay}
        </div>

        <p class="package-description">
          ${escapeHTML(pkg.description || "")}
        </p>

        ${
          displayFeatures.length
            ? `<ul class="package-features">
                ${displayFeatures.map(feature => `
                  <li>
                    <span class="feature-check">✓</span>
                    ${escapeHTML(feature)}
                  </li>
                `).join("")}
              </ul>`
            : ""
        }

        <button
          type="button"
          class="package-button"
          data-package-name="${escapeAttribute(pkg.name || "")}"
        >
          Enquire Now
        </button>
      </div>
    `;

    packageGrid.appendChild(card);
  });

  // Attach package buttons
  packageGrid.querySelectorAll(".package-button").forEach(button => {
    button.addEventListener("click", () => {
      const packageName = button.dataset.packageName || "";
      selectPackage(packageName);
    });
  });
}

// ============================================
// PACKAGE HELPERS
// ============================================

function parseFeatures(features) {
  if (!features) return [];

  if (Array.isArray(features)) {
    return features;
  }

  return String(features)
    .split(";")
    .map(item => item.trim())
    .filter(Boolean);
}

function formatCurrency(value) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return value || "Contact for price";
  }

  return "₹" + price.toLocaleString("en-IN");
}

// ============================================
// SELECT PACKAGE / SCROLL TO INQUIRY FORM
// ============================================

function selectPackage(packageName) {
  const packageField = document.querySelector(
    '#inquiryForm [name="package"]'
  );

  if (packageField) {
    packageField.value = packageName;

    // Notify custom select listeners if needed
    packageField.dispatchEvent(
      new Event("change", { bubbles: true })
    );
  }

  const bookingSection = document.getElementById("booking");

  if (bookingSection) {
    bookingSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // Highlight the selected package in the form
  if (packageField) {
    setTimeout(() => packageField.focus(), 600);
  }
}

// ============================================
// INQUIRY FORM
// ============================================

function initializeInquiryForm() {
  const form = document.getElementById("inquiryForm");
  const submitButton = document.getElementById("submitButton");
  const formStatus = document.getElementById("formStatus");

  if (!form) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Honeypot spam protection
    const honeypot = form.querySelector('[name="website"]');

    if (honeypot && honeypot.value.trim() !== "") {
      console.warn("Spam submission detected.");
      return;
    }

    const formData = new FormData(form);
    const inquiry = {};

    formData.forEach((value, key) => {
      inquiry[key] = String(value).trim();
    });

    // Additional validation
    if (!inquiry.name || !inquiry.phone) {
      showFormStatus(
        "Please enter your name and contact number.",
        "error"
      );
      return;
    }

    // Basic phone validation
    const phoneDigits = inquiry.phone.replace(/\D/g, "");

    if (phoneDigits.length < 7) {
      showFormStatus(
        "Please enter a valid phone number.",
        "error"
      );
      return;
    }

    // Button loading state
    const originalButtonText = submitButton
      ? submitButton.innerHTML
      : "Submit Inquiry";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = "Sending Inquiry...";
      submitButton.classList.add("loading");
    }

    showFormStatus("Submitting your inquiry...", "loading");

    try {
      /*
       * Apps Script receives the JSON body.
       * text/plain avoids browser CORS preflight issues.
       * The response is opaque in no-cors mode, so we cannot
       * inspect backend success/failure from the browser.
       */

      await fetch(SST_CONFIG.apiUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(inquiry)
      });

      showFormStatus(
        "Thank you! Your inquiry has been submitted. We will contact you shortly.",
        "success"
      );

      form.reset();

      // WhatsApp follow-up option
      showWhatsAppFollowUp(inquiry);

    } catch (error) {
      console.error("Inquiry submission error:", error);

      showFormStatus(
        "Unable to submit your inquiry right now. Please contact us directly via WhatsApp.",
        "error"
      );

      // WhatsApp fallback
      openWhatsAppInquiry(inquiry);

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        submitButton.classList.remove("loading");
      }
    }
  });
}

// ============================================
// FORM STATUS MESSAGE
// ============================================

function showFormStatus(message, type = "info") {
  const formStatus = document.getElementById("formStatus");

  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.className = "form-status";
  formStatus.classList.add(`status-${type}`);
  formStatus.style.display = "block";
}

// ============================================
// WHATSAPP FOLLOW-UP
// ============================================

function showWhatsAppFollowUp(inquiry) {
  const formStatus = document.getElementById("formStatus");

  if (!formStatus) return;

  const whatsappButton = document.createElement("a");

  whatsappButton.className = "whatsapp-followup";
  whatsappButton.href = createWhatsAppLink(inquiry);
  whatsappButton.target = "_blank";
  whatsappButton.rel = "noopener noreferrer";
  whatsappButton.textContent = "Continue on WhatsApp";

  formStatus.appendChild(document.createElement("br"));
  formStatus.appendChild(document.createElement("br"));
  formStatus.appendChild(whatsappButton);
}

function openWhatsAppInquiry(inquiry) {
  window.open(
    createWhatsAppLink(inquiry),
    "_blank",
    "noopener,noreferrer"
  );
}

function createWhatsAppLink(inquiry) {
  const message = `
Hello Sudeep Sundarban Travels,

I have submitted a tour inquiry.

Name: ${inquiry.name || ""}
Phone: ${inquiry.phone || ""}
Email: ${inquiry.email || ""}
Country: ${inquiry.country || ""}
Package: ${inquiry.package || ""}
Arrival Date: ${inquiry.arrivalDate || ""}
Departure Date: ${inquiry.departureDate || ""}
Guests: ${inquiry.guests || ""}
Budget: ${inquiry.budget || ""}
Message: ${inquiry.message || ""}

Please contact me regarding this tour.
  `.trim();

  return `https://wa.me/${SST_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

// ============================================
// DATE VALIDATION
// ============================================

function initializeDateValidation() {
  const arrivalDate = document.querySelector(
    '#inquiryForm [name="arrivalDate"]'
  );

  const departureDate = document.querySelector(
    '#inquiryForm [name="departureDate"]'
  );

  if (!arrivalDate || !departureDate) return;

  // Prevent past arrival dates
  const today = new Date();
  const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  arrivalDate.min = localToday;

  arrivalDate.addEventListener("change", () => {
    departureDate.min = arrivalDate.value || localToday;

    if (
      departureDate.value &&
      arrivalDate.value &&
      departureDate.value < arrivalDate.value
    ) {
      departureDate.value = "";
    }
  });

  departureDate.addEventListener("change", () => {
    if (
      arrivalDate.value &&
      departureDate.value &&
      departureDate.value < arrivalDate.value
    ) {
      departureDate.setCustomValidity(
        "Departure date cannot be before arrival date."
      );
    } else {
      departureDate.setCustomValidity("");
    }
  });
}

// ============================================
// SMOOTH SCROLLING
// ============================================

function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}

// ============================================
// FOOTER YEAR
// ============================================

function initializeFooterYear() {
  const yearElements = document.querySelectorAll(".current-year");

  yearElements.forEach(element => {
    element.textContent = new Date().getFullYear();
  });
}

// ============================================
// SECURITY HELPERS
// ============================================

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHTML(value);
}

// ============================================
// DIRECT CONTACT HELPERS
// ============================================

function openDirectWhatsApp() {
  const url = `https://wa.me/${SST_CONFIG.whatsapp}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function callBusiness() {
  window.location.href = "tel:+919123388206";
}

function emailBusiness() {
  window.location.href = `mailto:${SST_CONFIG.email}`;
}

// ============================================
// CONSOLE BRANDING
// ============================================

console.log(
  "%cSudeep Sundarban Travels",
  "font-size:18px;font-weight:bold;color:#0b6651;"
);

console.log(
  "%cWildlife • Photography • River Expeditions • Conservation",
  "font-size:12px;color:#666;"
);
