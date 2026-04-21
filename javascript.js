// JavaScript moved from index.html
document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scrolling
    window.scrollToSection = function(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({top: y, behavior: 'smooth'});
        }
    }

    // Interactive Cards Logic (Myths vs Facts)
    window.toggleFact = function(element, type) {
        const myth = document.getElementById(`myth-${type}`);
        const fact = document.getElementById(`fact-${type}`);
        if (myth.classList.contains('block')) {
            myth.classList.remove('block');
            myth.classList.add('hidden');
            fact.classList.remove('hidden');
            fact.classList.add('block');
            element.classList.add('border-accent-primary', 'bg-red-50');
        } else {
            myth.classList.remove('hidden');
            myth.classList.add('block');
            fact.classList.remove('block');
            fact.classList.add('hidden');
            element.classList.remove('border-accent-primary', 'bg-red-50');
        }
    }

    // Tabs Logic for Charts
    window.switchChartTab = function(tabName) {
        const tabs = ['tco', 'eco'];
        tabs.forEach(t => {
            const btn = document.getElementById(`tab-${t}`);
            const content = document.getElementById(`content-${t}`);
            if (t === tabName) {
                btn.classList.remove('tab-inactive');
                btn.classList.add('tab-active');
                content.classList.remove('hidden');
                content.classList.add('block');
            } else {
                btn.classList.remove('tab-active');
                btn.classList.add('tab-inactive');
                content.classList.remove('block');
                content.classList.add('hidden');
            }
        });
    }

    // Data Generation for TCO Chart
    const kmLabels = [0, 15000, 30000, 45000, 60000, 75000, 90000];
    const tcoThermique = kmLabels.map(km => 30000 + (km * 0.15));
    const tcoElectrique = kmLabels.map(km => 35000 + (km * 0.039));
    const ctxTco = document.getElementById('tcoChart').getContext('2d');
    new Chart(ctxTco, {
        type: 'line',
        data: {
            labels: kmLabels.map(km => km.toLocaleString('fr-FR') + ' km'),
            datasets: [
                {
                    label: 'Thermique (Achat + Essence + Entretien)',
                    data: tcoThermique,
                    borderColor: '#e11d48',
                    backgroundColor: 'rgba(225, 29, 72, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.1
                },
                {
                    label: 'Électrique (Achat + Électricité + Entretien)',
                    data: tcoElectrique,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { font: { family: 'Inter' } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: { display: true, text: 'Coût cumulé (€)' },
                    ticks: { callback: function(value) { return value.toLocaleString('fr-FR') + ' €'; } }
                },
                x: { title: { display: true, text: 'Kilométrage cumulé' } }
            }
        }
    });

    // Data Generation for Carbon Chart
    const kmCarbonLabels = [0, 10000, 20000, 25000, 30000, 40000, 50000];
    const carbonThermique = kmCarbonLabels.map(km => 5 + (km * 0.00025));
    const carbonElectrique = kmCarbonLabels.map(km => 10 + (km * 0.00005));
    const ctxEco = document.getElementById('ecoChart').getContext('2d');
    new Chart(ctxEco, {
        type: 'line',
        data: {
            labels: kmCarbonLabels.map(km => km.toLocaleString('fr-FR') + ' km'),
            datasets: [
                {
                    label: 'Thermique (Dette fab. + Émissions)',
                    data: carbonThermique,
                    borderColor: '#e11d48',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    tension: 0.1
                },
                {
                    label: 'Électrique (Dette fab. + Émissions limitées)',
                    data: carbonElectrique,
                    borderColor: '#10b981',
                    borderWidth: 3,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { font: { family: 'Inter' } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + ' Tonnes CO2';
                        }
                    }
                }
            },
            scales: {
                y: { title: { display: true, text: 'Émissions cumulées (Tonnes CO2 eq.)' } },
                x: { title: { display: true, text: 'Kilométrage cumulé' } }
            }
        }
    });
});