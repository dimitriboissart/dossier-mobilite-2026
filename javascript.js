document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Navigation & Scroll ---
    window.scrollToSection = function (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    window.addEventListener('scroll', function () {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            // On ne met qu'UNE seule classe, le CSS gère le reste
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    // --- 2. Cartes Interactives (Mythes vs Faits) ---
    window.toggleFact = function (element, type) {
        const myth = document.getElementById(`myth-${type}`);
        const fact = document.getElementById(`fact-${type}`);

        element.classList.toggle('is-revealed');

        if (myth.classList.contains('block')) {
            myth.classList.replace('block', 'hidden');
            fact.classList.replace('hidden', 'block');
        } else {
            myth.classList.replace('hidden', 'block');
            fact.classList.replace('block', 'hidden');
        }
    }

    // --- 3. Logique des Onglets ---
    window.switchChartTab = function (tabName) {
        const tabs = ['tco', 'eco'];
        tabs.forEach(t => {
            const btn = document.getElementById(`tab-${t}`);
            const content = document.getElementById(`content-${t}`);
            if (t === tabName) {
                btn.classList.replace('tab-inactive', 'tab-active');
                content.classList.replace('hidden', 'block');
            } else {
                btn.classList.replace('tab-active', 'tab-inactive');
                content.classList.replace('block', 'hidden');
            }
        });
    }

    // --- 4. Graphique TCO (Coûts) ---
    const ctxTco = document.getElementById('tcoChart').getContext('2d');

    // Création des dégradés pour le graphique TCO
    const gradRed = ctxTco.createLinearGradient(0, 0, 0, 400);
    gradRed.addColorStop(0, 'rgba(225, 29, 72, 0.2)');
    gradRed.addColorStop(1, 'rgba(225, 29, 72, 0)');

    const gradGreen = ctxTco.createLinearGradient(0, 0, 0, 400);
    gradGreen.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
    gradGreen.addColorStop(1, 'rgba(16, 185, 129, 0)');

    const kmLabels = [0, 15000, 30000, 45000, 60000, 75000, 90000];

    new Chart(ctxTco, {
        type: 'line',
        data: {
            labels: kmLabels.map(km => km.toLocaleString('fr-FR') + ' km'),
            datasets: [
                {
                    label: 'Thermique',
                    data: kmLabels.map(km => 30000 + (km * 0.15)),
                    borderColor: '#e11d48',
                    backgroundColor: gradRed,
                    fill: true,
                    tension: 0.3,
                    borderWidth: 3
                },
                {
                    label: 'Électrique',
                    data: kmLabels.map(km => 35000 + (km * 0.039)),
                    borderColor: '#10b981',
                    backgroundColor: gradGreen,
                    fill: true,
                    tension: 0.3,
                    borderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: { ticks: { callback: v => v.toLocaleString('fr-FR') + ' €' } }
            }
        }
    });

    // --- 5. Graphique Écologie (Carbone) ---
    const ctxEco = document.getElementById('ecoChart').getContext('2d');
    const kmCarbonLabels = [0, 10000, 20000, 25000, 30000, 40000, 50000];

    new Chart(ctxEco, {
        type: 'line',
        data: {
            labels: kmCarbonLabels.map(km => km.toLocaleString('fr-FR') + ' km'),
            datasets: [
                {
                    label: 'Thermique',
                    data: kmCarbonLabels.map(km => 5 + (km * 0.00025)),
                    borderColor: '#e11d48',
                    borderDash: [5, 5],
                    tension: 0.3
                },
                {
                    label: 'Électrique',
                    data: kmCarbonLabels.map(km => 10 + (km * 0.00005)),
                    borderColor: '#10b981',
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Animation de révélation au scroll
    // Animation de révélation au scroll
    // Animation de révélation infinie (haut et bas)
    // --- 6. Animation de révélation infinie (Scroll haut et bas) ---
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // L'élément entre : on ajoute 'active'
                entry.target.classList.add('active');
            } else {
                // L'élément sort : on retire 'active' pour rejouer l'animation plus tard
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    // Fonction d'initialisation pour surveiller tous les éléments .reveal
    function initReveal() {
        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => {
            observer.observe(el);
        });
    }

    // Lancement de l'initialisation
    initReveal();

}); // Fermeture finale du DOMContentLoaded (très important) // Fin du DOMContentLoaded // Fermeture correcte du DOMContentLoaded