/* =========================================================
   اپ پایبندی بیماران به درمان — جاوااسکریپت
   ========================================================= */

// کلاس js برای فعال‌سازی تدریجی انیمیشن‌های وابسته به اسکریپت
document.documentElement.classList.add("js");

// ---------- منوی موبایل ----------
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// بستن منو بعد از کلیک روی هر لینک
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- سایه و بلور هدر بعد از اسکرول ----------
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// ---------- سوالات متداول — آکاردئون انحصاری ----------
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

// ---------- خط زمانی «یارا چطور کار می‌کند» — نمایان شدن هنگام اسکرول ----------
const howSteps = document.querySelector('.how-steps');

if (howSteps && 'IntersectionObserver' in window) {
  const howObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          howSteps.classList.add('in-view');
          howObserver.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );
  howObserver.observe(howSteps);
}

// ---------- خط زمانی افقی «چرا ادامه درمان سخت می‌شود؟» — نمایان شدن هنگام اسکرول ----------
const journeyTimeline = document.querySelector('.journey-timeline');

if (journeyTimeline && 'IntersectionObserver' in window) {
  const journeyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          journeyTimeline.classList.add('in-view');
          journeyObserver.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );
  journeyObserver.observe(journeyTimeline);
}

// ---------- «چرا یارا؟» — فعال‌سازی پله‌ای ارزش‌ها بر اساس اسکرول ----------
// توضیح هر آیتم فقط هنگام فعال بودن باز می‌شود؛ آیتم‌های غیرفعال جمع و کم‌رنگ‌ترند.
const whyValues = document.querySelector('.why-values');

if (whyValues && 'IntersectionObserver' in window) {
  const whyItems = Array.from(whyValues.querySelectorAll('.why-value'));

  if (whyItems.length) {
    whyValues.classList.add('is-enhanced');

    const activateWhyItem = (target) => {
      whyItems.forEach((item) => {
        item.classList.toggle('is-active', item === target);
      });
    };

    // آیتم فعال = نزدیک‌ترین آیتمِ هم‌پوشان با نوار میانی دیدفست
    const pickActiveWhyItem = () => {
      const bandTop = innerHeight * 0.42;
      const bandBottom = innerHeight * 0.58;
      let best = null;
      let bestDistance = Infinity;

      whyItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const overlapsBand = rect.bottom > bandTop && rect.top < bandBottom;
        if (!overlapsBand) return;

        const distance = Math.abs(rect.top + rect.height / 2 - innerHeight / 2);
        if (distance < bestDistance) {
          best = item;
          bestDistance = distance;
        }
      });

      if (best) activateWhyItem(best);
    };

    // وضعیت اولیه: آیتم اول فعال
    activateWhyItem(whyItems[0]);

    // فقط هنگام تغییر وضعیت هم‌پوشانی اجرا می‌شود — بدون شنونده پیوسته اسکرول
    const whyObserver = new IntersectionObserver(
      () => pickActiveWhyItem(),
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    );

    whyItems.forEach((item) => whyObserver.observe(item));
  }
}

// ---------- «یارا چطور کار می‌کند؟» — گام فعال بر اساس اسکرول ----------
// گام فعال با نوار میانی دیدفست انتخاب می‌شود؛ گام‌های قبلی «طی‌شده» علامت می‌خورند.
const howStepsList = document.querySelector('.how-steps');

if (howStepsList && 'IntersectionObserver' in window) {
  const howStepItems = Array.from(howStepsList.querySelectorAll('.how-step'));

  if (howStepItems.length) {
    howStepsList.classList.add('is-enhanced');

    const setHowActive = (activeIndex) => {
      howStepItems.forEach((step, index) => {
        step.classList.toggle('is-active', index === activeIndex);
        step.classList.toggle('is-done', index < activeIndex);
      });
    };

    // وضعیت اولیه: گام اول فعال
    setHowActive(0);

    // گام فعال = نزدیک‌ترین گامِ هم‌پوشان با نوار میانی دیدفست
    const pickHowActive = () => {
      const bandTop = innerHeight * 0.42;
      const bandBottom = innerHeight * 0.58;
      let bestIndex = -1;
      let bestDistance = Infinity;

      howStepItems.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        const overlapsBand = rect.bottom > bandTop && rect.top < bandBottom;
        if (!overlapsBand) return;

        const distance = Math.abs(rect.top + rect.height / 2 - innerHeight / 2);
        if (distance < bestDistance) {
          bestIndex = index;
          bestDistance = distance;
        }
      });

      if (bestIndex >= 0) setHowActive(bestIndex);
    };

    // فقط هنگام تغییر وضعیت هم‌پوشانی اجرا می‌شود — بدون شنونده پیوسته اسکرول
    const howActiveObserver = new IntersectionObserver(
      () => pickHowActive(),
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    );

    howStepItems.forEach((step) => howActiveObserver.observe(step));
  }
}

// ظاهر شدن پله‌ای بخش پلتفرم — همان الگوی how-steps
const platformText = document.querySelector('.platform-text');

if (platformText && 'IntersectionObserver' in window) {
  const platformObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          platformObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  platformObserver.observe(platformText);
}

// ظاهر شدن پله‌ای کارت‌های اعتماد — همان الگوی بخش‌های قبلی
const trustGrid = document.querySelector('#trust .trust-grid');

if (trustGrid && 'IntersectionObserver' in window) {
  const trustObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          trustObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  trustObserver.observe(trustGrid);
}

// ظاهر شدن پله‌ای بخش مقاله‌ها — همان الگوی بخش‌های قبلی
const blogInner = document.querySelector('#blog .blog-inner');

if (blogInner && 'IntersectionObserver' in window) {
  const blogObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          blogObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  blogObserver.observe(blogInner);
}
