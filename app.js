/**
 * Hundkalkylatorn - Svensk Hundekonomi Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Stepper
  const stepTabs = document.querySelectorAll('.step-tab');
  const stepPanels = document.querySelectorAll('.step-section');
  const progressFill = document.getElementById('progress-fill');
  const nextButtons = document.querySelectorAll('.btn-next-step');
  const prevButtons = document.querySelectorAll('.btn-prev-step');
  const finishButton = document.getElementById('btn-finish-calc');
  const startCalcButton = document.getElementById('btn-start-calc');
  const jumpSummaryButton = document.getElementById('btn-jump-summary');

  // DOM Elements - Form Inputs
  const form = document.getElementById('dog-calc-form');
  const sizeRadios = document.querySelectorAll('input[name="dog_size"]');
  const locationRadios = document.querySelectorAll('input[name="location"]');
  const includePurchaseCheckbox = document.getElementById('include_initial_purchase');
  const purchaseFields = document.getElementById('purchase_fields');
  const purchasePriceSlider = document.getElementById('purchase_price');
  const purchasePriceVal = document.getElementById('purchase_price_val');
  const startKitSlider = document.getElementById('start_kit_price');
  const startKitPriceVal = document.getElementById('start_kit_price_val');

  // Daycare
  const daycareRadios = document.querySelectorAll('input[name="daycare_type"]');
  const daycareSlider = document.getElementById('daycare_cost_slider');
  const daycareVal = document.getElementById('daycare_cost_val');
  const daycareGroup = document.getElementById('daycare_custom_group');
  const daycareFullDesc = document.getElementById('daycare-full-desc');
  const daycarePartDesc = document.getElementById('daycare-part-desc');

  // Insurance & Vet
  const insuranceRadios = document.querySelectorAll('input[name="insurance_tier"]');
  const insuranceSlider = document.getElementById('insurance_slider');
  const insuranceVal = document.getElementById('insurance_cost_val');
  const dentalRadios = document.querySelectorAll('input[name="dental_care"]');
  const vetRoutineInput = document.getElementById('annual_vet_routine');
  const vetBufferInput = document.getElementById('monthly_vet_buffer');

  // Food & Treats
  const foodQualityRadios = document.querySelectorAll('input[name="food_quality"]');
  const foodSlider = document.getElementById('food_cost_slider');
  const foodVal = document.getElementById('food_cost_val');
  const treatsSlider = document.getElementById('treats_cost_slider');
  const treatsVal = document.getElementById('treats_cost_val');

  // Supplies & Gear
  const poopBagsInput = document.getElementById('cost_poop_bags');
  const coatsAnnualInput = document.getElementById('cost_coats_annual');
  const toysMonthlyInput = document.getElementById('cost_toys_monthly');
  const gearAnnualInput = document.getElementById('cost_gear_annual');
  const groomingMonthlyInput = document.getElementById('cost_grooming_monthly');

  // Training & Travel
  const trainingRadios = document.querySelectorAll('input[name="training_level"]');
  const hotelNightsInput = document.getElementById('hotel_nights_annual');
  const hotelCalcVal = document.getElementById('hotel_calc_val');
  const boardingDaysInput = document.getElementById('boarding_days_annual');
  const boardingCalcVal = document.getElementById('boarding_calc_val');

  // Summary Elements
  const totalMonthlyAmount = document.getElementById('total-monthly-amount');
  const totalAnnualAmount = document.getElementById('total-annual-amount');
  const totalYear1Amount = document.getElementById('total-year1-amount');
  const dailyCost = document.getElementById('daily-cost');
  const summaryProfileName = document.getElementById('summary-profile-name');
  const mobileMonthlyVal = document.getElementById('mobile-monthly-val');
  const heroQuickCity = document.getElementById('hero-quick-city');

  // Breakdown items
  const bCostDaycare = document.getElementById('b-cost-daycare');
  const bCostInsurance = document.getElementById('b-cost-insurance');
  const bCostDental = document.getElementById('b-cost-dental');
  const bCostFood = document.getElementById('b-cost-food');
  const bCostGear = document.getElementById('b-cost-gear');
  const bCostTravel = document.getElementById('b-cost-travel');

  // Presets & Utilities
  const btnQuickPresets = document.getElementById('btn-quick-presets');
  const presetButtons = document.querySelectorAll('.preset-card');
  const btnReset = document.getElementById('btn-reset-all');
  const btnShare = document.getElementById('btn-share-link');
  const btnPrint = document.getElementById('btn-print-summary');
  const toast = document.getElementById('toast');
  const btnMobileSheet = document.getElementById('btn-toggle-mobile-sheet');
  const summarySidebar = document.getElementById('summary-sidebar');

  let currentStep = 1;
  const totalSteps = 6;

  // Format SEK numbers with space separation
  function formatSEK(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Smooth scroll to the top of the active step questions, below sticky header
  function scrollToActiveStep() {
    const stepperNav = document.querySelector('.stepper-nav');
    if (stepperNav) {
      const headerEl = document.getElementById('header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 72;
      const targetY = stepperNav.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 14);
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
    }
  }

  // Set active step
  function goToStep(step, shouldScroll = false) {
    if (step < 1 || step > totalSteps) return;
    currentStep = step;

    // Update progress bar
    const percentage = ((currentStep) / totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;

    // Update tabs
    stepTabs.forEach(tab => {
      const tabStep = parseInt(tab.dataset.step, 10);
      tab.classList.toggle('active', tabStep === currentStep);
      tab.classList.toggle('completed', tabStep < currentStep);
    });

    // Update panels
    stepPanels.forEach(panel => {
      const panelStep = parseInt(panel.dataset.stepPanel, 10);
      panel.classList.toggle('active', panelStep === currentStep);
    });

    // Scroll smoothly to active step questions
    if (shouldScroll) {
      scrollToActiveStep();
    }
  }

  // Step button events
  stepTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      goToStep(parseInt(tab.dataset.step, 10), true);
    });
  });

  nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(parseInt(btn.dataset.next, 10), true);
    });
  });

  prevButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(parseInt(btn.dataset.prev, 10), true);
    });
  });

  if (startCalcButton) {
    startCalcButton.addEventListener('click', (e) => {
      e.preventDefault();
      goToStep(1, true);
    });
  }

  // Quick Presets header button
  if (btnQuickPresets) {
    btnQuickPresets.addEventListener('click', () => {
      const presetsContainer = document.getElementById('presets-container');
      if (presetsContainer) {
        const headerEl = document.getElementById('header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 72;
        const targetY = presetsContainer.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 16);
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        });
        presetsContainer.classList.add('highlight-pulse');
        setTimeout(() => presetsContainer.classList.remove('highlight-pulse'), 1300);
      }
    });
  }

  if (jumpSummaryButton) {
    jumpSummaryButton.addEventListener('click', () => {
      summarySidebar.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (finishButton) {
    finishButton.addEventListener('click', () => {
      summarySidebar.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnMobileSheet) {
    btnMobileSheet.addEventListener('click', () => {
      summarySidebar.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Toggle Initial Purchase Section
  if (includePurchaseCheckbox) {
    includePurchaseCheckbox.addEventListener('change', () => {
      purchaseFields.classList.toggle('hidden', !includePurchaseCheckbox.checked);
      calculateAll();
    });
  }

  // Update slider label texts
  function setupSliderLabels() {
    purchasePriceSlider.addEventListener('input', () => {
      purchasePriceVal.textContent = `${formatSEK(purchasePriceSlider.value)} kr`;
      calculateAll();
    });

    startKitSlider.addEventListener('input', () => {
      startKitPriceVal.textContent = `${formatSEK(startKitSlider.value)} kr`;
      calculateAll();
    });

    daycareSlider.addEventListener('input', () => {
      daycareVal.textContent = `${formatSEK(daycareSlider.value)} kr/mån`;
      calculateAll();
    });

    insuranceSlider.addEventListener('input', () => {
      insuranceVal.textContent = `${formatSEK(insuranceSlider.value)} kr/mån`;
      calculateAll();
    });

    foodSlider.addEventListener('input', () => {
      foodVal.textContent = `${formatSEK(foodSlider.value)} kr/mån`;
      calculateAll();
    });

    treatsSlider.addEventListener('input', () => {
      treatsVal.textContent = `${formatSEK(treatsSlider.value)} kr/mån`;
      calculateAll();
    });

    hotelNightsInput.addEventListener('input', () => {
      const cost = (parseInt(hotelNightsInput.value || 0, 10) * 300);
      hotelCalcVal.textContent = formatSEK(cost);
      calculateAll();
    });

    boardingDaysInput.addEventListener('input', () => {
      const cost = (parseInt(boardingDaysInput.value || 0, 10) * 500);
      boardingCalcVal.textContent = formatSEK(cost);
      calculateAll();
    });
  }

  // Helper to get checked radio value
  function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : null;
  }

  // Intelligent dynamic defaults when user changes location or dog size
  function onLocationOrSizeChange(userInitiated = true) {
    const loc = getRadioValue('location');
    const size = getRadioValue('dog_size');
    const daycareType = getRadioValue('daycare_type');

    // Daycare descriptions & default suggestions
    if (loc === 'stockholm') {
      daycareFullDesc.textContent = 'Stockholm: Ca 4 500 – 5 500 kr/mån';
      daycarePartDesc.textContent = 'Stockholm: Ca 3 200 – 4 000 kr/mån';
      if (userInitiated && daycareType === 'daycare_full') {
        daycareSlider.value = 5000;
        daycareVal.textContent = '5 000 kr/mån';
      }
    } else if (loc === 'major_city') {
      daycareFullDesc.textContent = 'Gbg/Malmö: Ca 3 800 – 4 500 kr/mån';
      daycarePartDesc.textContent = 'Gbg/Malmö: Ca 2 600 – 3 200 kr/mån';
      if (userInitiated && daycareType === 'daycare_full') {
        daycareSlider.value = 4200;
        daycareVal.textContent = '4 200 kr/mån';
      }
    } else {
      daycareFullDesc.textContent = 'Mindre stad: Ca 2 800 – 3 500 kr/mån';
      daycarePartDesc.textContent = 'Mindre stad: Ca 1 800 – 2 500 kr/mån';
      if (userInitiated && daycareType === 'daycare_full') {
        daycareSlider.value = 3200;
        daycareVal.textContent = '3 200 kr/mån';
      }
    }

    // Food suggestion according to size
    const foodQuality = getRadioValue('food_quality');
    let baseFood = 450;
    if (size === 'small') {
      baseFood = foodQuality === 'premium' ? 450 : (foodQuality === 'standard' ? 320 : 200);
    } else if (size === 'medium') {
      baseFood = foodQuality === 'premium' ? 850 : (foodQuality === 'standard' ? 600 : 380);
    } else if (size === 'large') {
      baseFood = foodQuality === 'premium' ? 1400 : (foodQuality === 'standard' ? 1000 : 650);
    }

    if (userInitiated) {
      foodSlider.value = baseFood;
      foodVal.textContent = `${formatSEK(baseFood)} kr/mån`;
    }

    // Dental suggestion: Small dogs have severe dental problems!
    if (userInitiated && size === 'small') {
      document.querySelector('input[name="dental_care"][value="high"]').checked = true;
    } else if (userInitiated && size === 'large') {
      document.querySelector('input[name="dental_care"][value="low"]').checked = true;
    }

    calculateAll();
  }

  // Daycare type change handling
  function onDaycareTypeChange() {
    const type = getRadioValue('daycare_type');
    const loc = getRadioValue('location');

    if (type === 'home_office') {
      daycareSlider.value = 0;
      daycareSlider.disabled = true;
      daycareGroup.style.opacity = '0.5';
    } else {
      daycareSlider.disabled = false;
      daycareGroup.style.opacity = '1';

      if (type === 'daycare_full') {
        daycareSlider.value = loc === 'stockholm' ? 5000 : (loc === 'major_city' ? 4200 : 3200);
      } else if (type === 'daycare_part') {
        daycareSlider.value = loc === 'stockholm' ? 3400 : (loc === 'major_city' ? 2800 : 2200);
      } else if (type === 'dogwalker') {
        daycareSlider.value = 2500;
      }
    }
    daycareVal.textContent = `${formatSEK(daycareSlider.value)} kr/mån`;
    calculateAll();
  }

  // Insurance tier change handling
  function onInsuranceTierChange() {
    const tier = getRadioValue('insurance_tier');
    const loc = getRadioValue('location');
    const size = getRadioValue('dog_size');

    let est = 1300;
    if (tier === 'premium') {
      est = loc === 'stockholm' ? 1300 : (loc === 'major_city' ? 1100 : 950);
    } else if (tier === 'standard') {
      est = loc === 'stockholm' ? 750 : (loc === 'major_city' ? 650 : 550);
    } else {
      est = loc === 'stockholm' ? 450 : (loc === 'major_city' ? 380 : 320);
    }

    insuranceSlider.value = est;
    insuranceVal.textContent = `${formatSEK(est)} kr/mån`;
    calculateAll();
  }

  // Main Calculation Engine
  function calculateAll() {
    // 1. Daycare & Walking
    const monthlyDaycare = parseInt(daycareSlider.value || 0, 10);

    // 2. Insurance & Vet
    const monthlyInsurance = parseInt(insuranceSlider.value || 0, 10);
    const monthlyVetBuffer = parseInt(vetBufferInput.value || 0, 10);
    const annualVetRoutine = parseInt(vetRoutineInput.value || 0, 10);
    const monthlyVetRoutine = annualVetRoutine / 12;

    // Dental Care
    const dentalChoice = getRadioValue('dental_care');
    let monthlyDental = 500; // default high (6000 kr / year)
    if (dentalChoice === 'medium') {
      monthlyDental = 250; // 3000 kr / year
    } else if (dentalChoice === 'low') {
      monthlyDental = 83; // 1000 kr / year
    }

    const totalInsuranceAndCare = monthlyInsurance + monthlyVetBuffer;
    const totalDentalAndRoutine = monthlyDental + monthlyVetRoutine;

    // 3. Food & Treats
    const monthlyFood = parseInt(foodSlider.value || 0, 10);
    const monthlyTreats = parseInt(treatsSlider.value || 0, 10);
    const totalFoodAndTreats = monthlyFood + monthlyTreats;

    // 4. Gear & Supplies
    const monthlyPoopBags = parseInt(poopBagsInput.value || 0, 10);
    const monthlyToys = parseInt(toysMonthlyInput.value || 0, 10);
    const monthlyGrooming = parseInt(groomingMonthlyInput.value || 0, 10);
    const annualCoats = parseInt(coatsAnnualInput.value || 0, 10);
    const annualGear = parseInt(gearAnnualInput.value || 0, 10);
    const monthlyGearCoats = (annualCoats + annualGear) / 12;
    const totalGearAndSupplies = monthlyPoopBags + monthlyToys + monthlyGrooming + monthlyGearCoats;

    // 5. Training & Travel
    const trainingChoice = getRadioValue('training_level');
    let annualTraining = 3500;
    if (trainingChoice === 'puppy_only') {
      annualTraining = 1800;
    } else if (trainingChoice === 'none') {
      annualTraining = 0;
    }

    const hotelNights = parseInt(hotelNightsInput.value || 0, 10);
    const annualHotel = hotelNights * 300; // ca 300 kr per night extra for dog room

    const boardingDays = parseInt(boardingDaysInput.value || 0, 10);
    const annualBoarding = boardingDays * 500; // ca 500 kr / 24h

    const monthlyTrainingAndTravel = (annualTraining + annualHotel + annualBoarding) / 12;

    // Grand Totals
    const grandMonthly = monthlyDaycare + 
                         totalInsuranceAndCare + 
                         totalDentalAndRoutine + 
                         totalFoodAndTreats + 
                         totalGearAndSupplies + 
                         monthlyTrainingAndTravel;

    const grandAnnualRunning = grandMonthly * 12;

    // Initial Purchase
    let initialCost = 0;
    if (includePurchaseCheckbox.checked) {
      const puppyPrice = parseInt(purchasePriceSlider.value || 0, 10);
      const startKitPrice = parseInt(startKitSlider.value || 0, 10);
      initialCost = puppyPrice + startKitPrice;
    }
    const grandYear1 = grandAnnualRunning + initialCost;

    // Daily cost
    const daily = grandMonthly / 30;

    // Update UI numbers
    totalMonthlyAmount.textContent = formatSEK(grandMonthly);
    totalAnnualAmount.textContent = `${formatSEK(grandAnnualRunning)} kr`;
    totalYear1Amount.textContent = `${formatSEK(grandYear1)} kr`;
    dailyCost.textContent = `${formatSEK(daily)} kr`;
    mobileMonthlyVal.textContent = `${formatSEK(grandMonthly)} kr/mån`;

    // Update Breakdown Text
    bCostDaycare.textContent = `${formatSEK(monthlyDaycare)} kr`;
    bCostInsurance.textContent = `${formatSEK(totalInsuranceAndCare)} kr`;
    bCostDental.textContent = `${formatSEK(totalDentalAndRoutine)} kr`;
    bCostFood.textContent = `${formatSEK(totalFoodAndTreats)} kr`;
    bCostGear.textContent = `${formatSEK(totalGearAndSupplies)} kr`;
    bCostTravel.textContent = `${formatSEK(monthlyTrainingAndTravel)} kr`;

    // Update Stacked Bar Percentages
    updateStackedBar(grandMonthly, [
      { selector: '.bar-daycare', amount: monthlyDaycare },
      { selector: '.bar-insurance', amount: totalInsuranceAndCare },
      { selector: '.bar-dental', amount: totalDentalAndRoutine },
      { selector: '.bar-food', amount: totalFoodAndTreats },
      { selector: '.bar-misc', amount: totalGearAndSupplies + monthlyTrainingAndTravel }
    ]);
  }

  function updateStackedBar(total, segments) {
    if (total <= 0) return;
    segments.forEach(seg => {
      const el = document.querySelector(seg.selector);
      if (el) {
        const pct = Math.max(1, (seg.amount / total) * 100);
        el.style.width = `${pct}%`;
      }
    });
  }

  // Presets definition
  const presets = {
    'stockholm-yorkie': {
      name: 'Stockholms-Yorkie med lyx & dagis',
      size: 'small',
      location: 'stockholm',
      purchase: true,
      purchasePrice: 28000,
      startKit: 4500,
      daycareType: 'daycare_full',
      daycareCost: 5000,
      insuranceTier: 'premium',
      insuranceCost: 1300,
      dental: 'high',
      vetRoutine: 1400,
      vetBuffer: 350,
      foodQuality: 'premium',
      foodCost: 450,
      treatsCost: 250,
      poopBags: 95,
      coatsAnnual: 1400,
      toysMonthly: 120,
      gearAnnual: 900,
      groomingMonthly: 450,
      trainingLevel: 'active',
      hotelNights: 6,
      boardingDays: 4
    },
    'family-golden': {
      name: 'Familjens Golden i villa',
      size: 'large',
      location: 'major_city',
      purchase: true,
      purchasePrice: 24000,
      startKit: 6000,
      daycareType: 'home_office',
      daycareCost: 0,
      insuranceTier: 'standard',
      insuranceCost: 750,
      dental: 'low',
      vetRoutine: 1200,
      vetBuffer: 300,
      foodQuality: 'standard',
      foodCost: 1100,
      treatsCost: 350,
      poopBags: 120,
      coatsAnnual: 300,
      toysMonthly: 150,
      gearAnnual: 800,
      groomingMonthly: 150,
      trainingLevel: 'puppy_only',
      hotelNights: 4,
      boardingDays: 0
    },
    'active-border': {
      name: 'Aktiv brukshund / Mellanhund',
      size: 'medium',
      location: 'stockholm',
      purchase: true,
      purchasePrice: 22000,
      startKit: 5000,
      daycareType: 'daycare_part',
      daycareCost: 3400,
      insuranceTier: 'standard',
      insuranceCost: 800,
      dental: 'medium',
      vetRoutine: 1500,
      vetBuffer: 400,
      foodQuality: 'premium',
      foodCost: 850,
      treatsCost: 400,
      poopBags: 100,
      coatsAnnual: 800,
      toysMonthly: 200,
      gearAnnual: 1400,
      groomingMonthly: 100,
      trainingLevel: 'active',
      hotelNights: 5,
      boardingDays: 2
    },
    'budget-conscious': {
      name: 'Egen regi & Småstad',
      size: 'small',
      location: 'small_town',
      purchase: false,
      purchasePrice: 0,
      startKit: 2000,
      daycareType: 'home_office',
      daycareCost: 0,
      insuranceTier: 'basic',
      insuranceCost: 350,
      dental: 'medium',
      vetRoutine: 900,
      vetBuffer: 200,
      foodQuality: 'standard',
      foodCost: 320,
      treatsCost: 150,
      poopBags: 60,
      coatsAnnual: 400,
      toysMonthly: 50,
      gearAnnual: 300,
      groomingMonthly: 0,
      trainingLevel: 'none',
      hotelNights: 0,
      boardingDays: 0
    }
  };

  // Apply a Preset
  function applyPreset(key) {
    const data = presets[key];
    if (!data) return;

    summaryProfileName.textContent = data.name;

    // Size & Location
    document.querySelector(`input[name="dog_size"][value="${data.size}"]`).checked = true;
    document.querySelector(`input[name="location"][value="${data.location}"]`).checked = true;

    // Purchase
    includePurchaseCheckbox.checked = data.purchase;
    purchaseFields.classList.toggle('hidden', !data.purchase);
    purchasePriceSlider.value = data.purchasePrice;
    purchasePriceVal.textContent = `${formatSEK(data.purchasePrice)} kr`;
    startKitSlider.value = data.startKit;
    startKitPriceVal.textContent = `${formatSEK(data.startKit)} kr`;

    // Daycare
    document.querySelector(`input[name="daycare_type"][value="${data.daycareType}"]`).checked = true;
    daycareSlider.value = data.daycareCost;
    daycareVal.textContent = `${formatSEK(data.daycareCost)} kr/mån`;
    if (data.daycareType === 'home_office') {
      daycareSlider.disabled = true;
      daycareGroup.style.opacity = '0.5';
    } else {
      daycareSlider.disabled = false;
      daycareGroup.style.opacity = '1';
    }

    // Insurance & Vet
    document.querySelector(`input[name="insurance_tier"][value="${data.insuranceTier}"]`).checked = true;
    insuranceSlider.value = data.insuranceCost;
    insuranceVal.textContent = `${formatSEK(data.insuranceCost)} kr/mån`;
    document.querySelector(`input[name="dental_care"][value="${data.dental}"]`).checked = true;
    vetRoutineInput.value = data.vetRoutine;
    vetBufferInput.value = data.vetBuffer;

    // Food & Treats
    document.querySelector(`input[name="food_quality"][value="${data.foodQuality}"]`).checked = true;
    foodSlider.value = data.foodCost;
    foodVal.textContent = `${formatSEK(data.foodCost)} kr/mån`;
    treatsSlider.value = data.treatsCost;
    treatsVal.textContent = `${formatSEK(data.treatsCost)} kr/mån`;

    // Gear
    poopBagsInput.value = data.poopBags;
    coatsAnnualInput.value = data.coatsAnnual;
    toysMonthlyInput.value = data.toysMonthly;
    gearAnnualInput.value = data.gearAnnual;
    groomingMonthlyInput.value = data.groomingMonthly;

    // Training & Travel
    document.querySelector(`input[name="training_level"][value="${data.trainingLevel}"]`).checked = true;
    hotelNightsInput.value = data.hotelNights;
    hotelCalcVal.textContent = formatSEK(data.hotelNights * 300);
    boardingDaysInput.value = data.boardingDays;
    boardingCalcVal.textContent = formatSEK(data.boardingDays * 500);

    // Active button style
    presetButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === key);
    });

    calculateAll();
  }

  // Presets listeners
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyPreset(btn.dataset.preset);
    });
  });

  // Reset all
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      applyPreset('stockholm-yorkie');
      goToStep(1, true);
      showToast('Alla val har återställts till standard');
    });
  }

  // Print Summary
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Share URL with state
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      const stateObj = {
        size: getRadioValue('dog_size'),
        loc: getRadioValue('location'),
        daycare: daycareSlider.value,
        ins: insuranceSlider.value,
        food: foodSlider.value,
        treats: treatsSlider.value
      };
      const encoded = encodeURIComponent(JSON.stringify(stateObj));
      const url = `${window.location.origin}${window.location.pathname}#state=${encoded}`;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Länk med dina inställningar kopierades!');
      }).catch(() => {
        showToast('Kunde inte kopiera automatiskt');
      });
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Wire event listeners on inputs
  sizeRadios.forEach(r => r.addEventListener('change', () => onLocationOrSizeChange(true)));
  locationRadios.forEach(r => r.addEventListener('change', () => onLocationOrSizeChange(true)));
  daycareRadios.forEach(r => r.addEventListener('change', onDaycareTypeChange));
  insuranceRadios.forEach(r => r.addEventListener('change', onInsuranceTierChange));
  dentalRadios.forEach(r => r.addEventListener('change', calculateAll));
  foodQualityRadios.forEach(r => r.addEventListener('change', () => onLocationOrSizeChange(true)));
  trainingRadios.forEach(r => r.addEventListener('change', calculateAll));

  // Number inputs
  [
    vetRoutineInput, vetBufferInput, poopBagsInput, coatsAnnualInput,
    toysMonthlyInput, gearAnnualInput, groomingMonthlyInput
  ].forEach(input => {
    if (input) input.addEventListener('input', calculateAll);
  });

  // Init
  setupSliderLabels();
  applyPreset('stockholm-yorkie');
});
