
// ============================================
// SUDEEP SUNDARBAN TRAVELS
// Main Frontend JavaScript
// GitHub Pages + Google Apps Script + Google Sheets
// ============================================

const SST_CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbyi7rddWpxW5EanHMGsxJw8IuZVSHzHzuAUo8fIyva-ssbHKFzBCdQpNhuglTprR7N0Sw/exec",
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

function initializePackages() {
  renderPackages();
}

// ============================================
// RENDER FIXED EXPEDITION PACKAGE CARDS
// ============================================

function renderPackages() {
  const packageGrid = document.getElementById("packageGrid");
  if (!packageGrid) return;

  const packages = [
    {
      name: "Basic Jungle Safari",
      tier: "BUDGET SHARED GROUP TOUR",
      price: "₹6,900",
      duration: "2 Nights / 3 Days",
      group: "15 guests onwards",
      description: "An affordable shared Sundarbans experience with jungle safari as the main focus and local sightseeing when time permits.",
      features: [
        "Shared boat safari",
        "Forest permits and applicable fees",
       "Shared meals",
       "Eco-resort accommodation",
       "Canning–Canning pickup and drop by basic passenger vehicle",
       "Local coordination and tour assistance",
       "Optional Kolkata pickup/drop at extra cost"
      ],
      className: "package-basic"
    },
    {
      name: "Advanced Wildlife Expedition",
      tier: "NATURALIST-GUIDED WILDLIFE EXPEDITION",
      price: "₹16,900",
      duration: "3 Nights / 4 Days",
      group: "Suggested group: 7–12 guests",
      description: "An extended wildlife-focused safari for amateur photographers and serious nature enthusiasts, with naturalist guidance.",
      features: [
        "Extended wildlife safari",
       "Naturalist-guided exploration",
       "Eco-resort or houseboat accommodation, as selected",
       "Meals during the expedition",
       "Forest permits and applicable fees",
       "Kolkata pickup and drop",
       "Local coordination and tour assistance",
       "Arrive the evening before the first safari day"
      ],
      className: "package-popular"
    },
    {
      name: "Ultimate Adventure",
      tier: "EXTENDED WILDERNESS EXPLORATION",
      price: "₹26,900",
      duration: "4–5 days or longer",
      group: "2–6 guests",
      description: "A highly immersive small-group expedition for professional photographers, filmmakers, researchers, photojournalists and hardcore wildlife explorers.",
      features: [
        "Extended wildlife exploration",
       "Naturalist-guided expedition",
       "Luxury eco-resort accommodation",
       "Kolkata pickup and drop",
       "Village walk and local livelihood insights",
       "Meals and safari arrangements as per itinerary",
       "Forest permits and applicable fees",
       "Custom itinerary for longer expeditions"
      ],
      className: "package-ultimate"
    }
  ];

  packageGrid.innerHTML = packages.map(pkg => `
    <article class="package-card ${pkg.className}">
      <div class="package-card-content">
        <span class="package-badge">${pkg.tier}</span>
        <h3 class="package-title">${pkg.name}</h3>
        <div class="package-price">
          <span class="price-amount">${pkg.price}</span>
          <span class="price-label"> onwards / person</span>
        </div>
        <div class="package-duration">
          <span class="duration-option">${pkg.duration}</span>
          <span class="duration-option">${pkg.group}</span>
        </div>
        <p class="package-description">${pkg.description}</p>
        <ul class="package-features">
          ${pkg.features.map(feature => `<li><span class="feature-check">✓</span>${feature}</li>`).join("")}
        </ul>
        <button type="button" class="package-button" data-package-name="${pkg.name}">Enquire Now</button>
      </div>
    </article>
  `).join("");

  packageGrid.querySelectorAll(".package-button").forEach(button => {
    button.addEventListener("click", () => selectPackage(button.dataset.packageName || ""));
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
  let inquirySubmissionInProgress = false;
  const form = document.getElementById("inquiryForm");
  const submitButton = document.getElementById("submitButton");
  const formStatus = document.getElementById("formStatus");

  if (!form) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (inquirySubmissionInProgress) return;

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

    // Pre-open a WhatsApp tab synchronously during the submit click.
    // Redirect it after the inquiry request finishes to avoid popup blockers.
    let whatsappWindow = null;
    try {
      whatsappWindow = window.open("about:blank", "_blank");
      if (whatsappWindow) whatsappWindow.opener = null;
    } catch (popupError) {
      whatsappWindow = null;
    }

    // Button loading state and duplicate-submit guard
    inquirySubmissionInProgress = true;
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
       * Apps Script receives JSON as text/plain to avoid CORS preflight.
       * In no-cors mode, the browser cannot read the backend response,
       * so we must not claim that the enquiry is confirmed as saved.
       */
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        await fetch(SST_CONFIG.apiUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(inquiry),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }

      showFormStatus(
        "Your inquiry transmission was attempted. Website confirmation is not available, so server receipt is not verified. For a reliable confirmation, continue on WhatsApp using the backup link below.",
        "success"
      );

      // Redirect the pre-opened tab to WhatsApp; if blocked, show the manual link.
      const whatsappUrl = createWhatsAppLink(inquiry);
      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.location.href = whatsappUrl;
      }
      // Always provide a visible WhatsApp backup link, even if the tab opens.
      showWhatsAppFollowUp(inquiry);

    } catch (error) {
      console.error("Inquiry submission error:", error);

      showFormStatus(
        "We could not complete the inquiry request from this browser. Please use the WhatsApp option below to contact us.",
        "error"
      );

      // Redirect the pre-opened tab on failure too, so the user can contact us.
      const whatsappUrl = createWhatsAppLink(inquiry);
      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        showWhatsAppFollowUp(inquiry);
      }

    } finally {
      inquirySubmissionInProgress = false;
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

  // Remove any old WhatsApp follow-up link before showing a fresh status.
  formStatus.querySelectorAll(".whatsapp-followup").forEach(link => link.remove());
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

  departureDate.min = localToday;

  arrivalDate.addEventListener("change", () => {
    departureDate.min = arrivalDate.value || localToday;
    departureDate.setCustomValidity("");

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
