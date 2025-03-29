console.log("✅ Alpine initialization starting...");

// ✅ Import AlpineJS and Plugins (Must be at the top)
import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';

// ✅ Import Stores and Components
import authState from './auth/authState';
import emailAuth from './auth/emailAuth';
import socialAuth from './auth/socialAuth';
import modalManager from './modals/modalManager';
import articleAccess from './modals/articleAccess';
import profile from './auth/profile';
import logout from './auth/logout';

// ✅ Check if Alpine is already initialized
if (!window.Alpine) {
    window.Alpine = Alpine;
    Alpine.plugin(collapse);
}

// ✅ Ensure Alpine initializes only ONCE
document.addEventListener('alpine:init', () => {
    console.log("✅ Alpine initializing...");

    Alpine.store('auth', Alpine.store('auth') || authState());
    Alpine.store('modalManager', Alpine.store('modalManager') || modalManager());
    Alpine.store('socialAuth', Alpine.store('socialAuth') || socialAuth());
    Alpine.store('logout', logout);


    Alpine.data('emailAuth', emailAuth);
    Alpine.data('articleAccess', articleAccess);
    Alpine.data('profile', profile);
});

// ✅ Ensure Alpine starts only ONCE
document.addEventListener("DOMContentLoaded", () => {
    if (!window.Alpine._hasStarted) {
        window.Alpine._hasStarted = true;
        Alpine.start();
        console.log("✅ Alpine started.");
    }

    Alpine.nextTick(() => {
        console.log("✅ Alpine fully initialized.");
        document.dispatchEvent(new Event("alpine:ready"));
    });
});

// ✅ UI Update on Authentication Change  
document.addEventListener("auth-updated", () => {
    Alpine.nextTick(() => {
        document.querySelectorAll("[data-login]").forEach(el => {
            el.style.display = Alpine.store("auth").isLoggedIn ? "none" : "block";
        });
        document.querySelectorAll("[data-profile]").forEach(el => {
            el.style.display = Alpine.store("auth").isLoggedIn ? "block" : "none";
        });
    });
});




// console.log("✅ Alpine initialization starting...");

// // ✅ Import AlpineJS and Plugins (Must be at the top)
// import Alpine from 'alpinejs';
// import collapse from '@alpinejs/collapse';

// // ✅ Import Stores and Components
// import authState from './auth/authState';
// import emailAuth from './auth/emailAuth';
// import socialAuth from './auth/socialAuth';
// import modalManager from './modals/modalManager';
// import articleAccess from './modals/articleAccess';
// import logout from './auth/logout';
// import './bootstrap';
// // import profile from './auth/profile'; // ✅ Import profile.js


// // ✅ Check if Alpine is already initialized
// if (!window.Alpine) {
//     window.Alpine = Alpine;
//     Alpine.plugin(collapse);
// }

// // ✅ Ensure Alpine initializes only ONCE
// document.addEventListener('alpine:init', () => {
//     console.log("✅ Alpine initializing...");

//     Alpine.store('auth', Alpine.store('auth') || authState());
//     Alpine.store('modalManager', Alpine.store('modalManager') || modalManager());
//     Alpine.store('socialAuth', Alpine.store('socialAuth') || socialAuth());
//     Alpine.store('logout', logout);


//     Alpine.data('emailAuth', emailAuth);
//     Alpine.data('articleAccess', articleAccess);
//     Alpine.data('profile', profile); // ✅ Register profile() function
// });

// // ✅ Ensure Alpine starts only ONCE
// document.addEventListener("DOMContentLoaded", () => {
//     if (!window.Alpine._hasStarted) {
//         window.Alpine._hasStarted = true;
//         Alpine.start();
//         console.log("✅ Alpine started.");
//     }

//     Alpine.nextTick(() => {
//         console.log("✅ Alpine fully initialized.");
//         document.dispatchEvent(new Event("alpine:ready"));
//     });
// });

// // ✅ UI Update on Authentication Change  
// document.addEventListener("auth-updated", () => {
//     Alpine.nextTick(() => {
//         console.log("🔄 Auth state updated in Alpine store.");
//         Alpine.store('auth').initAuthListener(); // ✅ Force sync with Firebase state

//         document.querySelectorAll("[data-login]").forEach(el => {
//             el.style.display = Alpine.store("auth").isLoggedIn ? "none" : "block";
//         });
//         document.querySelectorAll("[data-profile]").forEach(el => {
//             el.style.display = Alpine.store("auth").isLoggedIn ? "block" : "none";
//         });
//     });
// });

// // ✅ UI Update on Authentication Change  
// document.addEventListener("auth-updated", () => {
//     Alpine.nextTick(() => {
//         document.querySelectorAll("[data-login]").forEach(el => {
//             el.style.display = Alpine.store("auth").isLoggedIn ? "none" : "block";
//         });
//         document.querySelectorAll("[data-profile]").forEach(el => {
//             el.style.display = Alpine.store("auth").isLoggedIn ? "block" : "none";
//         });
//     });
// });


//Modal for dailycard Alpine
window.modalHandler = function () {
  return {
      isOpen: false,
      image: '',
      title: '',
      content: '',
      openModal(image, title, content) {
          this.isOpen = true;
          this.image = image;
          this.title = title;
          this.content = content;
      },
      closeModal() {
          this.isOpen = false;
      }
  };
};


// Initialise the slider with swiper
document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".swiper", {
    effect: "fade",
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    fadeEffect: {
      crossFade: true,
    },
  });
});


// Daily Modal
window.openModal = function(imageSrc, title, content) {
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('imageModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // Lock scrolling
};

window.closeModal = function() {
    document.getElementById('imageModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden'); // Unlock scrolling
};

window.share = function(platform) {
    // Add sharing logic for the generic share icon if needed.
   console.log(`Share to ${platform}`);
};
